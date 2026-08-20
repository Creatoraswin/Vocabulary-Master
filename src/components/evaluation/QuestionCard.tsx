import React from 'react';
import styled, { css } from 'styled-components/native';
import { EvaluationQuestion } from '../../types/evaluation.types';

interface QuestionCardProps {
  question: EvaluationQuestion;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  disabled?: boolean;
}

const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  ${({ theme }) => theme.shadows.sm}
`;

const QuestionTypeBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: 3px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  align-self: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const QuestionTypeLabel = styled.Text`
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[700]};
  text-transform: uppercase;
`;

const PromptText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const SubPromptText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const OptionsContainer = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const OptionButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  border-width: 1.5px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary[50] : theme.colors.background.secondary};
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary[600] : theme.colors.border.light};
`;

const OptionPrefix = styled.View<{ isSelected: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary[600] : theme.colors.neutral[100]};
  border-width: 1px;
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary[600] : theme.colors.border.medium};
`;

const OptionPrefixText = styled.Text<{ isSelected: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.text.inverse : theme.colors.text.secondary};
`;

const OptionText = styled.Text<{ isSelected: boolean }>`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.sm + 1}px;
  font-weight: ${({ isSelected, theme }) =>
    isSelected ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.regular};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary[900] : theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.sm}px;
`;

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
  disabled = false,
}) => {
  return (
    <Container>
      <QuestionTypeBadge>
        <QuestionTypeLabel>
          {question.questionType === 'WORD_TO_MEANING'
            ? 'Word → Meaning'
            : 'Meaning → Word'}
        </QuestionTypeLabel>
      </QuestionTypeBadge>

      <PromptText>{question.prompt}</PromptText>
      {question.subPrompt && <SubPromptText>{question.subPrompt}</SubPromptText>}

      <OptionsContainer>
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const prefix = OPTION_LABELS[idx] || String(idx + 1);

          return (
            <OptionButton
              key={`${question.id}-opt-${idx}`}
              isSelected={isSelected}
              onPress={() => !disabled && onSelectOption(option)}
              activeOpacity={0.7}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`Option ${prefix}: ${option}`}
            >
              <OptionPrefix isSelected={isSelected}>
                <OptionPrefixText isSelected={isSelected}>{prefix}</OptionPrefixText>
              </OptionPrefix>
              <OptionText isSelected={isSelected}>{option}</OptionText>
            </OptionButton>
          );
        })}
      </OptionsContainer>
    </Container>
  );
};
