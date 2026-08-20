import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EvaluationStackParamList } from '../../types/navigation.types';
import { useWords } from '../../hooks/useWords';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { FilterChip } from '../../components/common/FilterChip';
import { Button } from '../../components/common/Button';
import { VOCABULARY_CATEGORIES } from '../../constants/categories';
import { DIFFICULTIES } from '../../constants/difficulties';
import { Difficulty } from '../../types/word.types';
import { APP_CONFIG } from '../../constants/config';

type Props = NativeStackScreenProps<EvaluationStackParamList, 'EvaluationSetup'>;

const SetupCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ChipsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const InfoBox = styled.View`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const InfoText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.primary[800]};
  line-height: ${({ theme }) => theme.typography.lineHeight.xs}px;
`;

export const EvaluationSetupScreen: React.FC<Props> = ({ navigation }) => {
  const { totalCount } = useWords();

  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<Difficulty | 'ALL'>('ALL');
  const [category, setCategory] = useState<string | 'ALL'>('ALL');

  const handleStart = () => {
    navigation.navigate('EvaluationQuiz', {
      options: {
        questionCount,
        difficulty,
        category,
      },
    });
  };

  return (
    <ScreenContainer scrollable>
      <Header
        title="Knowledge Evaluation"
        subtitle="Assess your vocabulary retention"
        rightAction={{
          label: '📜 History',
          onPress: () => navigation.navigate('EvaluationHistory'),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <SetupCard elevation="sm">
          <Description>
            Customize your vocabulary assessment test. Questions test Word → Meaning definitions
            and Meaning → Word associations.
          </Description>

          <SectionTitle>Number of Questions</SectionTitle>
          <ChipsWrap>
            {APP_CONFIG.evaluationOptions.map(count => (
              <FilterChip
                key={count}
                label={`${count} Questions`}
                isSelected={questionCount === count}
                onPress={() => setQuestionCount(count)}
              />
            ))}
          </ChipsWrap>

          <SectionTitle>Difficulty Filter</SectionTitle>
          <ChipsWrap>
            <FilterChip
              label="All Difficulties (Mixed)"
              isSelected={difficulty === 'ALL'}
              onPress={() => setDifficulty('ALL')}
            />
            {DIFFICULTIES.map(diff => (
              <FilterChip
                key={diff}
                label={diff}
                isSelected={difficulty === diff}
                onPress={() => setDifficulty(diff)}
              />
            ))}
          </ChipsWrap>

          <SectionTitle>Category Focus</SectionTitle>
          <ChipsWrap>
            <FilterChip
              label="All Categories"
              isSelected={category === 'ALL'}
              onPress={() => setCategory('ALL')}
            />
            {VOCABULARY_CATEGORIES.map(cat => (
              <FilterChip
                key={cat}
                label={cat}
                isSelected={category === cat}
                onPress={() => setCategory(cat)}
              />
            ))}
          </ChipsWrap>

          <InfoBox>
            <InfoText>
              💡 Total available vocabulary: {totalCount} words. Quiz will pick distinct questions and randomize all answer options.
            </InfoText>
          </InfoBox>

          <Button
            title="Start Evaluation"
            variant="primary"
            size="lg"
            onPress={handleStart}
          />
        </SetupCard>
      </ScrollView>
    </ScreenContainer>
  );
};
