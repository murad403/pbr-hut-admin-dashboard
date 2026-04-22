'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { resetPasswordSchema, type ResetPasswordValues } from '@/validation/auth.validation';
import { clearAllAuthCookies, getResetPasswordToken } from '@/utils/auth';
import { useResetPasswordMutation } from '@/redux/features/auth/auth.api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const resetToken = getResetPasswordToken() ?? '';

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  React.useEffect(() => {
    if (!resetToken) {
      router.replace('/auth/forgot-password');
      return;
    }

    setValue('token', resetToken, { shouldDirty: false, shouldTouch: false });
  }, [resetToken, router, setValue]);

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      await resetPassword({ token: resetToken, newPassword: values.newPassword }).unwrap();
      clearAllAuthCookies();
      toast.success('Password reset successfully');
      router.push('/auth/sign-in');
    } catch (error) {
      const message = (error as { data?: { message?: string } } | undefined)?.data?.message ?? 'Failed to reset password';
      toast.error(message);
    }
  };

  if (!resetToken) {
    return null;
  }

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-title md:text-3xl">Create a new password</h1>
      <p className="mt-2 text-center text-base text-description">Make sure it&apos;s a strong password.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <input type="hidden" {...register('token')} />

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-title">New Password</label>
          <div className="relative">
            <Input
              {...register('newPassword')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              className="h-12 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/55"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.newPassword ? <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p> : null}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-title">Confirm Password</label>
          <div className="relative">
            <Input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              className="h-12 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/55"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirmPassword ? <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p> : null}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 h-12 w-full rounded-full bg-[#D94906] text-base font-semibold text-white hover:bg-[#c34105] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
