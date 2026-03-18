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
  calculateDuration,
  enhancementStatusToColor,
  eventStatusToColor,
  eventStatusToDescription,
  extractQueryErrorMessageDetails,
  formatDuration,
  generationStatusToColor,
  isInProgress,
  isSuccess,
  resultToColor,
  resultToDescription,
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
      expect(statusToDescription({ status: 'FAILED' } as SbomerGeneration)).toBe(
        'Failed generation',
      );
      expect(statusToDescription({ status: 'GENERATING' } as SbomerGeneration)).toBe(
        'Generation in progress',
      );
      expect(statusToDescription({ status: 'COMPLETED' } as SbomerGeneration)).toBe(
        'Successfully completed',
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
      expect(eventStatusToDescription('FAILED')).toBe('Failed generations under this event');
      expect(eventStatusToDescription('FINISHED')).toBe(
        'Successfully finished all generations under this event',
      );
      expect(eventStatusToDescription('PENDING')).toBe('Pending');
    });

    it('should return original status for unknown event statuses', () => {
      expect(eventStatusToDescription('UNKNOWN_EVENT_STATUS')).toBe('UNKNOWN_EVENT_STATUS');
    });
  });

  describe('resultToDescription', () => {
    it('should return "N/A" when result is null', () => {
      expect(resultToDescription({ result: null } as unknown as SbomerGeneration)).toBe('N/A');
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

  describe('generationStatusToColor', () => {
    it('should return correct colors for known generation statuses', () => {
      expect(generationStatusToColor('FAILED')).toBe('red');
      expect(generationStatusToColor('GENERATING')).toBe('blue');
      expect(generationStatusToColor('COMPLETED')).toBe('green');
    });

    it('should return "gray" for unknown generation statuses', () => {
      expect(generationStatusToColor('UNKNOWN_STATUS')).toBe('gray');
    });
  });

  describe('enhancementStatusToColor', () => {
    it('should return correct colors for known enhancement statuses', () => {
      expect(enhancementStatusToColor('PENDING')).toBe('teal');
      expect(enhancementStatusToColor('FAILED')).toBe('red');
      expect(enhancementStatusToColor('ENHANCING')).toBe('blue');
      expect(enhancementStatusToColor('COMPLETED')).toBe('green');
    });

    it('should return "gray" for unknown enhancement statuses', () => {
      expect(enhancementStatusToColor('UNKNOWN_STATUS')).toBe('gray');
    });
  });

  describe('eventStatusToColor', () => {
    it('should return correct colors for known event statuses', () => {
      expect(eventStatusToColor('FAILED')).toBe('red');
      expect(eventStatusToColor('FINISHED')).toBe('green');
      expect(eventStatusToColor('PENDING')).toBe('teal');
      expect(eventStatusToColor('PROCESSING')).toBe('blue');
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

  describe('formatDuration', () => {
    it('should return "less than a second" for durations under 1 second', () => {
      expect(formatDuration(0)).toBe('less than a second');
      expect(formatDuration(500)).toBe('less than a second');
      expect(formatDuration(999)).toBe('less than a second');
    });

    it('should format seconds only for durations under 1 minute', () => {
      expect(formatDuration(1000)).toBe('1s');
      expect(formatDuration(30000)).toBe('30s');
      expect(formatDuration(59000)).toBe('59s');
    });

    it('should format minutes and seconds for durations under 1 hour', () => {
      expect(formatDuration(60000)).toBe('1m');
      expect(formatDuration(90000)).toBe('1m 30s');
      expect(formatDuration(120000)).toBe('2m');
      expect(formatDuration(3540000)).toBe('59m');
    });

    it('should format hours and minutes for durations under 1 day (no seconds)', () => {
      expect(formatDuration(3600000)).toBe('1h');
      expect(formatDuration(3660000)).toBe('1h 1m');
      expect(formatDuration(7200000)).toBe('2h');
      expect(formatDuration(7320000)).toBe('2h 2m');
      expect(formatDuration(86340000)).toBe('23h 59m');
    });

    it('should format days, hours, and minutes for durations over 1 day (no seconds)', () => {
      expect(formatDuration(86400000)).toBe('1d');
      expect(formatDuration(90000000)).toBe('1d 1h');
      expect(formatDuration(90060000)).toBe('1d 1h 1m');
      expect(formatDuration(172800000)).toBe('2d');
      expect(formatDuration(259200000)).toBe('3d');
      expect(formatDuration(345600000)).toBe('4d');
    });

    it('should handle exact time boundaries', () => {
      expect(formatDuration(1000)).toBe('1s');
      expect(formatDuration(60000)).toBe('1m');
      expect(formatDuration(3600000)).toBe('1h');
      expect(formatDuration(86400000)).toBe('1d');
    });
  });

  describe('calculateDuration', () => {
    it('should return "In progress" when completionTime is not provided', () => {
      const startTime = new Date('2024-01-01T10:00:00Z');
      expect(calculateDuration(startTime)).toBe('In progress');
      expect(calculateDuration(startTime, undefined)).toBe('In progress');
    });

    it('should return "N/A" when completionTime is before startTime', () => {
      const startTime = new Date('2024-01-01T10:00:00Z');
      const completionTime = new Date('2024-01-01T09:00:00Z');
      expect(calculateDuration(startTime, completionTime)).toBe('N/A');
    });

    it('should calculate duration correctly for various time spans', () => {
      const startTime = new Date('2024-01-01T10:00:00Z');

      // 30 seconds
      let completionTime = new Date('2024-01-01T10:00:30Z');
      expect(calculateDuration(startTime, completionTime)).toBe('30s');

      // 5 minutes
      completionTime = new Date('2024-01-01T10:05:00Z');
      expect(calculateDuration(startTime, completionTime)).toBe('5m');

      // 2 hours 30 minutes
      completionTime = new Date('2024-01-01T12:30:00Z');
      expect(calculateDuration(startTime, completionTime)).toBe('2h 30m');

      // 1 day 3 hours
      completionTime = new Date('2024-01-02T13:00:00Z');
      expect(calculateDuration(startTime, completionTime)).toBe('1d 3h');

      // 5 days 2 hours 15 minutes
      completionTime = new Date('2024-01-06T12:15:00Z');
      expect(calculateDuration(startTime, completionTime)).toBe('5d 2h 15m');
    });

    it('should handle same start and completion time', () => {
      const startTime = new Date('2024-01-01T10:00:00Z');
      const completionTime = new Date('2024-01-01T10:00:00Z');
      expect(calculateDuration(startTime, completionTime)).toBe('less than a second');
    });
  });
});
