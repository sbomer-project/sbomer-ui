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

import { SbomerErrorResponse, SbomerGeneration } from '@app/types';

type CarbonTagType =
  | 'red'
  | 'green'
  | 'blue'
  | 'gray'
  | 'magenta'
  | 'purple'
  | 'cyan'
  | 'teal'
  | 'cool-gray'
  | 'warm-gray'
  | 'high-contrast'
  | 'outline';

const GenerationStatuses = new Map<string, { description?: string; color: CarbonTagType }>([
  ['PENDING', { description: 'Pending', color: 'teal' }],
  ['GENERATING', { description: 'Generation in progress', color: 'blue' }],
  ['COMPLETED', { description: 'Successfully completed', color: 'green' }],
  ['FAILED', { description: 'Failed generation', color: 'red' }],
]);

const GenerationResults = new Map<string, { description?: string; color: CarbonTagType }>([
  ['ERR_CONFIG_MISSING', { description: 'Missing configuration', color: 'red' }],
  ['ERR_GENERAL', { description: 'General error', color: 'red' }],
  ['ERR_CONFIG_INVALID', { description: 'Invalid configuration', color: 'red' }],
  ['ERR_INDEX_INVALID', { description: 'Invalid product index', color: 'red' }],
  ['ERR_GENERATION', { description: 'Generation failure', color: 'red' }],
  ['ERR_SYSTEM', { description: 'System error', color: 'red' }],
  ['ERR_MULTI', { description: 'Multiple errors', color: 'red' }],
  ['SUCCESS', { description: 'Success', color: 'green' }],
]);

const EventStatuses = new Map<string, { description?: string; color: CarbonTagType }>([
  ['PENDING', { description: 'Pending', color: 'teal' }],
  ['PROCESSING', { description: 'Processing generations under this event', color: 'blue' }],
  ['COMPLETED', { description: 'Successfully completed', color: 'green' }],
  ['FAILED', { description: 'Failed generations under this event', color: 'red' }],
]);

const EnhancementStatuses = new Map<string, { description?: string; color: CarbonTagType }>([
  ['PENDING', { description: 'Pending', color: 'teal' }],
  ['ENHANCING', { description: 'Enhancing in progress', color: 'blue' }],
  ['COMPLETED', { description: 'Successfully completed enhancement', color: 'green' }],
  ['FAILED', { description: 'Failed enhancement', color: 'red' }],
]);

const RunStates = new Map<string, { description?: string; color: CarbonTagType }>([
  ['PENDING', { description: 'Pending', color: 'gray' }],
  ['RUNNING', { description: 'Running', color: 'blue' }],
  ['SUCCEEDED', { description: 'Succeeded', color: 'green' }],
  ['FAILED', { description: 'Failed', color: 'red' }],
]);

const RunErrorResults = new Map<string, { description?: string; color: CarbonTagType }>([
  ['SUCCESS', { description: 'Success', color: 'green' }],
  ['ERR_GENERAL', { description: 'General error', color: 'red' }],
  ['ERR_CONFIG_INVALID', { description: 'Invalid configuration', color: 'red' }],
  ['ERR_CONFIG_MISSING', { description: 'Missing configuration', color: 'red' }],
  ['ERR_INDEX_INVALID', { description: 'Invalid product index', color: 'red' }],
  ['ERR_GENERATION', { description: 'Generation failure', color: 'red' }],
  ['ERR_POST', { description: 'Post-processing error', color: 'red' }],
  ['ERR_OOM', { description: 'Out of memory', color: 'red' }],
  ['ERR_SYSTEM', { description: 'System error', color: 'red' }],
  ['ERR_MULTI', { description: 'Multiple errors', color: 'red' }],
  ['ERR_ENHANCEMENT', { description: 'Enhancement failure', color: 'red' }],
]);

/**
 * @param millis Converts timestamp in milliseconds to relative time in human readable format.
 * @param seconds Decides whether seconds should be displayed.
 * @returns A human readable time.
 */
export function timestampToHumanReadable(millis: number, seconds?: false, suffix?: string): string {
  const secs = millis / 1000;
  const d = Math.floor(secs / 3600 / 24);
  const h = Math.floor((secs - d * 3600 * 24) / 3600);
  const m = Math.floor((secs % 3600) / 60);

  if (secs < 60) {
    return 'just now';
  }

  let hrd = '';

  if (d > 3) {
    hrd = d + (d === 1 ? ' day' : ' days');
  } else if (d >= 1) {
    const dDisplay = d + (d === 1 ? ' day' : ' days');
    const hDisplay = h > 0 ? ' ' + h + (h === 1 ? ' hour' : ' hours') : '';
    hrd = dDisplay + hDisplay;
  } else {
    const hDisplay = h > 0 ? h + (h === 1 ? ' hour' : ' hours') : '';
    const mDisplay = m > 0 ? (h > 0 ? ' ' : '') + m + (m === 1 ? ' minute' : ' minutes') : '';
    hrd = hDisplay + mDisplay;

    if (!hDisplay && !mDisplay) {
      return 'just now';
    }
  }

  if (seconds) {
    hrd += seconds;
  }

  if (suffix) {
    hrd += ' ' + suffix;
  }

  return hrd;
}

export function statusToDescription(request: SbomerGeneration): string {
  const resolved = GenerationStatuses.get(request.status);

  return resolved?.description ?? request.status;
}

export function eventStatusToDescription(eventStatus: string): string {
  const resolved = EventStatuses.get(eventStatus);

  return resolved?.description ?? eventStatus;
}

export function resultToDescription(result?: string): string {
  if (!result) {
    return 'N/A';
  }

  const resolved = GenerationResults.get(result);

  return resolved?.description ?? result;
}

export function generationStatusToColor(status: string): CarbonTagType {
  const resolved = GenerationStatuses.get(status);

  return resolved?.color ?? 'gray';
}

export function eventStatusToColor(status: string): CarbonTagType {
  const resolved = EventStatuses.get(status);

  return resolved?.color ?? 'gray';
}

export function enhancementStatusToColor(status: string): CarbonTagType {
  const resolved = EnhancementStatuses.get(status);

  return resolved?.color ?? 'gray';
}

export function resultToColor(result: string): CarbonTagType {
  const resolved = GenerationResults.get(result);

  return resolved?.color ?? 'warm-gray';
}

export function targetTypeToColor(targetType: string): CarbonTagType {
  const colors: CarbonTagType[] = [
    'blue',
    'cyan',
    'teal',
    'magenta',
    'high-contrast',
    'purple',
    'outline',
  ];

  if (!targetType) {
    return 'outline';
  }

  let hash = 0;
  for (let i = 0; i < targetType.length; i++) {
    hash += targetType.charCodeAt(i);
  }

  return colors[hash % colors.length] ?? 'outline';
}

export function isInProgress(status: string): boolean {
  if (status === 'COMPLETED' || status === 'FAILED') {
    return false;
  }

  return true;
}

export function isSuccess(status: string): boolean {
  return status === 'COMPLETED';
}

function isSbomerErrorResponse(value: unknown): value is SbomerErrorResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    'result' in candidate ||
    'reason' in candidate ||
    'status' in candidate ||
    'category' in candidate ||
    'correlationId' in candidate ||
    'timestamp' in candidate
  );
}

export function extractQueryErrorMessageDetails(error: unknown): {
  message: string;
  details?: string;
} {
  // Type guard to check if error has a message property
  if (!error || typeof error !== 'object') {
    return { message: 'Unknown error' };
  }

  const errorObj = error as { message?: unknown };

  if (isSbomerErrorResponse(errorObj.message)) {
    return {
      message: errorObj.message.reason || errorObj.message.result || 'Unknown error',
      details: errorObj.message.category,
    };
  }

  if (typeof errorObj.message === 'string') {
    const jsonMatch = errorObj.message.match(/\{.*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (isSbomerErrorResponse(parsed)) {
          const detailParts = [parsed.category, parsed.correlationId].filter(Boolean);
          return {
            message: parsed.reason || parsed.result || errorObj.message,
            details: detailParts.length > 0 ? detailParts.join(', ') : undefined,
          };
        }
      } catch {
        // Ignore parse failure and fall back to raw message.
      }
    }

    return { message: errorObj.message };
  }

  return { message: 'Unknown error' };
}

export function runStateToColor(state: string): CarbonTagType {
  const resolved = RunStates.get(state);
  return resolved?.color ?? 'gray';
}

export function runReasonToColor(errorResult?: string): CarbonTagType {
  if (!errorResult) {
    return 'warm-gray';
  }

  const resolved = RunErrorResults.get(errorResult);
  return resolved?.color ?? 'warm-gray';
}

export function runReasonToDescription(errorResult?: string): string {
  if (!errorResult) {
    return 'N/A';
  }

  const resolved = RunErrorResults.get(errorResult);
  return resolved?.description ?? errorResult;
}

/**
 * Calculate duration between two timestamps
 * @param startTime Start timestamp
 * @param completionTime Completion timestamp (optional)
 * @returns Human-readable duration string (e.g., "2 hours", "3 days 5 hours")
 */
export function calculateDuration(startTime: Date, completionTime?: Date): string {
  if (!completionTime) {
    return 'In progress';
  }

  const durationMs = completionTime.getTime() - startTime.getTime();

  if (durationMs < 0) {
    return 'N/A';
  }

  return formatDuration(durationMs);
}

/**
 * Formats a duration in milliseconds to a human-readable string.
 * Used for displaying how long something took (e.g., "2 hours 30 minutes").
 * Always shows exact duration with all relevant time components.
 * @param millis Duration in milliseconds
 * @returns A human-readable duration string (e.g., "2h 30m", "3d 5h 20m", "45m")
 */
export function formatDuration(millis: number): string {
  const totalSeconds = Math.floor(millis / 1000);

  if (totalSeconds < 1) {
    return 'less than a second';
  }

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0 && days === 0 && hours === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.length > 0 ? parts.join(' ') : 'less than a second';
}
