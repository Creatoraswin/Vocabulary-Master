import React from 'react';
import styled from 'styled-components/native';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  iconText?: string;
  actionTitle?: string;
  onAction?: () => void;
}

const Container = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl}px;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.xl}px;
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => theme.colors.border.medium};
  margin-vertical: ${({ theme }) => theme.spacing.lg}px;
`;

const IconCircle = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: ${({ theme }) => theme.colors.primary[50]};
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const IconText = styled.Text`
  font-size: 28px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.lineHeight.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ButtonWrapper = styled.View`
  min-width: 160px;
`;

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  iconText = '📚',
  actionTitle,
  onAction,
}) => {
  return (
    <Container>
      <IconCircle>
        <IconText>{iconText}</IconText>
      </IconCircle>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {actionTitle && onAction && (
        <ButtonWrapper>
          <Button title={actionTitle} onPress={onAction} size="sm" />
        </ButtonWrapper>
      )}
    </Container>
  );
};
