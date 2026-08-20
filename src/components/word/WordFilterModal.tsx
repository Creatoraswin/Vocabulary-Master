import React from 'react';
import { Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { VOCABULARY_CATEGORIES } from '../../constants/categories';
import { DIFFICULTIES } from '../../constants/difficulties';
import { Difficulty, LearningStatus, WordFilters } from '../../types/word.types';
import { FilterChip } from '../common/FilterChip';
import { Button } from '../common/Button';

interface WordFilterModalProps {
  visible: boolean;
  filters: WordFilters;
  onApplyFilters: (filters: WordFilters) => void;
  onResetFilters: () => void;
  onClose: () => void;
}

const Overlay = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.modalOverlay};
  justify-content: flex-end;
`;

const ContentContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.xxl}px;
  border-top-right-radius: ${({ theme }) => theme.borderRadius.xxl}px;
  max-height: 80%;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

const CloseText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const ChipsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const ActionsRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border.light};
`;

const ActionButtonWrapper = styled.View`
  flex: 1;
`;

export const WordFilterModal: React.FC<WordFilterModalProps> = ({
  visible,
  filters,
  onApplyFilters,
  onResetFilters,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = React.useState<WordFilters>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  const handleToggleCategory = (cat: string) => {
    setLocalFilters(prev => ({
      ...prev,
      category: prev.category === cat ? null : cat,
    }));
  };

  const handleToggleDifficulty = (diff: Difficulty) => {
    setLocalFilters(prev => ({
      ...prev,
      difficulty: prev.difficulty === diff ? null : diff,
    }));
  };

  const handleToggleStatus = (status: LearningStatus) => {
    setLocalFilters(prev => ({
      ...prev,
      status: prev.status === status ? null : status,
    }));
  };

  const handleSortChange = (sortBy: WordFilters['sortBy']) => {
    setLocalFilters(prev => ({
      ...prev,
      sortBy,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Overlay>
          <TouchableWithoutFeedback>
            <ContentContainer>
              <HeaderRow>
                <Title>Filter & Sort Words</Title>
                <CloseButton onPress={onClose}>
                  <CloseText>✕</CloseText>
                </CloseButton>
              </HeaderRow>

              <ScrollView showsVerticalScrollIndicator={false}>
                <SectionTitle>Sort By</SectionTitle>
                <ChipsWrap>
                  <FilterChip
                    label="A to Z"
                    isSelected={localFilters.sortBy === 'word-asc'}
                    onPress={() => handleSortChange('word-asc')}
                  />
                  <FilterChip
                    label="Z to A"
                    isSelected={localFilters.sortBy === 'word-desc'}
                    onPress={() => handleSortChange('word-desc')}
                  />
                  <FilterChip
                    label="Newest First"
                    isSelected={localFilters.sortBy === 'created-desc'}
                    onPress={() => handleSortChange('created-desc')}
                  />
                  <FilterChip
                    label="Difficulty"
                    isSelected={localFilters.sortBy === 'difficulty'}
                    onPress={() => handleSortChange('difficulty')}
                  />
                </ChipsWrap>

                <SectionTitle>Difficulty</SectionTitle>
                <ChipsWrap>
                  {DIFFICULTIES.map(diff => (
                    <FilterChip
                      key={diff}
                      label={diff}
                      isSelected={localFilters.difficulty === diff}
                      onPress={() => handleToggleDifficulty(diff)}
                    />
                  ))}
                </ChipsWrap>

                <SectionTitle>Learning Status</SectionTitle>
                <ChipsWrap>
                  {(['NEW', 'LEARNING', 'REMEMBERED', 'REVIEW'] as LearningStatus[]).map(st => (
                    <FilterChip
                      key={st}
                      label={st}
                      isSelected={localFilters.status === st}
                      onPress={() => handleToggleStatus(st)}
                    />
                  ))}
                </ChipsWrap>

                <SectionTitle>Category</SectionTitle>
                <ChipsWrap>
                  {VOCABULARY_CATEGORIES.map(cat => (
                    <FilterChip
                      key={cat}
                      label={cat}
                      isSelected={localFilters.category === cat}
                      onPress={() => handleToggleCategory(cat)}
                    />
                  ))}
                </ChipsWrap>
              </ScrollView>

              <ActionsRow>
                <ActionButtonWrapper>
                  <Button
                    title="Reset All"
                    variant="outline"
                    onPress={handleReset}
                    size="sm"
                  />
                </ActionButtonWrapper>
                <ActionButtonWrapper>
                  <Button
                    title="Apply Filters"
                    variant="primary"
                    onPress={handleApply}
                    size="sm"
                  />
                </ActionButtonWrapper>
              </ActionsRow>
            </ContentContainer>
          </TouchableWithoutFeedback>
        </Overlay>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
