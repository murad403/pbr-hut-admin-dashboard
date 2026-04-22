'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { verifyOtpSchema, type VerifyOtpValues } from '@/validation/auth.validation';
import { getAuthEmail, saveResetPasswordToken } from '@/utils/auth';
import { useForgotPasswordMutation, useVerifyOtpMutation } from '@/redux/features/auth/auth.api';

export default function VerifyOtpPage() {
    const router = useRouter();
    const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
    const [secondsLeft, setSecondsLeft] = React.useState(60);
    const authEmail = React.useMemo(() => getAuthEmail() ?? '', []);
    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
    const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyOtpValues>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            flow: 'forgot-password',
            identifierType: 'email',
            email: '',
            otp: '',
        },
    });

    const otp = useWatch({ control, name: 'otp' }) ?? '';
    const digits = Array.from({ length: 6 }, (_, idx) => otp[idx] ?? '');

    React.useEffect(() => {
        if (!authEmail) {
            router.replace('/auth/forgot-password');
            return;
        }

        setValue('email', authEmail, { shouldDirty: false, shouldTouch: false });
    }, [authEmail, router, setValue]);

    React.useEffect(() => {
        if (secondsLeft <= 0) return;

        const timer = window.setInterval(() => {
            setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [secondsLeft]);

    const updateDigit = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const nextDigits = [...digits];
        nextDigits[index] = value;
        setValue('otp', nextDigits.join(''), { shouldValidate: true, shouldDirty: true });

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        event.preventDefault();

        const pasted = event.clipboardData.getData('text');
        const normalized = pasted.replace(/\D/g, '').slice(0, 6);
        if (!normalized) return;

        const nextDigits = [...digits];
        for (let i = 0; i < normalized.length && index + i < nextDigits.length; i += 1) {
            nextDigits[index + i] = normalized[i];
        }

        const nextOtp = nextDigits.join('');
        setValue('otp', nextOtp, { shouldValidate: true, shouldDirty: true });

        const focusIndex = Math.min(index + normalized.length, nextDigits.length - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    const onSubmit = async (values: VerifyOtpValues) => {
        try {
            const response = await verifyOtp(values).unwrap();
            saveResetPasswordToken(response.token);
            toast.success('Otp verified successfully, you can now reset your password');
            router.push('/auth/reset-password');
        } catch (error) {
            const message = (error as { data?: { message?: string } } | undefined)?.data?.message ?? 'Failed to verify OTP';
            toast.error(message);
        }
    };

    const handleResend = async () => {
        if (!authEmail || secondsLeft > 0) return;

        try {
            await forgotPassword({ identifierType: 'email', email: authEmail }).unwrap();
            setSecondsLeft(60);
            toast.success('Password reset OTP sent again');
        } catch (error) {
            const message = (error as { data?: { message?: string } } | undefined)?.data?.message ?? 'Failed to resend OTP';
            toast.error(message);
        }
    };

    return (
        <div>
            <h1 className="text-center text-2xl font-semibold text-title md:text-3xl">Verify OTP</h1>
            <p className="mt-2 text-center text-base text-description">We&apos;ve sent a 6 digit OTP to your email.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                <input type="hidden" {...register('flow')} />
                <input type="hidden" {...register('identifierType')} />
                <input type="hidden" {...register('email')} />

                <div className="flex items-center justify-center gap-2.5">
                    {digits.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(element) => {
                                inputRefs.current[idx] = element;
                            }}
                            value={digit}
                            onChange={(event) => updateDigit(idx, event.target.value)}
                            onKeyDown={(event) => onKeyDown(event, idx)}
                            onPaste={(event) => handlePaste(event, idx)}
                            inputMode="numeric"
                            maxLength={1}
                            className="size-14 rounded-xl border border-transparent bg-[#EBEBEB] text-center text-xl font-semibold text-title outline-none focus:border-[#D94906]/40 cursor-pointer"
                        />
                    ))}
                </div>
                {errors.otp ? <p className="text-center text-xs text-red-600">{errors.otp.message}</p> : null}

                <button
                    type="submit"
                    disabled={isVerifying}
                    className="h-12 w-full rounded-full bg-[#D94906] text-base font-semibold text-white hover:bg-[#c34105] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                >
                    {isVerifying ? 'Verifying...' : 'Verify'}
                </button>

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={secondsLeft > 0 || isResending}
                    className="mx-auto block text-base font-semibold text-[#D94906] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                    {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : isResending ? 'Resending...' : 'Resend'}
                </button>
            </form>
        </div>
    );
}
