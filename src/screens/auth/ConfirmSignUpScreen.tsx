import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { useAuth } from '../../hooks/useAuth';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { validateRequired } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'ConfirmSignUp'>;

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

export const ConfirmSignUpScreen: React.FC<Props> = ({ navigation, route }) => {
  const { confirmSignUp, resendConfirmationCode, isLoading, error, clearError } = useAuth();
  const email = route.params.email;

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleConfirm = async () => {
    clearError();
    const check = validateRequired(code, 'Confirmation code');
    if (!check.isValid) {
      setCodeError(check.error || 'Code is required');
      return;
    }

    setCodeError('');
    try {
      await confirmSignUp({ email, code });
      Alert.alert(
        'Account Confirmed!',
        'Your email has been verified. You can now sign in.',
        [{ text: 'Sign In', onPress: () => navigation.navigate('Login') }]
      );
    } catch {
      // Handled by context
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    clearError();
    try {
      await resendConfirmationCode(email);
      Alert.alert('Code Resent', `A new verification code has been sent to ${email}.`);
    } catch {
      // Handled by context
    } finally {
      setIsResending(false);
    }
  };

  return (
    <ScreenContainer scrollable>
      <Header
        title="Verify Email"
        subtitle="Confirm your registration"
        onBack={() => navigation.goBack()}
      />

      <Container>
        <FormCard>
          {error && (
            <GeneralErrorBox>
              <GeneralErrorText>{error}</GeneralErrorText>
            </GeneralErrorBox>
          )}

          <InstructionText>
            We sent a verification code to <InstructionText style={{ fontWeight: 'bold' }}>{email}</InstructionText>. Please enter it below.
          </InstructionText>

          <Input
            label="Verification Code"
            placeholder="e.g. 123456"
            value={code}
            onChangeText={t => {
              setCode(t);
              if (codeError) setCodeError('');
            }}
            keyboardType="number-pad"
            error={codeError}
            required
          />

          <Button
            title="Confirm Account"
            onPress={handleConfirm}
            isLoading={isLoading}
            size="lg"
          />

          <Button
            title="Resend Code"
            variant="outline"
            onPress={handleResend}
            isLoading={isResending}
            size="md"
            style={{ marginTop: 12 }}
          />
        </FormCard>
      </Container>
    </ScreenContainer>
  );
};
