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

/**
 * Generic paginated API response structure
 */
export interface ApiPaginatedResponse<T> {
  content: T[];
  totalHits: number;
  pageSize?: number;
  pageIndex?: number;
}

/**
 * Generation API payload structure
 */
export interface GenerationApiPayload {
  id: string;
  identifier: string;
  status: string;
  creationTime: string;
  type: string;
  result?: string;
  reason?: string;
  enhancements?: EnhancementApiPayload[];
  [key: string]: unknown;
}

/**
 * Event/Request API payload structure
 */
export interface EventApiPayload {
  id: string;
  eventId: string;
  receiveTime: string;
  status?: string;
  reason?: string;
  [key: string]: unknown;
}

/**
 * Enhancement API payload structure
 */
export interface EnhancementApiPayload {
  id: string;
  identifier: string;
  status: string;
  creationTime: string;
  type: string;
  result?: string;
  reason?: string;
  [key: string]: unknown;
}

/**
 * Generation Run API payload structure
 */
export interface GenerationRunApiPayload {
  id: string;
  status: string;
  creationTime?: string;
  startTime?: string;
  endTime?: string;
  result?: string;
  reason?: string;
  [key: string]: unknown;
}

/**
 * Enhancement Run API payload structure
 */
export interface EnhancementRunApiPayload {
  id: string;
  status: string;
  creationTime?: string;
  startTime?: string;
  endTime?: string;
  result?: string;
  reason?: string;
  [key: string]: unknown;
}

/**
 * Publisher API payload structure
 */
export interface PublisherApiPayload {
  id: string;
  identifier: string;
  status: string;
  type: string;
  [key: string]: unknown;
}

/**
 * Stats API payload structure
 */
export interface StatsApiPayload {
  version: string;
  uptime: string;
  uptimeMillis: number;
  generationRecords?: GenerationApiPayload[];
  publisherRecords?: PublisherApiPayload[];
  [key: string]: unknown;
}
