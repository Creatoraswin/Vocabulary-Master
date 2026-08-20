import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import {
  User,
  SignInCredentials,
  SignUpCredentials,
  ConfirmSignUpCredentials,
  ConfirmResetPasswordCredentials,
} from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (credentials: SignInCredentials) => Promise<User>;
  signUp: (credentials: SignUpCredentials) => Promise<{ isSignUpComplete: boolean; user: User }>;
  confirmSignUp: (credentials: ConfirmSignUpCredentials) => Promise<boolean>;
  resendConfirmationCode: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  confirmResetPassword: (credentials: ConfirmResetPasswordCredentials) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err: any) {
        console.warn('[useAuth] User session check:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const clearError = () => setError(null);

  const handleSignIn = async (credentials: SignInCredentials): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const authenticatedUser = await authService.signIn(credentials);
      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (err: any) {
      const msg = err?.message || 'Failed to sign in. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (credentials: SignUpCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.signUp(credentials);
      if (result.isSignUpComplete) {
        setUser(result.user);
      }
      return result;
    } catch (err: any) {
      const msg = err?.message || 'Failed to register. Please try again.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (credentials: ConfirmSignUpCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const isComplete = await authService.confirmSignUp(credentials);
      return isComplete;
    } catch (err: any) {
      const msg = err?.message || 'Invalid confirmation code.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmationCode = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await authService.resendConfirmationCode(email);
    } catch (err: any) {
      const msg = err?.message || 'Failed to resend confirmation code.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await authService.forgotPassword(email);
    } catch (err: any) {
      const msg = err?.message || 'Failed to request password reset.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmResetPassword = async (credentials: ConfirmResetPasswordCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      return await authService.confirmResetPassword(credentials);
    } catch (err: any) {
      const msg = err?.message || 'Failed to reset password.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } catch (err: any) {
      console.warn('[useAuth] Sign out warning:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        confirmSignUp: handleConfirmSignUp,
        resendConfirmationCode: handleResendConfirmationCode,
        forgotPassword: handleForgotPassword,
        confirmResetPassword: handleConfirmResetPassword,
        signOut: handleSignOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
