'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { signInSchema, type SignInValues } from '@/validation/auth.validation';
import { clearAuthEmail, clearResetPasswordToken, saveAccessToken } from '@/utils/auth';
import { useSignInMutation } from '@/redux/features/auth/auth.api';


export default function SignInPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const [signIn, { isLoading }] = useSignInMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifierType: 'email',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInValues) => {
    // console.log(values)
    try {
      const response = await signIn(values).unwrap();
      saveAccessToken(response.token);
      clearAuthEmail();
      clearResetPasswordToken();
      toast.success('Login successfully');
      router.push('/');
    } catch (error) {
      // console.log(error)
      const message = error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
        ? String((error.data as { message?: string }).message ?? 'Failed to sign in')
        : 'Failed to sign in';
      toast.error(message);
    }
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-title md:text-3xl">Welcome back!</h1>
      <p className="mt-2 text-center text-base text-description">Please enter your details to log in to admin dashboard.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <input type="hidden" {...register('identifierType')} />
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-title">Email</label>
          <Input {...register('email')} type="email" placeholder="Enter your email address" className="h-12" />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-title">Password</label>
          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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
          {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 h-12 w-full rounded-full bg-[#D94906] text-base font-semibold text-white hover:bg-[#c34105] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <Link
          href="/auth/forgot-password"
          className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#F6C6A6] text-base font-semibold text-[#D94906] cursor-pointer"
        >
          Forgot password
        </Link>
      </form>
    </div>
  );
}
