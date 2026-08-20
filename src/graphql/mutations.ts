export const createWord = /* GraphQL */ `
  mutation CreateWord($input: CreateWordInput!) {
    createWord(input: $input) {
      id
      word
      meaning
      example
      createdAt
      updatedAt
    }
  }
`;

export const updateWord = /* GraphQL */ `
  mutation UpdateWord($input: UpdateWordInput!) {
    updateWord(input: $input) {
      id
      word
      meaning
      example
      createdAt
      updatedAt
    }
  }
`;

export const deleteWord = /* GraphQL */ `
  mutation DeleteWord($input: DeleteWordInput!) {
    deleteWord(input: $input) {
      id
      word
      meaning
      example
      createdAt
      updatedAt
    }
  }
`;

export const saveLearningProgress = /* GraphQL */ `
  mutation SaveLearningProgress($input: SaveLearningProgressInput!) {
    saveLearningProgress(input: $input) {
      id
      userId
      wordId
      status
      attempts
      correctCount
      incorrectCount
      lastReviewedAt
      updatedAt
    }
  }
`;

export const createEvaluation = /* GraphQL */ `
  mutation CreateEvaluation($input: CreateEvaluationInput!) {
    createEvaluation(input: $input) {
      id
      userId
      totalQuestions
      correctAnswers
      incorrectAnswers
      score
      percentage
      createdAt
    }
  }
`;
