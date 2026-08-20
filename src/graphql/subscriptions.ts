export const onCreateWord = /* GraphQL */ `
  subscription OnCreateWord {
    onCreateWord {
      id
      word
      meaning
      example
      category
      difficulty
      createdAt
      updatedAt
    }
  }
`;

export const onUpdateWord = /* GraphQL */ `
  subscription OnUpdateWord {
    onUpdateWord {
      id
      word
      meaning
      example
      category
      difficulty
      createdAt
      updatedAt
    }
  }
`;

export const onDeleteWord = /* GraphQL */ `
  subscription OnDeleteWord {
    onDeleteWord {
      id
      word
      meaning
      example
      category
      difficulty
      createdAt
      updatedAt
    }
  }
`;
