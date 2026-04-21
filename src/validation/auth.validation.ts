import { z } from 'zod';

export const signInSchema = z.object({
	identifierType: z.literal('email'),
	email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
	password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
	identifierType: z.literal('email'),
	email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export const verifyOtpSchema = z.object({
	flow: z.literal('forgot-password'),
	identifierType: z.literal('email'),
	email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
	otp: z.string().regex(/^\d{6}$/, 'Enter a valid 6 digit OTP'),
});

export const resetPasswordSchema = z
	.object({
		token: z.string().min(1, 'Reset token is required'),
		newPassword: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string().min(1, 'Confirm password is required'),
	})
	.refine((values) => values.newPassword === values.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Passwords do not match',
	});

export type SignInValues = z.infer<typeof signInSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
