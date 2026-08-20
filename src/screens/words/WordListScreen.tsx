import React, { useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WordStackParamList } from '../../types/navigation.types';
import { useWords } from '../../hooks/useWords';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { WordCard } from '../../components/word/WordCard';
import { WordFilterModal } from '../../components/word/WordFilterModal';
import { EmptyState } from '../../components/common/EmptyState';
import { FilterChip } from '../../components/common/FilterChip';
import { Word } from '../../types/word.types';

type Props = NativeStackScreenProps<WordStackParamList, 'WordList'>;

const SearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SearchInputWrapper = styled.View`
  flex: 1;
`;

const FilterButton = styled(TouchableOpacity)<{ hasActiveFilters: boolean }>`
  height: 48px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  border-width: 1.5px;
  border-color: ${({ hasActiveFilters, theme }) =>
    hasActiveFilters ? theme.colors.primary[600] : theme.colors.border.light};
  background-color: ${({ hasActiveFilters, theme }) =>
    hasActiveFilters ? theme.colors.primary[50] : theme.colors.background.secondary};
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const FilterButtonText = styled.Text<{ hasActiveFilters: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ hasActiveFilters, theme }) =>
    hasActiveFilters ? theme.colors.primary[700] : theme.colors.text.secondary};
`;

const ActiveFilterBadges = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ResultsCountText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const WordListScreen: React.FC<Props> = ({ navigation }) => {
  const {
    filteredWords,
    totalCount,
    filteredCount,
    filters,
    setFilters,
    resetFilters,
    isRefreshing,
    refresh,
    getWordStatus,
  } = useWords();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const hasActiveFilters = !!(
    filters.category ||
    filters.difficulty ||
    filters.status ||
    filters.sortBy !== 'created-desc'
  );

  const renderWordItem = ({ item }: { item: Word }) => {
    const status = getWordStatus(item.id);
    return (
      <WordCard
        word={item}
        learningStatus={status}
        onPress={() => navigation.navigate('WordDetail', { wordId: item.id })}
      />
    );
  };

  return (
    <ScreenContainer>
      <Header
        title="Vocabulary List"
        subtitle={`${totalCount} words in collection`}
        rightAction={{
          label: '➕ Add Word',
          onPress: () => navigation.navigate('CreateWord'),
        }}
      />

      <SearchRow>
        <SearchInputWrapper>
          <Input
            placeholder="Search word or meaning..."
            value={filters.searchQuery}
            onChangeText={t => setFilters(prev => ({ ...prev, searchQuery: t }))}
          />
        </SearchInputWrapper>
        <FilterButton
          hasActiveFilters={hasActiveFilters}
          onPress={() => setIsFilterModalOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
        >
          <FilterButtonText hasActiveFilters={hasActiveFilters}>
            ⚙ Filters {hasActiveFilters ? '●' : ''}
          </FilterButtonText>
        </FilterButton>
      </SearchRow>

      {hasActiveFilters && (
        <ActiveFilterBadges>
          {filters.category && (
            <FilterChip
              label={`Cat: ${filters.category}`}
              isSelected={true}
              onPress={() => setFilters(prev => ({ ...prev, category: null }))}
            />
          )}
          {filters.difficulty && (
            <FilterChip
              label={`Diff: ${filters.difficulty}`}
              isSelected={true}
              onPress={() => setFilters(prev => ({ ...prev, difficulty: null }))}
            />
          )}
          {filters.status && (
            <FilterChip
              label={`Status: ${filters.status}`}
              isSelected={true}
              onPress={() => setFilters(prev => ({ ...prev, status: null }))}
            />
          )}
          <FilterChip
            label="Clear All"
            isSelected={false}
            onPress={resetFilters}
          />
        </ActiveFilterBadges>
      )}

      <ResultsCountText>
        Showing {filteredCount} of {totalCount} words
      </ResultsCountText>

      <FlatList
        data={filteredWords}
        keyExtractor={item => item.id}
        renderItem={renderWordItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} colors={['#4F46E5']} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Words Found"
            description={
              hasActiveFilters || filters.searchQuery
                ? 'No vocabulary words matched your active filters or search query.'
                : 'Your vocabulary list is currently empty. Add your first word to start learning.'
            }
            iconText={hasActiveFilters ? '🔍' : '📖'}
            actionTitle={hasActiveFilters ? 'Reset Filters' : 'Add First Word'}
            onAction={hasActiveFilters ? resetFilters : () => navigation.navigate('CreateWord')}
          />
        }
      />

      <WordFilterModal
        visible={isFilterModalOpen}
        filters={filters}
        onApplyFilters={newFilters => setFilters(newFilters)}
        onResetFilters={resetFilters}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </ScreenContainer>
  );
};
