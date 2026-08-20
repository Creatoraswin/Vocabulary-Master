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

type Props = NativeStackScreenProps<WordStackParamList, 'EditWord'>;

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

export const EditWordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { word: initialWord } = route.params;
  const { words, updateWord, isLoading } = useWords();

  const [word, setWord] = useState(initialWord.word);
  const [meaning, setMeaning] = useState(initialWord.meaning);
  const [example, setExample] = useState(initialWord.example || '');
  const [category, setCategory] = useState<string>(initialWord.category);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialWord.difficulty);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUpdate = async () => {
    const validation = validateWordInput(
      word,
      meaning,
      category,
      difficulty,
      words,
      initialWord.id
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    try {
      await updateWord({
        id: initialWord.id,
        word: word.trim(),
        meaning: meaning.trim(),
        example: example.trim(),
        category,
        difficulty,
      });

      Alert.alert('Updated', 'Word updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update word');
    }
  };

  return (
    <ScreenContainer scrollable>
      <Header
        title="Edit Word"
        subtitle={`Editing "${initialWord.word}"`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <FormCard>
          <Input
            label="Word"
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
            label="Example Sentence"
            value={example}
            onChangeText={setExample}
            multiline
          />

          {/* Difficulty */}
          <SectionLabel>Difficulty Level</SectionLabel>
          <ChipsWrap>
            {DIFFICULTIES.map(diff => (
              <FilterChip
                key={diff}
                label={diff}
                isSelected={difficulty === diff}
                onPress={() => setDifficulty(diff)}
              />
            ))}
          </ChipsWrap>

          {/* Category */}
          <SectionLabel>Category</SectionLabel>
          <ChipsWrap>
            {VOCABULARY_CATEGORIES.map(cat => (
              <FilterChip
                key={cat}
                label={cat}
                isSelected={category === cat}
                onPress={() => setCategory(cat)}
              />
            ))}
          </ChipsWrap>

          <Button
            title="Save Changes"
            onPress={handleUpdate}
            isLoading={isLoading}
            size="lg"
            style={{ marginTop: 8 }}
          />
        </FormCard>
      </ScrollView>
    </ScreenContainer>
  );
};
