import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useAuth } from '../../hooks/useAuth';
import { useWords } from '../../hooks/useWords';
import { useEvaluation } from '../../hooks/useEvaluation';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { StatCard } from '../../components/common/StatCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

interface DashboardScreenProps {
  navigation: any;
}

const WelcomeHeader = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const GreetingRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const GreetingText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const UserNameText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.heavy};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: 2px;
`;

const HeaderSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 2px;
`;

const ProgressCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border-color: ${({ theme }) => theme.colors.primary[200]};
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ProgressTitleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const ProgressTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[900]};
`;

const ProgressStatusText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-horizontal: -${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ActionCardsGrid = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const ActionCard = styled(Card)`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: 0px;
`;

const ActionIconCircle = styled.View<{ bgColor: string }>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const ActionIcon = styled.Text`
  font-size: 22px;
`;

const ActionContent = styled.View`
  flex: 1;
`;

const ActionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

const ActionDesc = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ActionArrow = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  color: ${({ theme }) => theme.colors.neutral[400]};
  font-weight: bold;
`;

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { words, learningProgressList, isRefreshing, refresh } = useWords();
  const { history } = useEvaluation();

  // Compute stats
  const stats = useMemo(() => {
    const totalWords = words.length;
    const rememberedWords = learningProgressList.filter(p => p.status === 'REMEMBERED').length;
    const reviewWords = learningProgressList.filter(p => p.status === 'REVIEW').length;
    const learningWords = learningProgressList.filter(p => p.status === 'LEARNING').length;
    const newWords = Math.max(0, totalWords - (rememberedWords + reviewWords + learningWords));

    const totalEvaluations = history.length;
    const averageScore =
      totalEvaluations > 0
        ? Math.round(
            history.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalEvaluations
          )
        : 0;

    const overallProgress = totalWords > 0 ? rememberedWords / totalWords : 0;

    return {
      totalWords,
      rememberedWords,
      reviewWords,
      learningWords,
      newWords,
      totalEvaluations,
      averageScore,
      overallProgress,
    };
  }, [words, learningProgressList, history]);

  return (
    <ScreenContainer scrollable>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} colors={['#4F46E5']} />
        }
      >
        <WelcomeHeader>
          <GreetingRow>
            <GreetingText>Welcome Back</GreetingText>
          </GreetingRow>
          <UserNameText>{user?.name || 'Vocabulary Learner'} 👋</UserNameText>
          <HeaderSubtitle>Track your memorization progress and test your skills</HeaderSubtitle>
        </WelcomeHeader>

        {/* Progress Card */}
        <ProgressCard elevation="sm">
          <ProgressTitleRow>
            <ProgressTitle>Overall Vocabulary Mastery</ProgressTitle>
            <GreetingText>{Math.round(stats.overallProgress * 100)}% Mastered</GreetingText>
          </ProgressTitleRow>
          <ProgressBar
            progress={stats.overallProgress}
            showPercentage={false}
            height={10}
            color="#4F46E5"
            trackColor="#C7D2FE"
          />
          <ProgressStatusText>
            {stats.rememberedWords} of {stats.totalWords} words fully remembered
          </ProgressStatusText>
        </ProgressCard>

        {/* Statistics Grid */}
        <SectionHeader>
          <SectionTitle>Overview Statistics</SectionTitle>
        </SectionHeader>

        <StatsGrid>
          <StatCard
            label="Total Words"
            value={stats.totalWords}
            subtitle="In database"
            iconText="📚"
            iconBgColor="#EEF2FF"
            onPress={() => navigation.navigate('WordsTab')}
          />
          <StatCard
            label="Remembered"
            value={stats.rememberedWords}
            subtitle="Mastered words"
            iconText="✅"
            iconBgColor="#ECFDF5"
            onPress={() => navigation.navigate('LearnTab')}
          />
          <StatCard
            label="Need Review"
            value={stats.reviewWords}
            subtitle="Requires practice"
            iconText="🔄"
            iconBgColor="#FEF2F2"
            onPress={() => navigation.navigate('LearnTab')}
          />
          <StatCard
            label="Avg. Quiz Score"
            value={`${stats.averageScore}%`}
            subtitle={`${stats.totalEvaluations} quizzes taken`}
            iconText="🎯"
            iconBgColor="#FEF3C7"
            onPress={() => navigation.navigate('EvaluationTab')}
          />
        </StatsGrid>

        {/* Quick Actions */}
        <SectionHeader>
          <SectionTitle>Quick Actions</SectionTitle>
        </SectionHeader>

        <ActionCardsGrid>
          <ActionCard
            elevation="sm"
            onPress={() => navigation.navigate('LearnTab')}
          >
            <ActionIconCircle bgColor="#EEF2FF">
              <ActionIcon>🧠</ActionIcon>
            </ActionIconCircle>
            <ActionContent>
              <ActionTitle>Start Learning Session</ActionTitle>
              <ActionDesc>Practice words using spaced-repetition flashcards</ActionDesc>
            </ActionContent>
            <ActionArrow>→</ActionArrow>
          </ActionCard>

          <ActionCard
            elevation="sm"
            onPress={() => navigation.navigate('EvaluationTab')}
          >
            <ActionIconCircle bgColor="#ECFDF5">
              <ActionIcon>📝</ActionIcon>
            </ActionIconCircle>
            <ActionContent>
              <ActionTitle>Take Evaluation Quiz</ActionTitle>
              <ActionDesc>Test your vocabulary retention with multiple-choice questions</ActionDesc>
            </ActionContent>
            <ActionArrow>→</ActionArrow>
          </ActionCard>

          <ActionCard
            elevation="sm"
            onPress={() => navigation.navigate('WordsTab', { screen: 'WordList' })}
          >
            <ActionIconCircle bgColor="#FFFBEB">
              <ActionIcon>📖</ActionIcon>
            </ActionIconCircle>
            <ActionContent>
              <ActionTitle>Manage Vocabulary</ActionTitle>
              <ActionDesc>Search, filter, edit, or add new words</ActionDesc>
            </ActionContent>
            <ActionArrow>→</ActionArrow>
          </ActionCard>

          <ActionCard
            elevation="sm"
            onPress={() => navigation.navigate('WordsTab', { screen: 'CreateWord' })}
          >
            <ActionIconCircle bgColor="#F3E8FF">
              <ActionIcon>➕</ActionIcon>
            </ActionIconCircle>
            <ActionContent>
              <ActionTitle>Add New Word</ActionTitle>
              <ActionDesc>Expand your custom vocabulary library</ActionDesc>
            </ActionContent>
            <ActionArrow>→</ActionArrow>
          </ActionCard>
        </ActionCardsGrid>
      </ScrollView>
    </ScreenContainer>
  );
};
