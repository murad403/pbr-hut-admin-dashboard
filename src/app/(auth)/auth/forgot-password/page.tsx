'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/validation/auth.validation';
import { saveAuthEmail } from '@/utils/auth';
import { useForgotPasswordMutation } from '@/redux/features/auth/auth.api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifierType: 'email',
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      const response = await forgotPassword(values).unwrap();
      saveAuthEmail(response.identifier);
      toast.success('Password reset OTP sent');
      router.push('/auth/verify-otp');
    } catch (error) {
      const message = error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
        ? String((error.data as { message?: string }).message ?? 'Failed to send OTP')
        : 'Failed to send OTP';
      toast.error(message);
    }
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-title md:text-3xl">Forgot password?</h1>
      <p className="mt-2 text-center text-base text-description">
        Enter your registered email address. We&apos;ll send a 6-digit code for OTP verification.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <input type="hidden" {...register('identifierType')} />
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-title">Email</label>
          <Input {...register('email')} type="email" placeholder="Enter registered email address" className="h-12" />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 h-12 w-full rounded-full bg-[#D94906] text-base font-semibold text-white hover:bg-[#c34105] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Sending...' : 'Get OTP'}
        </button>
      </form>
    </div>
  );
}
