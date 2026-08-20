import React from 'react';
import styled, { css } from 'styled-components/native';
import { Difficulty, LearningStatus } from '../../types/word.types';

export type BadgeType = 'difficulty' | 'status' | 'category' | 'custom';

interface BadgeProps {
  label: string;
  type?: BadgeType;
  difficulty?: Difficulty;
  status?: LearningStatus;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
}

const getBadgeColors = (
  type: BadgeType,
  difficulty?: Difficulty,
  status?: LearningStatus,
  color?: string,
  bgColor?: string
) => {
  if (type === 'custom' && color && bgColor) {
    return css`
      background-color: ${bgColor};
      border-color: ${color}33;
    `;
  }

  if (type === 'difficulty' && difficulty) {
    switch (difficulty) {
      case 'Easy':
        return css`
          background-color: ${({ theme }) => theme.colors.difficulty.easyBg};
          border-color: ${({ theme }) => theme.colors.difficulty.easy}40;
        `;
      case 'Medium':
        return css`
          background-color: ${({ theme }) => theme.colors.difficulty.mediumBg};
          border-color: ${({ theme }) => theme.colors.difficulty.medium}40;
        `;
      case 'Hard':
        return css`
          background-color: ${({ theme }) => theme.colors.difficulty.hardBg};
          border-color: ${({ theme }) => theme.colors.difficulty.hard}40;
        `;
    }
  }

  if (type === 'status' && status) {
    switch (status) {
      case 'NEW':
        return css`
          background-color: ${({ theme }) => theme.colors.learningStatus.NEW_BG};
          border-color: ${({ theme }) => theme.colors.learningStatus.NEW}40;
        `;
      case 'LEARNING':
        return css`
          background-color: ${({ theme }) => theme.colors.learningStatus.LEARNING_BG};
          border-color: ${({ theme }) => theme.colors.learningStatus.LEARNING}40;
        `;
      case 'REMEMBERED':
        return css`
          background-color: ${({ theme }) => theme.colors.learningStatus.REMEMBERED_BG};
          border-color: ${({ theme }) => theme.colors.learningStatus.REMEMBERED}40;
        `;
      case 'REVIEW':
        return css`
          background-color: ${({ theme }) => theme.colors.learningStatus.REVIEW_BG};
          border-color: ${({ theme }) => theme.colors.learningStatus.REVIEW}40;
        `;
    }
  }

  // Default category badge
  return css`
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    border-color: ${({ theme }) => theme.colors.border.light};
  `;
};

const getTextColor = (
  type: BadgeType,
  difficulty?: Difficulty,
  status?: LearningStatus,
  color?: string
) => {
  if (type === 'custom' && color) {
    return css`
      color: ${color};
    `;
  }

  if (type === 'difficulty' && difficulty) {
    switch (difficulty) {
      case 'Easy':
        return css`
          color: ${({ theme }) => theme.colors.difficulty.easy};
        `;
      case 'Medium':
        return css`
          color: ${({ theme }) => theme.colors.difficulty.medium};
        `;
      case 'Hard':
        return css`
          color: ${({ theme }) => theme.colors.difficulty.hard};
        `;
    }
  }

  if (type === 'status' && status) {
    switch (status) {
      case 'NEW':
        return css`
          color: ${({ theme }) => theme.colors.learningStatus.NEW};
        `;
      case 'LEARNING':
        return css`
          color: ${({ theme }) => theme.colors.learningStatus.LEARNING};
        `;
      case 'REMEMBERED':
        return css`
          color: ${({ theme }) => theme.colors.learningStatus.REMEMBERED};
        `;
      case 'REVIEW':
        return css`
          color: ${({ theme }) => theme.colors.learningStatus.REVIEW};
        `;
    }
  }

  return css`
    color: ${({ theme }) => theme.colors.text.secondary};
  `;
};

const BadgeWrapper = styled.View<{
  badgeType: BadgeType;
  difficulty?: Difficulty;
  status?: LearningStatus;
  customColor?: string;
  customBg?: string;
  size: 'sm' | 'md';
}>`
  padding-horizontal: ${({ size, theme }) => (size === 'sm' ? theme.spacing.xs + 2 : theme.spacing.sm + 2)}px;
  padding-vertical: ${({ size, theme }) => (size === 'sm' ? 2 : theme.spacing.xxs)}px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  border-width: 1px;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  ${({ badgeType, difficulty, status, customColor, customBg }) =>
    getBadgeColors(badgeType, difficulty, status, customColor, customBg)}
`;

const BadgeText = styled.Text<{
  badgeType: BadgeType;
  difficulty?: Difficulty;
  status?: LearningStatus;
  customColor?: string;
  size: 'sm' | 'md';
}>`
  font-size: ${({ size, theme }) =>
    size === 'sm' ? theme.typography.fontSize.xs - 2 : theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: capitalize;
  ${({ badgeType, difficulty, status, customColor }) =>
    getTextColor(badgeType, difficulty, status, customColor)}
`;

export const Badge: React.FC<BadgeProps> = ({
  label,
  type = 'category',
  difficulty,
  status,
  color,
  bgColor,
  size = 'md',
}) => {
  return (
    <BadgeWrapper
      badgeType={type}
      difficulty={difficulty}
      status={status}
      customColor={color}
      customBg={bgColor}
      size={size}
    >
      <BadgeText
        badgeType={type}
        difficulty={difficulty}
        status={status}
        customColor={color}
        size={size}
      >
        {label}
      </BadgeText>
    </BadgeWrapper>
  );
};
