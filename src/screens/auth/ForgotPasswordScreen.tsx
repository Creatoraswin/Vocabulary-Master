import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { useAuth } from '../../hooks/useAuth';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
} from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const Container = styled.View`
  flex: 1;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
`;

const FormCard = styled.View`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => theme.spacing.xl}px;
  ${({ theme }) => theme.shadows.md}
`;

const InstructionText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const GeneralErrorBox = styled.View`
  background-color: ${({ theme }) => theme.colors.status.errorLight};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const GeneralErrorText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.status.error};
`;

const SuccessBox = styled.View`
  background-color: ${({ theme }) => theme.colors.status.successLight};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SuccessText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.status.success};
`;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { forgotPassword, confirmResetPassword, isLoading, error, clearError } = useAuth();

  const [step, setStep] = useState<'REQUEST_CODE' | 'CONFIRM_CODE'>('REQUEST_CODE');
  const [email, setEmail] = useState(route.params?.email || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSendCode = async () => {
    clearError();
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setErrors({ email: emailCheck.error || 'Invalid email' });
      return;
    }

    setErrors({});
    try {
      await forgotPassword(email);
      setSuccessMessage('A verification code has been sent to your email.');
      setStep('CONFIRM_CODE');
    } catch {
      // Handled by context
    }
  };

  const handleResetPassword = async () => {
    clearError();
    const newErrors: Record<string, string> = {};

    const codeCheck = validateRequired(code, 'Verification code');
    if (!codeCheck.isValid) {
      newErrors.code = codeCheck.error || 'Code is required';
    }

    const passCheck = validatePassword(newPassword);
    if (!passCheck.isValid) {
      newErrors.newPassword = passCheck.error || 'Invalid password';
    }

    const matchCheck = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchCheck.isValid) {
      newErrors.confirmPassword = matchCheck.error || 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await confirmResetPassword({
        email,
        code,
        newPassword,
      });

      Alert.alert(
        'Password Reset Successful',
        'You can now sign in with your new password.',
        [{ text: 'Sign In', onPress: () => navigation.navigate('Login') }]
      );
    } catch {
      // Handled by context
    }
  };

  return (
    <ScreenContainer scrollable>
      <Header
        title="Reset Password"
        subtitle={
          step === 'REQUEST_CODE'
            ? 'Step 1: Request verification code'
            : 'Step 2: Enter code and new password'
        }
        onBack={() => navigation.goBack()}
      />

      <Container>
        <FormCard>
          {error && (
            <GeneralErrorBox>
              <GeneralErrorText>{error}</GeneralErrorText>
            </GeneralErrorBox>
          )}

          {successMessage && (
            <SuccessBox>
              <SuccessText>{successMessage}</SuccessText>
            </SuccessBox>
          )}

          {step === 'REQUEST_CODE' ? (
            <>
              <InstructionText>
                Enter the email address associated with your account. We will send you a
                verification code to reset your password.
              </InstructionText>

              <Input
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={t => {
                  setEmail(t);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                required
              />

              <Button
                title="Send Verification Code"
                onPress={handleSendCode}
                isLoading={isLoading}
                size="lg"
              />
            </>
          ) : (
            <>
              <InstructionText>
                Enter the verification code sent to {email} along with your new password.
              </InstructionText>

              <Input
                label="Verification Code"
                placeholder="e.g. 123456"
                value={code}
                onChangeText={t => {
                  setCode(t);
                  if (errors.code) setErrors(prev => ({ ...prev, code: '' }));
                }}
                keyboardType="number-pad"
                error={errors.code}
                required
              />

              <Input
                label="New Password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChangeText={t => {
                  setNewPassword(t);
                  if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
                }}
                isPassword
                error={errors.newPassword}
                required
              />

              <Input
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={t => {
                  setConfirmPassword(t);
                  if (errors.confirmPassword)
                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                isPassword
                error={errors.confirmPassword}
                required
              />

              <Button
                title="Update Password"
                onPress={handleResetPassword}
                isLoading={isLoading}
                size="lg"
              />
            </>
          )}
        </FormCard>
      </Container>
    </ScreenContainer>
  );
};
