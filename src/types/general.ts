import { SlackMessageSection } from './slack';

export interface LoggerOptions {
    group?: any,
    slackMessageExtraSections?: SlackMessageSection[],
};

export interface GeneralOptions {
    slackIntegration?: boolean,
}