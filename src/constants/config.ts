export const APP_CONFIG = {
  appName: 'Vocabulary Master',
  version: '1.0.0',
  defaultLearningSessionSize: 10,
  defaultEvaluationQuestionCount: 10,
  evaluationOptions: [5, 10, 15, 20],
  storageKeys: {
    WORDS: '@app_words',
    LEARNING_PROGRESS: '@app_learning_progress',
    EVALUATIONS: '@app_evaluations',
    AUTH_USER: '@app_auth_user',
    APP_SETTINGS: '@app_settings',
  },
  awsDefaults: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_exampleId',
    userPoolWebClientId: 'exampleAppClientId',
    appSyncGraphqlEndpoint: 'https://example.appsync-api.us-east-1.amazonaws.com/graphql',
    appSyncRegion: 'us-east-1',
    appSyncAuthType: 'AMAZON_COGNITO_USER_POOLS',
  },
};
