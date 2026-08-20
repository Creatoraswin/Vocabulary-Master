import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { useAuth } from '../../hooks/useAuth';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { validateEmail, validatePassword } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding-vertical: ${({ theme }) => theme.spacing.xl}px;
`;

const HeaderSection = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl}px;
`;

const LogoCircle = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.colors.primary[100]};
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const LogoIcon = styled.Text`
  font-size: 32px;
`;

const AppTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const AppSubtitle = styled.Text`
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

const ForgotPasswordButton = styled(TouchableOpacity)`
  align-self: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ForgotPasswordText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary[600]};
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

const RegisterLink = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
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

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async () => {
    clearError();
    const newErrors: Record<string, string> = {};

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      newErrors.email = emailCheck.error || 'Invalid email';
    }

    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      newErrors.password = passCheck.error || 'Invalid password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await signIn({ email, password });
    } catch (err: any) {
      // Handled by context error
    }
  };

  return (
    <ScreenContainer scrollable>
      <Container>
        <HeaderSection>
          <LogoCircle>
            <LogoIcon>📖</LogoIcon>
          </LogoCircle>
          <AppTitle>Vocabulary Master</AppTitle>
          <AppSubtitle>Sign in to expand your vocabulary and track your learning</AppSubtitle>
        </HeaderSection>

        <FormCard>
          {error && (
            <GeneralErrorBox>
              <GeneralErrorText>{error}</GeneralErrorText>
            </GeneralErrorBox>
          )}

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
            placeholder="Enter your password"
            value={password}
            onChangeText={t => {
              setPassword(t);
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
            }}
            isPassword
            error={errors.password}
            required
          />

          <ForgotPasswordButton
            onPress={() => navigation.navigate('ForgotPassword', { email })}
            accessibilityRole="button"
            accessibilityLabel="Forgot password?"
          >
            <ForgotPasswordText>Forgot password?</ForgotPasswordText>
          </ForgotPasswordButton>

          <Button
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            size="lg"
          />
        </FormCard>

        <FooterSection>
          <FooterText>Don't have an account? </FooterText>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            accessibilityRole="button"
            accessibilityLabel="Sign up"
          >
            <RegisterLink>Sign Up</RegisterLink>
          </TouchableOpacity>
        </FooterSection>
      </Container>
    </ScreenContainer>
  );
};
