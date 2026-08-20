import React from 'react';
import styled from 'styled-components/native';
import { Word, LearningStatus } from '../../types/word.types';
import { Badge } from '../common/Badge';

interface WordCardProps {
  word: Word;
  learningStatus?: LearningStatus;
  onPress: () => void;
}

const CardContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  ${({ theme }) => theme.shadows.sm}
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const WordText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
`;

const BadgesRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const MeaningText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const BottomRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xxs}px;
`;

const CategoryText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Chevron = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.neutral[400]};
`;

export const WordCard: React.FC<WordCardProps> = ({
  word,
  learningStatus = 'NEW',
  onPress,
}) => {
  return (
    <CardContainer
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Word: ${word.word}. Meaning: ${word.meaning}`}
    >
      <TopRow>
        <WordText numberOfLines={1}>{word.word}</WordText>
        <BadgesRow>
          <Badge label={word.difficulty} type="difficulty" difficulty={word.difficulty} size="sm" />
          <Badge label={learningStatus} type="status" status={learningStatus} size="sm" />
        </BadgesRow>
      </TopRow>
      <MeaningText numberOfLines={2}>{word.meaning}</MeaningText>
      <BottomRow>
        <CategoryText>📁 {word.category}</CategoryText>
        <Chevron>→</Chevron>
      </BottomRow>
    </CardContainer>
  );
};
