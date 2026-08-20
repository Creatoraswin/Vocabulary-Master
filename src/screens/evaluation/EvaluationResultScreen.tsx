import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EvaluationStackParamList } from '../../types/navigation.types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Button } from '../../components/common/Button';
import { getScorePerformanceMessage } from '../../utils/formatters';

type Props = NativeStackScreenProps<EvaluationStackParamList, 'EvaluationResult'>;

const TrophyCircle = styled.View<{ color: string }>`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ color }) => color}20;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const TrophyIcon = styled.Text`
  font-size: 36px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.heavy};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.lineHeight.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-horizontal: -${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionHeader = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const BreakdownCard = styled(Card)<{ isCorrect: boolean }>`
  border-left-width: 4px;
  border-left-color: ${({ isCorrect, theme }) =>
    isCorrect ? theme.colors.status.success : theme.colors.status.error};
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const QuestionNumberRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const QuestionNumberText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
`;

const StatusTag = styled.View<{ isCorrect: boolean }>`
  padding-horizontal: 8px;
  padding-vertical: 2px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background-color: ${({ isCorrect, theme }) =>
    isCorrect ? theme.colors.status.successLight : theme.colors.status.errorLight};
`;

const StatusTagText = styled.Text<{ isCorrect: boolean }>`
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ isCorrect, theme }) =>
    isCorrect ? theme.colors.status.success : theme.colors.status.error};
`;

const AnswerDetailText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: ${({ theme }) => theme.spacing.xxs}px;
`;

const CorrectAnswerText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.status.success};
  margin-top: ${({ theme }) => theme.spacing.xxs}px;
`;

const ActionsContainer = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.xxl}px;
`;

export const EvaluationResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { evaluation } = route.params;
  const performance = getScorePerformanceMessage(evaluation.percentage);

  return (
    <ScreenContainer scrollable>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TrophyCircle color={performance.color}>
          <TrophyIcon>🎯</TrophyIcon>
        </TrophyCircle>

        <Title>{performance.title}</Title>
        <Subtitle>{performance.subtitle}</Subtitle>

        <StatsGrid>
          <StatCard
            label="Total Questions"
            value={evaluation.totalQuestions}
            iconText="❓"
            iconBgColor="#EEF2FF"
          />
          <StatCard
            label="Correct Answers"
            value={evaluation.correctAnswers}
            iconText="✅"
            iconBgColor="#ECFDF5"
          />
          <StatCard
            label="Incorrect"
            value={evaluation.incorrectAnswers}
            iconText="❌"
            iconBgColor="#FEF2F2"
          />
          <StatCard
            label="Final Score"
            value={`${evaluation.percentage}%`}
            subtitle={`${evaluation.score} Points`}
            iconText="🏆"
            iconBgColor="#FEF3C7"
          />
        </StatsGrid>

        {/* Detailed Question Breakdown */}
        {evaluation.answers && evaluation.answers.length > 0 && (
          <>
            <SectionHeader>Question Breakdown</SectionHeader>
            {evaluation.answers.map((ans, idx) => (
              <BreakdownCard key={ans.id || idx} isCorrect={ans.isCorrect} elevation="sm">
                <QuestionNumberRow>
                  <QuestionNumberText>Question {idx + 1}</QuestionNumberText>
                  <StatusTag isCorrect={ans.isCorrect}>
                    <StatusTagText isCorrect={ans.isCorrect}>
                      {ans.isCorrect ? '✓ Correct' : '✕ Incorrect'}
                    </StatusTagText>
                  </StatusTag>
                </QuestionNumberRow>

                <AnswerDetailText>
                  Your Answer: <AnswerDetailText style={{ fontWeight: 'bold' }}>{ans.userAnswer || '(None)'}</AnswerDetailText>
                </AnswerDetailText>

                {!ans.isCorrect && (
                  <CorrectAnswerText>
                    Correct Answer: {ans.correctAnswer}
                  </CorrectAnswerText>
                )}
              </BreakdownCard>
            ))}
          </>
        )}

        <ActionsContainer>
          <Button
            title="Try Again"
            variant="primary"
            size="lg"
            onPress={() => navigation.replace('EvaluationSetup')}
          />

          <Button
            title="View History"
            variant="secondary"
            size="lg"
            onPress={() => navigation.navigate('EvaluationHistory')}
          />

          <Button
            title="Back to Dashboard"
            variant="outline"
            size="md"
            onPress={() => navigation.getParent()?.navigate('Home')}
          />
        </ActionsContainer>
      </ScrollView>
    </ScreenContainer>
  );
};
