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

/** @public */
export type SbomerErrorResponse = {
  errorId: string;
  error: string;
  resource: string;
  message: string;
};

declare global {
  interface Window {
    _env_?: {
      API_URL?: string;
    };
  }
}

/** @public */
export type SbomerStats = {
  version: string;
  uptime: string;
  uptimeMillis: number;
  messaging: {
    pncConsumer: {
      received: number;
      processed: number;
      skipped: number;
    };
    errataConsumer: {
      received: number;
      processed: number;
      skipped: number;
    };
    producer: {
      nacked: number;
      acked: number;
    };
  };
  resources: {
    generations: {
      total: number;
      inProgress: number;
    };
    manifests: {
      total: number;
    };
  };
};

export class SbomerGeneration {
  public id: string;
  public generatorName: string;
  public generatorVersion: string;
  public created: Date;
  public updated?: Date;
  public finished?: Date;
  public status: string;
  public result: string;
  public reason: string;
  public requestId: string;
  public targetType: string;
  public targetIdentifier: string;

  // todo
  // generationSBomUrls
  // enhancements
  public metadata?: Map<string, string>;

  constructor(payload: any) {
    this.id = payload.id;
    this.status = payload.status;
    this.result = payload.result;
    this.reason = payload.reason;

    this.created = new Date(payload.created);
    this.updated = payload.updated ? new Date(payload.updated) : undefined;
    this.finished = payload.finished ? new Date(payload.finished) : undefined;

    this.requestId = payload.requestId;
    this.metadata = payload.metadata ? new Map(Object.entries(payload.metadata)) : undefined;
    this.generatorName = payload.generatorName;
    this.generatorVersion = payload.generatorVersion;
    this.requestId = payload.requestId;
    this.targetType = payload.targetType;
    this.targetIdentifier = payload.targetIdentifier;
  }
}

export class SbomerEnhancement {
  public id: string;
  public status: string;
  public created: Date;
  public updated?: Date;
  public finished?: Date;
  public result?: string;
  public reason?: string;
  public generationId?: string;
  public requestId?: string;
  public enhancerName?: string;
  public enhancerVersion?: string;

  constructor(payload: any) {
    this.id = payload.id;
    this.status = payload.status;

    this.created = new Date(payload.created);
    this.updated = payload.updated ? new Date(payload.updated) : undefined;
    this.finished = payload.finished ? new Date(payload.finished) : undefined;

    this.result = payload.result;
    this.reason = payload.reason;
    this.generationId = payload.generationId;
    this.requestId = payload.requestId;
    this.enhancerName = payload.enhancerName;
    this.enhancerVersion = payload.enhancerVersion;
  }
}

export class SbomerManifest {
  public id: string;
  public created: Date;
  public metadata?: Map<string, string>;

  constructor(payload: any) {
    this.id = payload.id;
    this.created = new Date(payload.created);
    this.metadata = payload.metadata ? new Map(Object.entries(payload.metadata)) : undefined;
  }
}

export class SbomerEvent {
  public id: string;
  public created: Date;
  public status: string;

  constructor(payload: any) {
    this.id = payload.id;
    this.created = new Date(payload.creationDate);
    this.status = payload.status;
  }
}

export type GenerateParams = {
  config: string;
};

export type SbomerApi = {
  getBaseUrl(): string;
  stats(): Promise<SbomerStats>;
  getLogPaths(_generationId: string): Promise<Array<string>>;

  getGenerations(_pagination: {
    pageSize: number;
    pageIndex: number;
  }): Promise<{ data: SbomerGeneration[]; total: number }>;

  getGeneration(_id: string): Promise<SbomerGeneration>;

  getEvents(
    _pagination: {
      pageSize: number;
      pageIndex: number;
    },
    _query: string,
  ): Promise<{ data: SbomerEvent[]; total: number }>;

  getEvent(_id: string): Promise<SbomerEvent>;

  getEventGenerations(_id: string): Promise<{ data: SbomerGeneration[]; total: number }>;
};
