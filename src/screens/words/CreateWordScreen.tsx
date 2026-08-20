import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WordStackParamList } from '../../types/navigation.types';
import { useWords } from '../../hooks/useWords';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { FilterChip } from '../../components/common/FilterChip';
import { VOCABULARY_CATEGORIES } from '../../constants/categories';
import { DIFFICULTIES } from '../../constants/difficulties';
import { Difficulty } from '../../types/word.types';
import { validateWordInput } from '../../utils/validation';

type Props = NativeStackScreenProps<WordStackParamList, 'CreateWord'>;

const FormCard = styled.View`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => theme.spacing.xl}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
  ${({ theme }) => theme.shadows.md}
`;

const SectionLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const RequiredAsterisk = styled.Text`
  color: ${({ theme }) => theme.colors.status.error};
`;

const ChipsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const ErrorText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.status.error};
  margin-top: -${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const CreateWordScreen: React.FC<Props> = ({ navigation }) => {
  const { words, createWord, isLoading } = useWords();

  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [category, setCategory] = useState<string>(VOCABULARY_CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    const validation = validateWordInput(word, meaning, category, difficulty, words);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    try {
      await createWord({
        word: word.trim(),
        meaning: meaning.trim(),
        example: example.trim(),
        category,
        difficulty,
      });

      Alert.alert('Success', `"${word.trim()}" has been added to your vocabulary!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create word');
    }
  };

  return (
    <ScreenContainer scrollable>
      <Header
        title="Add New Word"
        subtitle="Expand your vocabulary repository"
        onBack={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <FormCard>
          <Input
            label="Word"
            placeholder="e.g. Ephemeral"
            value={word}
            onChangeText={t => {
              setWord(t);
              if (errors.word) setErrors(prev => ({ ...prev, word: '' }));
            }}
            error={errors.word}
            required
          />

          <Input
            label="Meaning / Definition"
            placeholder="e.g. Lasting for a very short time; transitory."
            value={meaning}
            onChangeText={t => {
              setMeaning(t);
              if (errors.meaning) setErrors(prev => ({ ...prev, meaning: '' }));
            }}
            multiline
            error={errors.meaning}
            required
          />

          <Input
            label="Example Sentence (Optional)"
            placeholder="e.g. The ephemeral beauty of cherry blossoms draws millions of visitors."
            value={example}
            onChangeText={setExample}
            multiline
            helperText="Provides context during memorization and evaluation"
          />

          {/* Difficulty Selection */}
          <SectionLabel>
            Difficulty Level <RequiredAsterisk>*</RequiredAsterisk>
          </SectionLabel>
          <ChipsWrap>
            {DIFFICULTIES.map(diff => (
              <FilterChip
                key={diff}
                label={diff}
                isSelected={difficulty === diff}
                onPress={() => {
                  setDifficulty(diff);
                  if (errors.difficulty) setErrors(prev => ({ ...prev, difficulty: '' }));
                }}
              />
            ))}
          </ChipsWrap>
          {errors.difficulty && <ErrorText>{errors.difficulty}</ErrorText>}

          {/* Category Selection */}
          <SectionLabel>
            Category <RequiredAsterisk>*</RequiredAsterisk>
          </SectionLabel>
          <ChipsWrap>
            {VOCABULARY_CATEGORIES.map(cat => (
              <FilterChip
                key={cat}
                label={cat}
                isSelected={category === cat}
                onPress={() => {
                  setCategory(cat);
                  if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                }}
              />
            ))}
          </ChipsWrap>
          {errors.category && <ErrorText>{errors.category}</ErrorText>}

          <Button
            title="Save Word"
            onPress={handleSave}
            isLoading={isLoading}
            size="lg"
            style={{ marginTop: 8 }}
          />
        </FormCard>
      </ScrollView>
    </ScreenContainer>
  );
};
