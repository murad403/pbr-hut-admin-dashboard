export type IdentifierType = 'email';

export type SignInRequest = {
  identifierType: IdentifierType;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  phone: string;
  name: string;
  profilePicture: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SignInResponse = {
  token: string;
  user: AuthUser;
};

export type ForgotPasswordRequest = {
  identifierType: IdentifierType;
  email: string;
};

export type ForgotPasswordResponse = {
  identifier: string;
};

export type VerifyOtpRequest = {
  flow: 'forgot-password';
  otp: string;
  identifierType: IdentifierType;
  email: string;
};

export type VerifyOtpResponse = {
  token: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type ResetPasswordResponse = null;

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = null;