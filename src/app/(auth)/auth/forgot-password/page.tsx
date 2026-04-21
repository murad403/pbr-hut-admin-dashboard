'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/validation/auth.validation';

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: ForgotPasswordValues) => {
    console.log('Forgot password values:', values);
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-title md:text-3xl">Forgot password?</h1>
      <p className="mt-2 text-center text-base text-description">
        Enter your registered email address. We&apos;ll send a 6-digit code for OTP verification.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-title">Email</label>
          <Input {...register('email')} type="email" placeholder="Enter registered email address" className="h-12" />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
        </div>

        <button
          type="submit"
          className="mt-3 h-12 w-full rounded-full bg-[#D94906] text-base font-semibold text-white hover:bg-[#c34105] cursor-pointer"
        >
          Get OTP
        </button>
      </form>
    </div>
  );
}
