import { WebClient, LogLevel, ChatPostMessageArguments } from '@slack/web-api';
// @ts-ignore
import { LogModel } from './db/models/index';

class SlackMessageSender {
  private static instance: SlackMessageSender;
  private slackClient: WebClient;

  static getInstance(): SlackMessageSender {
    if (this.instance) {
      return this.instance;
    }

    return new SlackMessageSender();
  }

  private constructor() {
    this.slackClient = new WebClient(process.env.SLACK_TOKEN, {
      logLevel: LogLevel.DEBUG,
    });
  }

  getBaseMessageTemplate(options: { title: string, log: LogModel }): ChatPostMessageArguments {
    return {
      token: process.env.SLACK_TOKEN,
      channel: process.env.SLACK_CHANNEL_ID!,
      text: options.log.content,
      blocks: [
        {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${options.title} :fire:`,
              emoji: true
            }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:*\n${options.log.content}`,
          }
        },
        {
          type: 'divider'
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Level:*\n${options.log.level}`
            },
            {
              type: 'mrkdwn',
              text: `*Date & time:*\n${options.log.createdAt.toISOString().slice(0, 19).replace('T', ' ')}`
            }
          ]
        },
      ]
    };
  }

  async publishMessage(template: ChatPostMessageArguments): Promise<boolean> {
    try {
      await this.slackClient.chat.postMessage(template);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

export default SlackMessageSender;
