import { Platform } from 'react-native';

export const shadows = {
  sm: Platform.select({
    ios: `
      shadow-color: #0F172A;
      shadow-offset: 0px 1px;
      shadow-opacity: 0.05;
      shadow-radius: 2px;
    `,
    android: `
      elevation: 2;
    `,
    default: `
      shadow-color: #0F172A;
      shadow-offset: 0px 1px;
      shadow-opacity: 0.05;
      shadow-radius: 2px;
    `,
  }),
  md: Platform.select({
    ios: `
      shadow-color: #0F172A;
      shadow-offset: 0px 3px;
      shadow-opacity: 0.08;
      shadow-radius: 6px;
    `,
    android: `
      elevation: 4;
    `,
    default: `
      shadow-color: #0F172A;
      shadow-offset: 0px 3px;
      shadow-opacity: 0.08;
      shadow-radius: 6px;
    `,
  }),
  lg: Platform.select({
    ios: `
      shadow-color: #0F172A;
      shadow-offset: 0px 6px;
      shadow-opacity: 0.12;
      shadow-radius: 12px;
    `,
    android: `
      elevation: 8;
    `,
    default: `
      shadow-color: #0F172A;
      shadow-offset: 0px 6px;
      shadow-opacity: 0.12;
      shadow-radius: 12px;
    `,
  }),
};

