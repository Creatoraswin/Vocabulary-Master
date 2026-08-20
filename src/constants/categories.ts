export const VOCABULARY_CATEGORIES = [
  'General',
  'Academic',
  'Business',
  'Technology',
  'Science',
  'Daily Life',
  'Travel',
  'Literature',
] as const;

export type VocabularyCategory = typeof VOCABULARY_CATEGORIES[number];
