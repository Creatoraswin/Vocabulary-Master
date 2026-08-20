import React from 'react';
import styled from 'styled-components/native';
import { Word } from '../../types/word.types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface FlashcardProps {
  word: Word;
  isMeaningRevealed: boolean;
  onRevealMeaning: () => void;
  onRemember: () => void;
  onNeedReview: () => void;
  isLoading?: boolean;
}

const CardContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.xxl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => theme.spacing.xl}px;
  width: 100%;
  min-height: 380px;
  justify-content: space-between;
  ${({ theme }) => theme.shadows.md}
`;

const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const BadgesGroup = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const MainContent = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  padding-vertical: ${({ theme }) => theme.spacing.lg}px;
`;

const WordHeading = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.heavy};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const MeaningBox = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const MeaningLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[700]};
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const MeaningText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ExampleLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral[500]};
  text-transform: uppercase;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.xxs}px;
`;

const ExampleText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  line-height: ${({ theme }) => theme.typography.lineHeight.sm}px;
`;

const RevealPromptContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  width: 100%;
  align-items: center;
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => theme.colors.border.medium};
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const RevealPromptText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const ActionButtonsContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const DualActionsRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const ActionWrapper = styled.View`
  flex: 1;
`;

export const Flashcard: React.FC<FlashcardProps> = ({
  word,
  isMeaningRevealed,
  onRevealMeaning,
  onRemember,
  onNeedReview,
  isLoading = false,
}) => {
  return (
    <CardContainer>
      <CardHeader>
        <BadgesGroup>
          <Badge label={word.category} type="category" />
          <Badge label={word.difficulty} type="difficulty" difficulty={word.difficulty} />
        </BadgesGroup>
      </CardHeader>

      <MainContent>
        <WordHeading>{word.word}</WordHeading>

        {!isMeaningRevealed ? (
          <RevealPromptContainer
            onPress={onRevealMeaning}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Tap to reveal meaning"
          >
            <RevealPromptText>🔍 Tap to Show Meaning</RevealPromptText>
          </RevealPromptContainer>
        ) : (
          <MeaningBox>
            <MeaningLabel>Meaning</MeaningLabel>
            <MeaningText>{word.meaning}</MeaningText>

            {word.example ? (
              <>
                <ExampleLabel>Example Sentence</ExampleLabel>
                <ExampleText>"{word.example}"</ExampleText>
              </>
            ) : null}
          </MeaningBox>
        )}
      </MainContent>

      <ActionButtonsContainer>
        {!isMeaningRevealed ? (
          <Button
            title="Show Meaning"
            variant="outline"
            size="lg"
            onPress={onRevealMeaning}
          />
        ) : (
          <DualActionsRow>
            <ActionWrapper>
              <Button
                title="Need Review"
                variant="danger"
                size="md"
                onPress={onNeedReview}
                isLoading={isLoading}
              />
            </ActionWrapper>
            <ActionWrapper>
              <Button
                title="I Remember"
                variant="secondary"
                size="md"
                onPress={onRemember}
                isLoading={isLoading}
              />
            </ActionWrapper>
          </DualActionsRow>
        )}
      </ActionButtonsContainer>
    </CardContainer>
  );
};
