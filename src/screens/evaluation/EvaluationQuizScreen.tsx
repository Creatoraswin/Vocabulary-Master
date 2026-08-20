import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EvaluationStackParamList } from '../../types/navigation.types';
import { useEvaluation } from '../../hooks/useEvaluation';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { QuestionCard } from '../../components/evaluation/QuestionCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';

type Props = NativeStackScreenProps<EvaluationStackParamList, 'EvaluationQuiz'>;

const ProgressHeader = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const CounterRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const CounterText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PercentageIndicator = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const NavigationRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xxl}px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const EvaluationQuizScreen: React.FC<Props> = ({ navigation, route }) => {
  const { options } = route.params;
  const {
    questions,
    currentIndex,
    currentQuestion,
    currentSelectedOption,
    selectedAnswers,
    isLoading,
    isSubmitting,
    totalQuestions,
    progressPercent,
    isLastQuestion,
    startQuiz,
    selectOption,
    nextQuestion,
    previousQuestion,
    submitQuiz,
  } = useEvaluation();

  useEffect(() => {
    startQuiz(options);
  }, [startQuiz, options]);

  const handleSubmit = async () => {
    // Check if any unanswered questions exist
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < totalQuestions) {
      Alert.alert(
        'Incomplete Assessment',
        `You have answered ${answeredCount} of ${totalQuestions} questions. Do you still want to submit?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit Anyway',
            onPress: async () => {
              const result = await submitQuiz();
              navigation.replace('EvaluationResult', { evaluation: result });
            },
          },
        ]
      );
      return;
    }

    const result = await submitQuiz();
    navigation.replace('EvaluationResult', { evaluation: result });
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <Header title="Evaluation Quiz" />
        <LoadingContainer>
          <ActivityIndicator size="large" color="#4F46E5" />
          <LoadingText>Generating your customized quiz questions...</LoadingText>
        </LoadingContainer>
      </ScreenContainer>
    );
  }

  if (questions.length === 0) {
    return (
      <ScreenContainer>
        <Header title="Evaluation Quiz" onBack={() => navigation.goBack()} />
        <EmptyState
          title="Not Enough Vocabulary"
          description="You need at least 2 words in your collection to generate multiple-choice questions."
          iconText="⚠️"
          actionTitle="Return to Setup"
          onAction={() => navigation.goBack()}
        />
      </ScreenContainer>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <ScreenContainer scrollable>
      <Header
        title="Evaluation Quiz"
        subtitle={`Assessment in progress`}
        onBack={() => {
          Alert.alert(
            'Exit Quiz?',
            'Your progress on this quiz will not be saved.',
            [
              { text: 'Stay', style: 'cancel' },
              { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() },
            ]
          );
        }}
      />

      <ProgressHeader>
        <CounterRow>
          <CounterText>
            Question {currentIndex + 1} of {totalQuestions}
          </CounterText>
          <PercentageIndicator>
            {Math.round(progressPercent * 100)}% Complete
          </PercentageIndicator>
        </CounterRow>
        <ProgressBar
          progress={progressPercent}
          showPercentage={false}
          height={8}
          color="#4F46E5"
        />
      </ProgressHeader>

      <ScrollView showsVerticalScrollIndicator={false}>
        <QuestionCard
          question={currentQuestion}
          selectedOption={currentSelectedOption}
          onSelectOption={selectOption}
          disabled={isSubmitting}
        />

        <NavigationRow>
          {currentIndex > 0 && (
            <ButtonWrapper>
              <Button
                title="Previous"
                variant="outline"
                size="md"
                onPress={previousQuestion}
                disabled={isSubmitting}
              />
            </ButtonWrapper>
          )}

          <ButtonWrapper>
            {isLastQuestion ? (
              <Button
                title="Submit Quiz"
                variant="secondary"
                size="md"
                onPress={handleSubmit}
                isLoading={isSubmitting}
              />
            ) : (
              <Button
                title="Next Question"
                variant="primary"
                size="md"
                onPress={nextQuestion}
                disabled={isSubmitting}
              />
            )}
          </ButtonWrapper>
        </NavigationRow>
      </ScrollView>
    </ScreenContainer>
  );
};
