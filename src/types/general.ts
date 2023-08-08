import { SlackMessageSection } from './slack';

export interface LoggingOptions {
    group?: any,
    slackMessageExtraSections?: SlackMessageSection[],
};

export interface LogTracingOptions {
    slackIntegration?: boolean,
}