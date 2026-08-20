export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ConfirmResetPasswordCredentials {
  email: string;
  code: string;
  newPassword: string;
}

export interface ConfirmSignUpCredentials {
  email: string;
  code: string;
}
