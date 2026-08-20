import React, { useEffect } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EvaluationStackParamList } from '../../types/navigation.types';
import { useEvaluation } from '../../hooks/useEvaluation';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatters';
import { Evaluation } from '../../types/evaluation.types';

type Props = NativeStackScreenProps<EvaluationStackParamList, 'EvaluationHistory'>;

const HistoryCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const DateText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ScoreBadge = styled.View<{ percentage: number }>`
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: 3px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background-color: ${({ percentage, theme }) =>
    percentage >= 80
      ? theme.colors.status.successLight
      : percentage >= 50
      ? theme.colors.status.warningLight
      : theme.colors.status.errorLight};
`;

const ScoreBadgeText = styled.Text<{ percentage: number }>`
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ percentage, theme }) =>
    percentage >= 80
      ? theme.colors.status.success
      : percentage >= 50
      ? theme.colors.status.warning
      : theme.colors.status.error};
`;

const DetailsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const ScoreMainText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const QuestionsSubText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const EvaluationHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { history, isLoadingHistory, refreshHistory } = useEvaluation();

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const renderHistoryItem = ({ item }: { item: Evaluation }) => {
    return (
      <HistoryCard
        elevation="sm"
        onPress={() => navigation.navigate('EvaluationResult', { evaluation: item })}
      >
        <TopRow>
          <DateText>{formatDateTime(item.createdAt)}</DateText>
          <ScoreBadge percentage={item.percentage}>
            <ScoreBadgeText percentage={item.percentage}>
              {item.percentage}% Accuracy
            </ScoreBadgeText>
          </ScoreBadge>
        </TopRow>
        <DetailsRow>
          <ScoreMainText>
            {item.correctAnswers} / {item.totalQuestions} Correct
          </ScoreMainText>
          <QuestionsSubText>{item.score} Points • View Details →</QuestionsSubText>
        </DetailsRow>
      </HistoryCard>
    );
  };

  return (
    <ScreenContainer>
      <Header
        title="Evaluation History"
        subtitle="Review past quiz performance records"
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={renderHistoryItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingHistory}
            onRefresh={refreshHistory}
            colors={['#4F46E5']}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Evaluation History"
            description="You haven't completed any vocabulary evaluation quizzes yet."
            iconText="📝"
            actionTitle="Start First Evaluation"
            onAction={() => navigation.navigate('EvaluationSetup')}
          />
        }
      />
    </ScreenContainer>
  );
};
