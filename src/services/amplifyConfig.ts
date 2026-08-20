import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';

let isConfigured = false;
let isAwsConnected = false;

export const configureAmplify = (customConfig?: Record<string, any>) => {
  try {
    const config = customConfig || awsconfig;

    if (config && config.aws_appsync_graphqlEndpoint) {
      Amplify.configure(config);
      isConfigured = true;
      isAwsConnected = true;
      console.log('[AmplifyConfig] Successfully configured AWS Amplify with live backend:', {
        region: config.aws_project_region,
        userPoolId: config.aws_user_pools_id,
        appSyncEndpoint: config.aws_appsync_graphqlEndpoint,
      });
    } else {
      isConfigured = true;
      isAwsConnected = false;
    }
  } catch (error) {
    console.warn('[AmplifyConfig] Amplify initialization warning:', error);
    isConfigured = true;
    isAwsConnected = false;
  }
};

export const getAmplifyStatus = () => ({
  isConfigured,
  isAwsConnected,
});
