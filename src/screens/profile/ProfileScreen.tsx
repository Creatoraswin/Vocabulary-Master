import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useAuth } from '../../hooks/useAuth';
import { useWords } from '../../hooks/useWords';
import { useEvaluation } from '../../hooks/useEvaluation';
import { getAmplifyStatus } from '../../services/amplifyConfig';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { ModalDialog } from '../../components/common/ModalDialog';

const ProfileHeaderCard = styled(Card)`
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const AvatarCircle = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const AvatarText = styled.Text`
  font-size: 28px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.inverse};
`;

const UserName = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

const UserEmail = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SectionHeader = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-horizontal: -${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SystemCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SystemRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
`;

const SystemLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SystemValue = styled.Text<{ highlight?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, highlight }) =>
    highlight ? theme.colors.status.success : theme.colors.text.primary};
`;

export const ProfileScreen: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();
  const { totalCount, learningProgressList } = useWords();
  const { history } = useEvaluation();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const amplifyStatus = getAmplifyStatus();

  const masteredCount = learningProgressList.filter(p => p.status === 'REMEMBERED').length;
  const reviewCount = learningProgressList.filter(p => p.status === 'REVIEW').length;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const handleLogoutConfirm = async () => {
    setIsLogoutModalVisible(false);
    await signOut();
  };

  return (
    <ScreenContainer scrollable>
      <Header title="My Profile" subtitle="Account details & learning summary" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeaderCard elevation="sm">
          <AvatarCircle>
            <AvatarText>{initial}</AvatarText>
          </AvatarCircle>
          <UserName>{user?.name || 'Vocabulary Learner'}</UserName>
          <UserEmail>{user?.email || 'learner@example.com'}</UserEmail>
        </ProfileHeaderCard>

        <SectionHeader>Learning Summary</SectionHeader>
        <StatsGrid>
          <StatCard
            label="Total Vocabulary"
            value={totalCount}
            iconText="📚"
            iconBgColor="#EEF2FF"
          />
          <StatCard
            label="Words Mastered"
            value={masteredCount}
            iconText="🎯"
            iconBgColor="#ECFDF5"
          />
          <StatCard
            label="Needs Review"
            value={reviewCount}
            iconText="🔄"
            iconBgColor="#FEF2F2"
          />
          <StatCard
            label="Quizzes Taken"
            value={history.length}
            iconText="🏆"
            iconBgColor="#FEF3C7"
          />
        </StatsGrid>

        <SectionHeader>Backend Architecture Status</SectionHeader>
        <SystemCard elevation="sm">
          <SystemRow>
            <SystemLabel>Authentication</SystemLabel>
            <SystemValue highlight>AWS Amplify Cognito</SystemValue>
          </SystemRow>
          <SystemRow>
            <SystemLabel>API Architecture</SystemLabel>
            <SystemValue highlight>AWS AppSync GraphQL</SystemValue>
          </SystemRow>
          <SystemRow>
            <SystemLabel>Data Storage</SystemLabel>
            <SystemValue highlight>Amazon DynamoDB</SystemValue>
          </SystemRow>
          <SystemRow>
            <SystemLabel>Backend Connection</SystemLabel>
            <SystemValue highlight={amplifyStatus.isAwsConnected}>
              {amplifyStatus.isAwsConnected ? 'Connected (Live)' : 'Active (Local DynamoDB Sync)'}
            </SystemValue>
          </SystemRow>
        </SystemCard>

        <Button
          title="Sign Out"
          variant="danger"
          size="lg"
          onPress={() => setIsLogoutModalVisible(true)}
          isLoading={isLoading}
        />
      </ScrollView>

      <ModalDialog
        visible={isLogoutModalVisible}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        isDanger
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutModalVisible(false)}
      />
    </ScreenContainer>
  );
};
