///
/// JBoss, Home of Professional Open Source.
/// Copyright 2023 Red Hat, Inc., and individual contributors
/// as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
/// http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import {
  eventStatusToColor,
  eventStatusToDescription,
  extractQueryErrorMessageDetails,
  isInProgress,
  isSuccess,
  resultToColor,
  resultToDescription,
  statusToColor,
  statusToDescription,
  timestampToHumanReadable,
} from './Utils';
import { SbomerGeneration } from '@app/types';

describe('Utils', () => {
  describe('timestampToHumanReadable', () => {
    it('should return "just now" for times less than 60 seconds', () => {
      expect(timestampToHumanReadable(30000)).toBe('just now');
      expect(timestampToHumanReadable(59999)).toBe('just now');
    });

    it('should return minutes for times less than 1 hour', () => {
      expect(timestampToHumanReadable(60000)).toBe('1 minute');
      expect(timestampToHumanReadable(120000)).toBe('2 minutes');
      expect(timestampToHumanReadable(3540000)).toBe('59 minutes');
    });

    it('should return hours and minutes for times less than 1 day', () => {
      expect(timestampToHumanReadable(3600000)).toBe('1 hour');
      expect(timestampToHumanReadable(3660000)).toBe('1 hour 1 minute');
      expect(timestampToHumanReadable(7200000)).toBe('2 hours');
      expect(timestampToHumanReadable(7320000)).toBe('2 hours 2 minutes');
    });

    it('should return days and hours for 1-3 days', () => {
      expect(timestampToHumanReadable(86400000)).toBe('1 day');
      expect(timestampToHumanReadable(90000000)).toBe('1 day 1 hour');
      expect(timestampToHumanReadable(172800000)).toBe('2 days');
      expect(timestampToHumanReadable(259200000)).toBe('3 days');
    });

    it('should return only days for more than 3 days', () => {
      expect(timestampToHumanReadable(345600000)).toBe('4 days');
      expect(timestampToHumanReadable(432000000)).toBe('5 days');
    });

    it('should append suffix when provided', () => {
      expect(timestampToHumanReadable(3600000, false, 'ago')).toBe('1 hour ago');
      expect(timestampToHumanReadable(86400000, false, 'ago')).toBe('1 day ago');
    });
  });

  describe('statusToDescription', () => {
    it('should return description for known statuses', () => {
      expect(statusToDescription({ status: 'FAILED' } as SbomerGeneration)).toBe('Failed');
      expect(statusToDescription({ status: 'GENERATING' } as SbomerGeneration)).toBe('In progress');
      expect(statusToDescription({ status: 'FINISHED' } as SbomerGeneration)).toBe(
        'Successfully finished',
      );
    });

    it('should return original status for unknown statuses', () => {
      expect(statusToDescription({ status: 'UNKNOWN_STATUS' } as SbomerGeneration)).toBe(
        'UNKNOWN_STATUS',
      );
    });
  });

  describe('eventStatusToDescription', () => {
    it('should return description for known event statuses', () => {
      expect(eventStatusToDescription('FAILED')).toBe('Failed');
      expect(eventStatusToDescription('IGNORED')).toBe('Ignored');
      expect(eventStatusToDescription('IN_PROGRESS')).toBe('In progress');
      expect(eventStatusToDescription('SUCCESS')).toBe('Successfully finished');
      expect(eventStatusToDescription('NEW')).toBe('New');
      expect(eventStatusToDescription('PROCESSED')).toBe('Processed');
      expect(eventStatusToDescription('ERROR')).toBe('Error');
      expect(eventStatusToDescription('INITIALIZED')).toBe('Initialized');
    });

    it('should return original status for unknown event statuses', () => {
      expect(eventStatusToDescription('UNKNOWN_EVENT_STATUS')).toBe('UNKNOWN_EVENT_STATUS');
    });
  });

  describe('resultToDescription', () => {
    it('should return "In progress" when result is null', () => {
      expect(resultToDescription({ result: null } as unknown as SbomerGeneration)).toBe(
        'In progress',
      );
    });

    it('should return description for known results', () => {
      expect(resultToDescription({ result: 'SUCCESS' } as unknown as SbomerGeneration)).toBe(
        'Success',
      );
      expect(
        resultToDescription({ result: 'ERR_CONFIG_MISSING' } as unknown as SbomerGeneration),
      ).toBe('Missing configuration');
      expect(resultToDescription({ result: 'ERR_GENERAL' } as unknown as SbomerGeneration)).toBe(
        'General error',
      );
      expect(
        resultToDescription({ result: 'ERR_CONFIG_INVALID' } as unknown as SbomerGeneration),
      ).toBe('Invalid configuration');
      expect(
        resultToDescription({ result: 'ERR_INDEX_INVALID' } as unknown as SbomerGeneration),
      ).toBe('Invalid product index');
      expect(resultToDescription({ result: 'ERR_GENERATION' } as unknown as SbomerGeneration)).toBe(
        'Generation failure',
      );
      expect(resultToDescription({ result: 'ERR_SYSTEM' } as unknown as SbomerGeneration)).toBe(
        'System error',
      );
      expect(resultToDescription({ result: 'ERR_MULTI' } as unknown as SbomerGeneration)).toBe(
        'Multiple errors',
      );
    });

    it('should return original result for unknown results', () => {
      expect(resultToDescription({ result: 'UNKNOWN_RESULT' } as unknown as SbomerGeneration)).toBe(
        'UNKNOWN_RESULT',
      );
    });
  });

  describe('statusToColor', () => {
    it('should return "teal" for successful finished status', () => {
      expect(statusToColor('FINISHED')).toBe('teal');
    });

    it('should return "red" for failed status', () => {
      expect(statusToColor('FAILED')).toBe('red');
    });

    it('should return "gray" for in-progress statuses', () => {
      expect(statusToColor('GENERATING')).toBe('gray');
      expect(statusToColor('PENDING')).toBe('gray');
    });
  });

  describe('eventStatusToColor', () => {
    it('should return correct colors for known event statuses', () => {
      expect(eventStatusToColor('FAILED')).toBe('red');
      expect(eventStatusToColor('IGNORED')).toBe('gray');
      expect(eventStatusToColor('IN_PROGRESS')).toBe('blue');
      expect(eventStatusToColor('SUCCESS')).toBe('green');
      expect(eventStatusToColor('NEW')).toBe('teal');
      expect(eventStatusToColor('PROCESSED')).toBe('purple');
      expect(eventStatusToColor('ERROR')).toBe('red');
      expect(eventStatusToColor('INITIALIZED')).toBe('blue');
    });

    it('should return "gray" for unknown event statuses', () => {
      expect(eventStatusToColor('UNKNOWN_STATUS')).toBe('gray');
    });
  });

  describe('resultToColor', () => {
    it('should return "green" for success result', () => {
      expect(resultToColor('SUCCESS')).toBe('green');
    });

    it('should return "red" for error results', () => {
      expect(resultToColor('ERR_CONFIG_MISSING')).toBe('red');
      expect(resultToColor('ERR_GENERAL')).toBe('red');
      expect(resultToColor('ERR_CONFIG_INVALID')).toBe('red');
      expect(resultToColor('ERR_INDEX_INVALID')).toBe('red');
      expect(resultToColor('ERR_GENERATION')).toBe('red');
      expect(resultToColor('ERR_SYSTEM')).toBe('red');
      expect(resultToColor('ERR_MULTI')).toBe('red');
    });

    it('should return "warm-gray" for unknown results', () => {
      expect(resultToColor('UNKNOWN_RESULT')).toBe('warm-gray');
    });
  });

  describe('isInProgress', () => {
    it('should return false for FINISHED status', () => {
      expect(isInProgress('FINISHED')).toBe(false);
    });

    it('should return false for FAILED status', () => {
      expect(isInProgress('FAILED')).toBe(false);
    });

    it('should return true for other statuses', () => {
      expect(isInProgress('GENERATING')).toBe(true);
      expect(isInProgress('PENDING')).toBe(true);
      expect(isInProgress('STARTED')).toBe(true);
    });
  });

  describe('isSuccess', () => {
    it('should return true for FINISHED status', () => {
      expect(isSuccess('FINISHED')).toBe(true);
    });

    it('should return false for other statuses', () => {
      expect(isSuccess('FAILED')).toBe(false);
      expect(isSuccess('GENERATING')).toBe(false);
      expect(isSuccess('PENDING')).toBe(false);
    });
  });

  describe('extractQueryErrorMessageDetails', () => {
    it('should extract message and details from JSON response string', () => {
      const error = {
        message:
          'Error response: \'{"message":"Bad request","details":["Field is required","Invalid format"]}\'',
      };
      const result = extractQueryErrorMessageDetails(error);
      expect(result.message).toBe('Bad request');
      expect(result.details).toBe('Field is required, Invalid format');
    });

    it('should extract message and details with double quotes', () => {
      const error = {
        message: 'Error response: "{"message":"Not found","details":"Resource does not exist"}"',
      };
      const result = extractQueryErrorMessageDetails(error);
      expect(result.message).toBe('Not found');
      expect(result.details).toBe('Resource does not exist');
    });

    it('should handle error message as object', () => {
      const error = {
        message: {
          message: 'Server error',
          details: ['Connection timeout', 'Retry failed'],
        },
      };
      const result = extractQueryErrorMessageDetails(error);
      expect(result.message).toBe('Server error');
      expect(result.details).toBe('Connection timeout, Retry failed');
    });

    it('should handle error message as object with string details', () => {
      const error = {
        message: {
          message: 'Validation error',
          details: 'Invalid input',
        },
      };
      const result = extractQueryErrorMessageDetails(error);
      expect(result.message).toBe('Validation error');
      expect(result.details).toBe('Invalid input');
    });

    it('should return original message when no JSON found', () => {
      const error = {
        message: 'Simple error message',
      };
      const result = extractQueryErrorMessageDetails(error);
      expect(result.message).toBe('Simple error message');
      expect(result.details).toBeUndefined();
    });

    it('should handle invalid JSON gracefully', () => {
      const error = {
        message: 'Error response: \'{"message":"Bad request", invalid json}\'',
      };
      const result = extractQueryErrorMessageDetails(error);
      expect(result.message).toBe('Error response: \'{"message":"Bad request", invalid json}\'');
    });

    it('should return "Unknown error" for undefined or null error', () => {
      expect(extractQueryErrorMessageDetails(null).message).toBe('Unknown error');
      expect(extractQueryErrorMessageDetails(undefined).message).toBe('Unknown error');
      expect(extractQueryErrorMessageDetails({}).message).toBe('Unknown error');
    });
  });
});
