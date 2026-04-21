'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { verifyOtpSchema, type VerifyOtpValues } from '@/validation/auth.validation';

export default function VerifyOtpPage() {
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const otp = watch('otp');
  const digits = Array.from({ length: 6 }, (_, idx) => otp[idx] ?? '');

  const updateDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const nextDigits = [...digits];
    nextDigits[index] = value;
    setValue('otp', nextDigits.join(''), { shouldValidate: true });

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = (values: VerifyOtpValues) => {
    console.log('Verify OTP values:', values);
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-title md:text-3xl">Verify OTP</h1>
      <p className="mt-2 text-center text-base text-description">We&apos;ve sent a 6 digit OTP to your email.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
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
              inputMode="numeric"
              maxLength={1}
              className="size-14 rounded-xl border border-transparent bg-[#EBEBEB] text-center text-xl font-semibold text-title outline-none focus:border-[#D94906]/40 cursor-pointer"
            />
          ))}
        </div>
        {errors.otp ? <p className="text-center text-xs text-red-600">{errors.otp.message}</p> : null}

        <button
          type="submit"
          className="h-12 w-full rounded-full bg-[#D94906] text-base font-semibold text-white hover:bg-[#c34105] cursor-pointer"
        >
          Verify
        </button>

        <button type="button" className="mx-auto block text-base font-semibold text-[#D94906] cursor-pointer">
          Resend
        </button>
      </form>
    </div>
  );
}
