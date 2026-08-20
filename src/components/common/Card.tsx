import React from 'react';
import { TouchableOpacityProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  elevation?: 'sm' | 'md' | 'lg';
  activeOpacity?: number;
}

const StyledCard = styled.View<{ elevation: 'sm' | 'md' | 'lg' }>`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  ${({ theme, elevation }) => theme.shadows[elevation]}
`;

const StyledTouchableCard = styled.TouchableOpacity<{ elevation: 'sm' | 'md' | 'lg' }>`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  ${({ theme, elevation }) => theme.shadows[elevation]}
`;

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  elevation = 'sm',
  style,
  ...rest
}) => {
  if (onPress) {
    return (
      <StyledTouchableCard
        elevation={elevation}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        style={style}
        {...(rest as TouchableOpacityProps)}
      >
        {children}
      </StyledTouchableCard>
    );
  }

  return (
    <StyledCard elevation={elevation} style={style} {...rest}>
      {children}
    </StyledCard>
  );
};
