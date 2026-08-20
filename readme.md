# Vocabulary Master

A modern mobile application for learning and memorizing vocabulary words with spaced-repetition flashcards and multiple-choice retention assessments. Built with **React Native**, **TypeScript**, **React Navigation**, **styled-components**, and **AWS Amplify / AppSync GraphQL**.

---

## Features

* **User Authentication**: Secure sign-in, registration, email verification, and password recovery powered by AWS Amplify Cognito.
* **Dashboard & Metrics**: Visual mastery progress bars, overview statistics (words remembered, words in review, quiz averages), and quick access cards.
* **Word Management (CRUD)**:
  * Comprehensive word library with categories, difficulty ratings, and context examples.
  * Real-time search by word title and meaning.
  * Multi-criteria filtering (Category, Difficulty, Learning Status) and sorting.
  * Pull-to-refresh list with responsive empty states.
* **Spaced-Repetition Learning**:
  * Clean, single-card flashcard view.
  * Tap-to-reveal word definitions and usage examples.
  * Intelligent spaced-repetition algorithm prioritizing review words and unlearned items.
  * Session completion summary with accuracy score calculations.
* **Knowledge Evaluation**:
  * Customized quiz setup (question count, difficulty filter, category focus).
  * Dual-format question generator (Word → Meaning and Meaning → Word) with randomized answer options.
  * Instant scoring with question-by-question breakdown.
  * History tracking to view past assessment performance.
* **Profile Management**: Account details, learning summary, and connection indicators.

---

## Tech Stack

* **Frontend Framework**: React Native 0.74
* **Language**: TypeScript (Strict Mode)
* **Navigation**: React Navigation v6 (Native Stack + Bottom Tabs)
* **Styling**: styled-components v6 with central design tokens
* **Backend & API**: AWS Amplify v6, AWS AppSync GraphQL, Amazon DynamoDB, Amazon Cognito
* **Testing**: Jest + React Native Test Runner

---

## Project Structure

```
src/
├── components/
│   ├── common/         # Button, Input, Card, Header, Badge, ProgressBar, StatCard, etc.
│   ├── word/           # WordCard, WordFilterModal
│   ├── learning/       # Flashcard
│   └── evaluation/     # QuestionCard
├── screens/
│   ├── auth/           # Login, Register, ForgotPassword, ConfirmSignUp
│   ├── dashboard/      # DashboardScreen
│   ├── words/          # WordList, WordDetail, CreateWord, EditWord
│   ├── learning/       # LearningSession, LearningSummary
│   ├── evaluation/     # EvaluationSetup, EvaluationQuiz, EvaluationResult, EvaluationHistory
│   └── profile/        # ProfileScreen
├── navigation/         # Navigators & type definitions
├── services/           # Amplify configuration, GraphQL API, Auth, Word, Learning, and Evaluation services
├── graphql/            # GraphQL SDL schema, queries, mutations, subscriptions
├── hooks/              # useAuth, useWords, useLearning, useEvaluation
├── types/              # TypeScript interfaces
├── utils/              # Form validation, learning algorithm, evaluation generator, formatters
├── theme/              # Colors, typography, spacing, shadows, styled-components declarations
└── constants/          # Categories, difficulties, app configuration, seed dataset
```

---

## Getting Started

### Prerequisites
* Node.js >= 18
* npm or yarn
* Android Studio (with Android SDK) or Xcode (macOS)

### Installation
```bash
npm install --legacy-peer-deps
```

### Start Metro Bundler
```bash
npm start
```

### Run on Android
```bash
npm run android
```

### Run on iOS
```bash
npm run ios
```

---

## Testing & Type Safety

Run TypeScript verification:
```bash
npm run type-check
```

Run unit tests:
```bash
npm test
```

---

## AWS Configuration

The application is pre-configured to work with AWS Amplify and AppSync GraphQL. Configuration settings are loaded via `src/aws-exports.js` or environment variables:

```env
REACT_APP_USER_POOL_ID=ap-south-1_QkNYiGxOy
REACT_APP_CLIENT_ID=7bmtor864tje289cr14jtbds5o
REACT_APP_APPSYNC_ENDPOINT=https://45apvquohbfhnmvnwdula6cmam.appsync-api.ap-south-1.amazonaws.com/graphql
REACT_APP_AWS_REGION=ap-south-1
```

---

## License

MIT License.
