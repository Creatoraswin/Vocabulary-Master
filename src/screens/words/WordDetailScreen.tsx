import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WordStackParamList } from '../../types/navigation.types';
import { useWords } from '../../hooks/useWords';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ModalDialog } from '../../components/common/ModalDialog';
import { formatDate } from '../../utils/formatters';

type Props = NativeStackScreenProps<WordStackParamList, 'WordDetail'>;

const DetailCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const BadgesRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const WordHeading = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.heavy};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SectionLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const MeaningText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.md}px;
`;

const ExampleCard = styled.View`
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.primary[500]};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const ExampleText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  line-height: ${({ theme }) => theme.typography.lineHeight.sm}px;
`;

const MetaRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border.light};
  padding-top: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const MetaText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const ActionsContainer = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xxl}px;
`;

const DualButtonsRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;

export const WordDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { wordId } = route.params;
  const { words, deleteWord, getWordStatus, isLoading } = useWords();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const word = words.find(w => w.id === wordId);
  const status = getWordStatus(wordId);

  if (!word) {
    return (
      <ScreenContainer>
        <Header title="Word Detail" onBack={() => navigation.goBack()} />
        <DetailCard>
          <WordHeading>Word Not Found</WordHeading>
          <MeaningText>This vocabulary word could not be found or has been removed.</MeaningText>
          <Button
            title="Return to Word List"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 16 }}
          />
        </DetailCard>
      </ScreenContainer>
    );
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteWord(word.id);
      setIsDeleteModalVisible(false);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to delete word');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ScreenContainer scrollable>
      <Header
        title="Word Details"
        subtitle={`Category: ${word.category}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <DetailCard elevation="md">
          <BadgesRow>
            <Badge label={word.category} type="category" />
            <Badge label={word.difficulty} type="difficulty" difficulty={word.difficulty} />
            <Badge label={status} type="status" status={status} />
          </BadgesRow>

          <WordHeading>{word.word}</WordHeading>

          <SectionLabel>Definition</SectionLabel>
          <MeaningText>{word.meaning}</MeaningText>

          {word.example ? (
            <>
              <SectionLabel>Example in Context</SectionLabel>
              <ExampleCard>
                <ExampleText>"{word.example}"</ExampleText>
              </ExampleCard>
            </>
          ) : null}

          <MetaRow>
            <MetaText>Added: {formatDate(word.createdAt)}</MetaText>
            <MetaText>Updated: {formatDate(word.updatedAt)}</MetaText>
          </MetaRow>
        </DetailCard>

        <ActionsContainer>
          <DualButtonsRow>
            <ButtonWrapper>
              <Button
                title="Edit Word"
                variant="outline"
                onPress={() => navigation.navigate('EditWord', { word })}
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <Button
                title="Delete Word"
                variant="danger"
                onPress={() => setIsDeleteModalVisible(true)}
              />
            </ButtonWrapper>
          </DualButtonsRow>
        </ActionsContainer>
      </ScrollView>

      <ModalDialog
        visible={isDeleteModalVisible}
        title="Delete Vocabulary Word"
        message={`Are you sure you want to delete "${word.word}" from your vocabulary? This action cannot be undone.`}
        confirmText="Delete Word"
        cancelText="Keep Word"
        isDanger
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </ScreenContainer>
  );
};
