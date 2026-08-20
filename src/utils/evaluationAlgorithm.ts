import { Word } from '../types/word.types';
import {
  EvaluationQuestion,
  EvaluationSetupOptions,
  QuestionType,
} from '../types/evaluation.types';

/**
 * Fisher-Yates shuffle helper
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates evaluation questions with randomized options and balanced question types.
 */
export const generateEvaluationQuestions = (
  allWords: Word[],
  options: EvaluationSetupOptions
): EvaluationQuestion[] => {
  // Filter by category and difficulty if requested
  let candidateWords = [...allWords];

  if (options.category && options.category !== 'ALL') {
    const categoryFiltered = candidateWords.filter(w => w.category === options.category);
    if (categoryFiltered.length >= 2) {
      candidateWords = categoryFiltered;
    }
  }

  if (options.difficulty && options.difficulty !== 'ALL') {
    const difficultyFiltered = candidateWords.filter(w => w.difficulty === options.difficulty);
    if (difficultyFiltered.length >= 2) {
      candidateWords = difficultyFiltered;
    }
  }

  if (candidateWords.length === 0) {
    candidateWords = [...allWords];
  }

  // Shuffle candidate words
  const shuffledCandidates = shuffleArray(candidateWords);
  const selectedWords = shuffledCandidates.slice(0, Math.min(options.questionCount, shuffledCandidates.length));

  const questions: EvaluationQuestion[] = selectedWords.map((targetWord, index) => {
    // Alternate question types (Word -> Meaning, Meaning -> Word)
    const questionType: QuestionType = index % 2 === 0 ? 'WORD_TO_MEANING' : 'MEANING_TO_WORD';

    // Pick distractors from the remaining words in allWords
    const otherWords = allWords.filter(w => w.id !== targetWord.id);
    const shuffledOthers = shuffleArray(otherWords);

    // Pick up to 3 distractors
    const distractorCount = Math.min(3, shuffledOthers.length);
    const distractors = shuffledOthers.slice(0, distractorCount);

    let correctAnswer = '';
    let prompt = '';
    let subPrompt = '';
    let optionList: string[] = [];

    if (questionType === 'WORD_TO_MEANING') {
      correctAnswer = targetWord.meaning;
      prompt = `What is the meaning of "${targetWord.word}"?`;
      subPrompt = `Category: ${targetWord.category} • Difficulty: ${targetWord.difficulty}`;
      const distractorOptions = distractors.map(d => d.meaning);
      optionList = shuffleArray([correctAnswer, ...distractorOptions]);
    } else {
      correctAnswer = targetWord.word;
      prompt = `Which word matches the following meaning?`;
      subPrompt = `"${targetWord.meaning}"`;
      const distractorOptions = distractors.map(d => d.word);
      optionList = shuffleArray([correctAnswer, ...distractorOptions]);
    }

    return {
      id: `q-${targetWord.id}-${index}`,
      wordId: targetWord.id,
      questionType,
      prompt,
      subPrompt,
      options: optionList,
      correctAnswer,
    };
  });

  return questions;
};
