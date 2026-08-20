import { signIn, signUp, signOut, resetPassword, confirmResetPassword, confirmSignUp, getCurrentUser } from 'aws-amplify/auth';
import { getAmplifyStatus } from './amplifyConfig';
import { storageService } from './storageService';
import { APP_CONFIG } from '../constants/config';
import {
  User,
  SignInCredentials,
  SignUpCredentials,
  ConfirmSignUpCredentials,
  ConfirmResetPasswordCredentials,
} from '../types/auth.types';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    const { isAwsConnected } = getAmplifyStatus();

    if (isAwsConnected) {
      try {
        const user = await getCurrentUser();
        return {
          id: user.userId,
          email: user.signInDetails?.loginId || user.username,
          name: user.username,
        };
      } catch {
        return null;
      }
    }

    // Local / development authentication state
    return await storageService.getItem<User | null>(APP_CONFIG.storageKeys.AUTH_USER, null);
  },

  async signIn(credentials: SignInCredentials): Promise<User> {
    const { isAwsConnected } = getAmplifyStatus();

    if (isAwsConnected) {
      const output = await signIn({
        username: credentials.email.trim(),
        password: credentials.password,
      });

      if (output.isSignedIn) {
        const currentUser = await getCurrentUser();
        const user: User = {
          id: currentUser.userId,
          email: credentials.email.trim(),
          name: currentUser.username || credentials.email.split('@')[0],
        };
        await storageService.setItem(APP_CONFIG.storageKeys.AUTH_USER, user);
        return user;
      }
      throw new Error('Sign in requires additional confirmation.');
    }

    // Development authentication
    const email = credentials.email.trim().toLowerCase();
    const name = email.split('@')[0];
    const user: User = {
      id: `usr-${Date.now()}`,
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      emailVerified: true,
    };

    await storageService.setItem(APP_CONFIG.storageKeys.AUTH_USER, user);
    return user;
  },

  async signUp(credentials: SignUpCredentials): Promise<{ isSignUpComplete: boolean; user: User }> {
    const { isAwsConnected } = getAmplifyStatus();

    if (isAwsConnected) {
      const result = await signUp({
        username: credentials.email.trim(),
        password: credentials.password,
        options: {
          userAttributes: {
            name: credentials.name.trim(),
            email: credentials.email.trim(),
          },
        },
      });

      const user: User = {
        id: result.userId || `usr-${Date.now()}`,
        email: credentials.email.trim(),
        name: credentials.name.trim(),
        emailVerified: result.isSignUpComplete,
      };

      if (result.isSignUpComplete) {
        await storageService.setItem(APP_CONFIG.storageKeys.AUTH_USER, user);
      }
      return { isSignUpComplete: result.isSignUpComplete, user };
    }

    // Development signup
    const user: User = {
      id: `usr-${Date.now()}`,
      email: credentials.email.trim().toLowerCase(),
      name: credentials.name.trim(),
      emailVerified: true,
    };

    await storageService.setItem(APP_CONFIG.storageKeys.AUTH_USER, user);
    return { isSignUpComplete: true, user };
  },

  async confirmSignUp(credentials: ConfirmSignUpCredentials): Promise<boolean> {
    const { isAwsConnected } = getAmplifyStatus();

    if (isAwsConnected) {
      const result = await confirmSignUp({
        username: credentials.email.trim(),
        confirmationCode: credentials.code.trim(),
      });
      return result.isSignUpComplete;
    }

    return true;
  },

  async forgotPassword(email: string): Promise<boolean> {
    const { isAwsConnected } = getAmplifyStatus();

    if (isAwsConnected) {
      await resetPassword({
        username: email.trim(),
      });
      return true;
    }

    return true;
  },

  async confirmResetPassword(credentials: ConfirmResetPasswordCredentials): Promise<boolean> {
    const { isAwsConnected } = getAmplifyStatus();

    if (isAwsConnected) {
      await confirmResetPassword({
        username: credentials.email.trim(),
        confirmationCode: credentials.code.trim(),
        newPassword: credentials.newPassword,
      });
      return true;
    }

    return true;
  },

  async signOut(): Promise<void> {
    const { isAwsConnected } = getAmplifyStatus();

    if (isAwsConnected) {
      try {
        await signOut();
      } catch (error) {
        console.warn('[authService] Sign out warning:', error);
      }
    }

    await storageService.removeItem(APP_CONFIG.storageKeys.AUTH_USER);
  },
};
