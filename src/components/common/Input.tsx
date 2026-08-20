import React, { useState } from 'react';
import { TextInputProps, TouchableOpacity } from 'react-native';
import styled, { css } from 'styled-components/native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
  onClear?: () => void;
  required?: boolean;
}

const Container = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  width: 100%;
`;

const LabelContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Label = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RequiredAsterisk = styled.Text`
  color: ${({ theme }) => theme.colors.status.error};
  margin-left: 2px;
`;

const InputWrapper = styled.View<{ isFocused: boolean; hasError: boolean }>`
  flex-direction: row;
  align-items: center;
  border-width: 1.5px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-color: ${({ theme, isFocused, hasError }) =>
    hasError
      ? theme.colors.status.error
      : isFocused
      ? theme.colors.primary[500]
      : theme.colors.border.light};
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
`;

const StyledTextInput = styled.TextInput<{ isMultiline?: boolean }>`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
  padding-vertical: ${({ theme, isMultiline }) =>
    isMultiline ? theme.spacing.md : theme.spacing.sm + 2}px;
  min-height: ${({ isMultiline }) => (isMultiline ? '90px' : '44px')};
  ${({ isMultiline }) =>
    isMultiline &&
    css`
      text-align-vertical: top;
    `}
`;

const TogglePasswordButton = styled(TouchableOpacity)`
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

const ToggleText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const ErrorText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.status.error};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const HelperText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.muted};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  isPassword = false,
  multiline = false,
  required = false,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Container>
      {label && (
        <LabelContainer>
          <Label>{label}</Label>
          {required && <RequiredAsterisk>*</RequiredAsterisk>}
        </LabelContainer>
      )}
      <InputWrapper isFocused={isFocused} hasError={!!error}>
        <StyledTextInput
          isMultiline={multiline}
          multiline={multiline}
          secureTextEntry={isPassword && !isPasswordVisible}
          placeholderTextColor="#94A3B8"
          onFocus={e => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          accessibilityLabel={label || rest.placeholder}
          {...rest}
        />
        {isPassword && (
          <TogglePasswordButton
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            <ToggleText>{isPasswordVisible ? 'Hide' : 'Show'}</ToggleText>
          </TogglePasswordButton>
        )}
      </InputWrapper>
      {error ? (
        <ErrorText>{error}</ErrorText>
      ) : helperText ? (
        <HelperText>{helperText}</HelperText>
      ) : null}
    </Container>
  );
};
