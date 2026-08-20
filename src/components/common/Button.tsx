import React from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import styled, { css } from 'styled-components/native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const getButtonStyles = (variant: ButtonVariant = 'primary', disabled?: boolean | null) => {
  if (disabled) {
    return css`
      background-color: ${({ theme }) => theme.colors.neutral[200]};
      border-color: transparent;
    `;
  }

  switch (variant) {
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.secondary[500]};
        border-color: transparent;
      `;
    case 'outline':
      return css`
        background-color: transparent;
        border-width: 1.5px;
        border-color: ${({ theme }) => theme.colors.primary[500]};
      `;
    case 'danger':
      return css`
        background-color: ${({ theme }) => theme.colors.status.error};
        border-color: transparent;
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        border-color: transparent;
      `;
    case 'primary':
    default:
      return css`
        background-color: ${({ theme }) => theme.colors.primary[600]};
        border-color: transparent;
      `;
  }
};

const getTextStyles = (variant: ButtonVariant = 'primary', disabled?: boolean | null) => {
  if (disabled) {
    return css`
      color: ${({ theme }) => theme.colors.neutral[400]};
    `;
  }

  switch (variant) {
    case 'outline':
    case 'ghost':
      return css`
        color: ${({ theme }) => theme.colors.primary[600]};
      `;
    case 'primary':
    case 'secondary':
    case 'danger':
    default:
      return css`
        color: ${({ theme }) => theme.colors.text.inverse};
      `;
  }
};

const getPadding = (size: ButtonSize = 'md') => {
  switch (size) {
    case 'sm':
      return css`
        padding-vertical: 8px;
        padding-horizontal: 14px;
      `;
    case 'lg':
      return css`
        padding-vertical: 16px;
        padding-horizontal: 24px;
      `;
    case 'md':
    default:
      return css`
        padding-vertical: 12px;
        padding-horizontal: 18px;
      `;
  }
};

const StyledTouchableOpacity = styled.TouchableOpacity<{
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean | null;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  min-height: 44px;
  ${({ size }) => getPadding(size)}
  ${({ variant, disabled }) => getButtonStyles(variant, disabled)}
`;

const ButtonText = styled.Text<{
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean | null;
}>`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ size, theme }) =>
    size === 'sm'
      ? theme.typography.fontSize.sm
      : size === 'lg'
      ? theme.typography.fontSize.lg
      : theme.typography.fontSize.md}px;
  ${({ variant, disabled }) => getTextStyles(variant, disabled)}
`;

const IconContainer = styled.View<{ position: 'left' | 'right' }>`
  ${({ position }) => (position === 'left' ? 'margin-right: 8px;' : 'margin-left: 8px;')}
`;

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const isButtonDisabled = disabled || isLoading;

  return (
    <StyledTouchableOpacity
      variant={variant}
      size={size}
      disabled={isButtonDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isButtonDisabled, busy: isLoading }}
      activeOpacity={0.75}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#4F46E5' : '#FFFFFF'}
        />
      ) : (
        <>
          {leftIcon && <IconContainer position="left">{leftIcon}</IconContainer>}
          <ButtonText variant={variant} size={size} disabled={isButtonDisabled}>
            {title}
          </ButtonText>
          {rightIcon && <IconContainer position="right">{rightIcon}</IconContainer>}
        </>
      )}
    </StyledTouchableOpacity>
  );
};
