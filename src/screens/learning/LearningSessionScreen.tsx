import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearningStackParamList } from '../../types/navigation.types';
import { useLearning } from '../../hooks/useLearning';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Flashcard } from '../../components/learning/Flashcard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { EmptyState } from '../../components/common/EmptyState';

type Props = NativeStackScreenProps<LearningStackParamList, 'LearningSession'>;

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

export const LearningSessionScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    sessionWords,
    currentIndex,
    currentWord,
    isMeaningRevealed,
    isLoading,
    isSaving,
    sessionSummary,
    totalInSession,
    progressPercent,
    startSession,
    revealMeaning,
    rememberWord,
    reviewWord,
  } = useLearning();

  useEffect(() => {
    startSession({
      category: route.params?.category,
      difficulty: route.params?.difficulty,
    });
  }, [startSession, route.params?.category, route.params?.difficulty]);

  useEffect(() => {
    if (sessionSummary) {
      navigation.replace('LearningSummary', { summary: sessionSummary });
    }
  }, [sessionSummary, navigation]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <Header title="Learning Session" />
        <LoadingContainer>
          <ActivityIndicator size="large" color="#4F46E5" />
          <LoadingText>Preparing your personalized learning session...</LoadingText>
        </LoadingContainer>
      </ScreenContainer>
    );
  }

  if (sessionWords.length === 0) {
    return (
      <ScreenContainer>
        <Header title="Learning Session" />
        <EmptyState
          title="No Vocabulary Words Available"
          description="You don't have any words available for a learning session yet. Add some words to your vocabulary collection first."
          iconText="📚"
          actionTitle="Add New Word"
          onAction={() => navigation.getParent()?.navigate('WordsTab', { screen: 'CreateWord' })}
        />
      </ScreenContainer>
    );
  }

  if (!currentWord) {
    return null;
  }

  return (
    <ScreenContainer scrollable>
      <Header
        title="Learning Session"
        subtitle="Spaced-repetition word memorization"
      />

      <ProgressHeader>
        <CounterRow>
          <CounterText>
            Word {currentIndex + 1} of {totalInSession}
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

      <Flashcard
        word={currentWord}
        isMeaningRevealed={isMeaningRevealed}
        onRevealMeaning={revealMeaning}
        onRemember={rememberWord}
        onNeedReview={reviewWord}
        isLoading={isSaving}
      />
    </ScreenContainer>
  );
};
