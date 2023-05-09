import { expect, describe, test } from '@jest/globals';
import Logger from '../src/Logger';

describe('Testing basic logging operations', () => {
  test('Create a simple instance for a Testing flow', () => {
    const logger: Logger = new Logger('Testing');

    expect(logger.flow).toBe('Testing');
  });
});
