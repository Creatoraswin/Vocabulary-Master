import React from 'react';
import styled from 'styled-components/native';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  iconText?: string;
  iconBgColor?: string;
  onPress?: () => void;
}

const CardWrapper = styled.TouchableOpacity<{ isClickable: boolean }>`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => theme.spacing.md}px;
  flex: 1;
  min-width: 140px;
  margin: ${({ theme }) => theme.spacing.xs}px;
  ${({ theme }) => theme.shadows.sm}
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const IconCircle = styled.View<{ bgColor?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ bgColor, theme }) => bgColor || theme.colors.primary[100]};
  align-items: center;
  justify-content: center;
`;

const IconChar = styled.Text`
  font-size: 14px;
`;

const ValueText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-vertical: ${({ theme }) => theme.spacing.xxs}px;
`;

const LabelText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SubtitleText = styled.Text`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text.muted};
  margin-top: 2px;
`;

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  iconText,
  iconBgColor,
  onPress,
}) => {
  return (
    <CardWrapper
      isClickable={!!onPress}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${label}: ${value}`}
    >
      <HeaderRow>
        <LabelText numberOfLines={1}>{label}</LabelText>
        {iconText && (
          <IconCircle bgColor={iconBgColor}>
            <IconChar>{iconText}</IconChar>
          </IconCircle>
        )}
      </HeaderRow>
      <ValueText numberOfLines={1}>{value}</ValueText>
      {subtitle && <SubtitleText numberOfLines={1}>{subtitle}</SubtitleText>}
    </CardWrapper>
  );
};
