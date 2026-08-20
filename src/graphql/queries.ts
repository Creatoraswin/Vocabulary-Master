export const listWords = /* GraphQL */ `
  query ListWords($filter: ModelWordFilterInput, $limit: Int, $nextToken: String) {
    listWords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        word
        meaning
        example
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getWord = /* GraphQL */ `
  query GetWord($id: ID!) {
    getWord(id: $id) {
      id
      word
      meaning
      example
      createdAt
      updatedAt
    }
  }
`;

export const getUserProgress = /* GraphQL */ `
  query GetUserProgress($userId: String!) {
    getUserProgress(userId: $userId) {
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

export const getEvaluationHistory = /* GraphQL */ `
  query GetEvaluationHistory($userId: String!, $limit: Int) {
    getEvaluationHistory(userId: $userId, limit: $limit) {
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
