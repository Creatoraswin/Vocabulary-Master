import React from 'react';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearningStackParamList } from '../../types/navigation.types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Button } from '../../components/common/Button';
import { getScorePerformanceMessage } from '../../utils/formatters';

type Props = NativeStackScreenProps<LearningStackParamList, 'LearningSummary'>;

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
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SummaryCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-horizontal: -${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ActionsContainer = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

export const LearningSummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { summary } = route.params;
  const performance = getScorePerformanceMessage(summary.accuracyPercentage);

  return (
    <ScreenContainer scrollable>
      <TrophyCircle color={performance.color}>
        <TrophyIcon>🎉</TrophyIcon>
      </TrophyCircle>

      <Title>{performance.title}</Title>
      <Subtitle>{performance.subtitle}</Subtitle>

      <SummaryCard elevation="sm">
        <ProgressBar
          progress={summary.accuracyPercentage / 100}
          label="Session Accuracy"
          showPercentage
          height={12}
          color={performance.color}
        />
      </SummaryCard>

      <StatsGrid>
        <StatCard
          label="Total Words"
          value={summary.totalWords}
          iconText="📚"
          iconBgColor="#EEF2FF"
        />
        <StatCard
          label="Remembered"
          value={summary.rememberedCount}
          iconText="✅"
          iconBgColor="#ECFDF5"
        />
        <StatCard
          label="Need Review"
          value={summary.reviewCount}
          iconText="🔄"
          iconBgColor="#FEF2F2"
        />
        <StatCard
          label="Accuracy"
          value={`${summary.accuracyPercentage}%`}
          iconText="🎯"
          iconBgColor="#FEF3C7"
        />
      </StatsGrid>

      <ActionsContainer>
        <Button
          title="Learn Again"
          variant="primary"
          size="lg"
          onPress={() => navigation.replace('LearningSession')}
        />

        <Button
          title="Take Evaluation Quiz"
          variant="secondary"
          size="lg"
          onPress={() => navigation.getParent()?.navigate('EvaluationTab')}
        />

        <Button
          title="Back to Dashboard"
          variant="outline"
          size="md"
          onPress={() => navigation.getParent()?.navigate('Home')}
        />
      </ActionsContainer>
    </ScreenContainer>
  );
};
