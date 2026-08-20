import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { useAuth } from '../../hooks/useAuth';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
} from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding-vertical: ${({ theme }) => theme.spacing.xl}px;
`;

const HeaderSection = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const FormCard = styled.View`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => theme.spacing.xl}px;
  ${({ theme }) => theme.shadows.md}
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

const FooterSection = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

const FooterText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LoginLink = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp, isLoading, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async () => {
    clearError();
    const newErrors: Record<string, string> = {};

    const nameCheck = validateRequired(name, 'Full name');
    if (!nameCheck.isValid) {
      newErrors.name = nameCheck.error || 'Name is required';
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      newErrors.email = emailCheck.error || 'Invalid email';
    }

    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      newErrors.password = passCheck.error || 'Invalid password';
    }

    const matchCheck = validatePasswordMatch(password, confirmPassword);
    if (!matchCheck.isValid) {
      newErrors.confirmPassword = matchCheck.error || 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const result = await signUp({
        name,
        email,
        password,
        confirmPassword,
      });

      if (!result.isSignUpComplete) {
        navigation.navigate('ConfirmSignUp', { email });
      }
    } catch {
      // Handled by context
    }
  };

  return (
    <ScreenContainer scrollable>
      <Container>
        <HeaderSection>
          <Title>Create Account</Title>
          <Subtitle>Join thousands of learners mastering new words daily</Subtitle>
        </HeaderSection>

        <FormCard>
          {error && (
            <GeneralErrorBox>
              <GeneralErrorText>{error}</GeneralErrorText>
            </GeneralErrorBox>
          )}

          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={t => {
              setName(t);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            error={errors.name}
            required
          />

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
            autoCorrect={false}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={t => {
              setPassword(t);
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
            }}
            isPassword
            error={errors.password}
            helperText="Must be at least 6 characters"
            required
          />

          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={t => {
              setConfirmPassword(t);
              if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }}
            isPassword
            error={errors.confirmPassword}
            required
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
            size="lg"
          />
        </FormCard>

        <FooterSection>
          <FooterText>Already have an account? </FooterText>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            <LoginLink>Sign In</LoginLink>
          </TouchableOpacity>
        </FooterSection>
      </Container>
    </ScreenContainer>
  );
};
