import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: {
    label: string;
    onPress: () => void;
    color?: string;
  };
}

const HeaderWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const BackButton = styled(TouchableOpacity)`
  padding-right: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  justify-content: center;
  align-items: center;
`;

const BackIconText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const TitleContainer = styled.View`
  flex: 1;
`;

const HeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const HeaderSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xxs}px;
`;

const RightActionButton = styled(TouchableOpacity)`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
`;

const RightActionText = styled.Text<{ color?: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, color }) => color || theme.colors.primary[600]};
`;

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
}) => {
  return (
    <HeaderWrapper>
      <LeftSection>
        {onBack && (
          <BackButton
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <BackIconText>←</BackIconText>
          </BackButton>
        )}
        <TitleContainer>
          <HeaderTitle numberOfLines={1}>{title}</HeaderTitle>
          {subtitle && <HeaderSubtitle numberOfLines={1}>{subtitle}</HeaderSubtitle>}
        </TitleContainer>
      </LeftSection>
      {rightAction && (
        <RightActionButton
          onPress={rightAction.onPress}
          accessibilityRole="button"
          accessibilityLabel={rightAction.label}
        >
          <RightActionText color={rightAction.color}>
            {rightAction.label}
          </RightActionText>
        </RightActionButton>
      )}
    </HeaderWrapper>
  );
};
