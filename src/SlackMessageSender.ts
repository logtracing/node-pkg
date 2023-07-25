import { WebClient, LogLevel, ChatPostMessageArguments } from '@slack/web-api';

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

  async publishMessage(template: ChatPostMessageArguments): Promise<boolean> {
    try {
      const result = await this.slackClient.chat.postMessage(template);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

export default SlackMessageSender;
