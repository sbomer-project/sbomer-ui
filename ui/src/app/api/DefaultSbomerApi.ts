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

import axios, { Axios, AxiosError } from 'axios';
import {
  EnhancementRunRecord,
  GenerationRunRecord,
  SbomerApi,
  SbomerErrorResponse,
  SbomerEvent,
  SbomerGeneration,
  SbomerStats,
} from '../types';

type Options = {
  baseUrl: string;
};

function isSbomerErrorResponse(payload: unknown): payload is SbomerErrorResponse {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const candidate = payload as Record<string, unknown>;

  return (
    'result' in candidate ||
    'reason' in candidate ||
    'status' in candidate ||
    'category' in candidate ||
    'correlationId' in candidate ||
    'timestamp' in candidate
  );
}

function formatSbomerErrorMessage(
  context: string,
  status?: number,
  payload?: SbomerErrorResponse,
  fallbackBody?: string,
): string {
  const details = [
    payload?.result,
    payload?.reason,
    payload?.category,
    payload?.correlationId ? `correlationId=${payload.correlationId}` : undefined,
    payload?.timestamp ? `timestamp=${payload.timestamp}` : undefined,
  ].filter(Boolean);

  if (details.length > 0) {
    return `${context}${status ? ` (${status})` : ''}: ${details.join(' | ')}`;
  }

  if (fallbackBody && fallbackBody.trim().length > 0) {
    return `${context}${status ? ` (${status})` : ''}: ${fallbackBody}`;
  }

  return `${context}${status ? ` (${status})` : ''}`;
}

async function parseFetchError(response: Response, context: string): Promise<Error> {
  const rawBody = await response.text();

  if (rawBody) {
    try {
      const parsed = JSON.parse(rawBody);
      if (isSbomerErrorResponse(parsed)) {
        return new Error(
          formatSbomerErrorMessage(context, response.status, {
            ...parsed,
            status: parsed.status ?? response.status,
          }),
        );
      }
    } catch {
      // Fall back to raw text.
    }
  }

  return new Error(formatSbomerErrorMessage(context, response.status, undefined, rawBody));
}

function parseAxiosError(error: AxiosError, context: string): Error {
  const responseStatus = error.response?.status;
  const responseData = error.response?.data;

  if (isSbomerErrorResponse(responseData)) {
    return new Error(
      formatSbomerErrorMessage(context, responseStatus, {
        ...responseData,
        status: responseData.status ?? responseStatus,
      }),
    );
  }

  if (typeof responseData === 'string') {
    return new Error(formatSbomerErrorMessage(context, responseStatus, undefined, responseData));
  }

  if (error.message) {
    return new Error(`${context}${responseStatus ? ` (${responseStatus})` : ''}: ${error.message}`);
  }

  return new Error(formatSbomerErrorMessage(context, responseStatus));
}

export class DefaultSbomerApi implements SbomerApi {
  private readonly baseUrl: string;

  private client: Axios;
  private static _instance: DefaultSbomerApi;

  public static getInstance(): SbomerApi {
    if (!DefaultSbomerApi._instance) {
      const sbomerUrl: string = window._env_?.API_URL || 'http://localhost:3000';

      DefaultSbomerApi._instance = new DefaultSbomerApi({ baseUrl: sbomerUrl });
    }

    return DefaultSbomerApi._instance;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  constructor(options: Options) {
    this.baseUrl = options.baseUrl;
    this.client = axios.create({
      baseURL: options.baseUrl,
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );
  }

  async getLogPaths(generationId: string): Promise<Array<string>> {
    try {
      const response = await this.client.get(`/api/v1/generations/${generationId}/logs`);
      return response.data as Array<string>;
    } catch (error) {
      throw parseAxiosError(
        error as AxiosError,
        `Failed to retrieve log paths for generation ${generationId}`,
      );
    }
  }

  async stats(): Promise<SbomerStats> {
    const response = await fetch(`${this.baseUrl}/api/v1/stats`);

    if (response.status !== 200) {
      throw await parseFetchError(response, 'Failed fetching SBOMer statistics');
    }

    return (await response.json()) as SbomerStats;
  }

  async getGenerations(pagination: {
    pageSize: number;
    pageIndex: number;
  }): Promise<{ data: SbomerGeneration[]; total: number }> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/generations?pageSize=${pagination.pageSize}&pageIndex=${pagination.pageIndex}`,
    );

    if (response.status !== 200) {
      throw await parseFetchError(response, 'Failed fetching generations from SBOMer');
    }

    const data = await response.json();

    const requests: SbomerGeneration[] = [];

    if (data.content) {
      data.content.forEach((request: any) => {
        requests.push(new SbomerGeneration(request));
      });
    }

    return { data: requests, total: data.totalHits };
  }

  async getGeneration(id: string): Promise<SbomerGeneration> {
    try {
      const response = await this.client.get(`/api/v1/generations/${id}`);
      return new SbomerGeneration(response.data);
    } catch (error) {
      throw parseAxiosError(error as AxiosError, `Failed fetching generation ${id}`);
    }
  }

  async getEvents(
    pagination: {
      pageSize: number;
      pageIndex: number;
    },
    query: string,
  ): Promise<{ data: SbomerEvent[]; total: number }> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/requests/?pageSize=${pagination.pageSize}&pageIndex=${pagination.pageIndex}&query=${encodeURIComponent(query)}`,
    );

    if (response.status !== 200) {
      throw await parseFetchError(response, 'Failed fetching events from SBOMer');
    }

    const data = await response.json();
    const requests: SbomerEvent[] = [];

    if (data.content) {
      data.content.forEach((request: any) => {
        requests.push(new SbomerEvent(request));
      });
      return { data: requests, total: data.totalHits };
    }

    return { data: requests, total: requests.length || 0 };
  }

  async getEvent(id: string): Promise<SbomerEvent> {
    try {
      const response = await this.client.get(`/api/v1/requests/${id}`);
      return new SbomerEvent(response.data);
    } catch (error) {
      throw parseAxiosError(error as AxiosError, `Failed fetching event ${id}`);
    }
  }

  async getAllGenerationsForEvent(
    id: string,
  ): Promise<{ data: SbomerGeneration[]; total: number }> {
    const requests: SbomerGeneration[] = [];
    const response = await fetch(`${this.baseUrl}/api/v1/requests/${id}/generations/all`);

    if (response.status !== 200) {
      throw await parseFetchError(response, 'Failed fetching generations from SBOMer');
    }

    const data = await response.json();

    if (data) {
      data.forEach((request: any) => {
        requests.push(new SbomerGeneration(request));
      });
    }

    return { data: requests, total: requests.length };
  }

  async getGenerationRuns(generationId: string): Promise<GenerationRunRecord[]> {
    try {
      const response = await this.client.get(`/api/v1/generations/${generationId}/runs`);

      const runs: GenerationRunRecord[] = [];
      if (Array.isArray(response.data)) {
        response.data.forEach((run: any) => {
          runs.push(new GenerationRunRecord(run));
        });
      }

      return runs;
    } catch (error) {
      throw parseAxiosError(
        error as AxiosError,
        `Failed to retrieve runs for generation ${generationId}`,
      );
    }
  }

  async getGenerationRun(generationId: string, runId: string): Promise<GenerationRunRecord> {
    try {
      const response = await this.client.get(`/api/v1/generations/${generationId}/runs/${runId}`);
      return new GenerationRunRecord(response.data);
    } catch (error) {
      throw parseAxiosError(
        error as AxiosError,
        `Failed to retrieve run ${runId} for generation ${generationId}`,
      );
    }
  }

  async getEnhancementRuns(enhancementId: string): Promise<EnhancementRunRecord[]> {
    try {
      const response = await this.client.get(`/api/v1/enhancements/${enhancementId}/runs`);

      const runs: EnhancementRunRecord[] = [];
      if (Array.isArray(response.data)) {
        response.data.forEach((run: any) => {
          runs.push(new EnhancementRunRecord(run));
        });
      }

      return runs;
    } catch (error) {
      throw parseAxiosError(
        error as AxiosError,
        `Failed to retrieve runs for enhancement ${enhancementId}`,
      );
    }
  }

  async getEnhancementRun(enhancementId: string, runId: string): Promise<EnhancementRunRecord> {
    try {
      const response = await this.client.get(`/api/v1/enhancements/${enhancementId}/runs/${runId}`);
      return new EnhancementRunRecord(response.data);
    } catch (error) {
      throw parseAxiosError(
        error as AxiosError,
        `Failed to retrieve run ${runId} for enhancement ${enhancementId}`,
      );
    }
  }
}