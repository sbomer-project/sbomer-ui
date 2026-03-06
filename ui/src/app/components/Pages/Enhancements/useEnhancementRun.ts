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

import { DefaultSbomerApi } from '@app/api/DefaultSbomerApi';
import { EnhancementRunRecord } from '@app/types';
import { useCallback } from 'react';
import { useAsyncRetry } from 'react-use';

export function useEnhancementRun(enhancementId: string, runId: string) {
  const sbomerApi = DefaultSbomerApi.getInstance();

  const getEnhancementRun = useCallback(
    async (enhId: string, rId: string): Promise<EnhancementRunRecord> => {
      try {
        return await sbomerApi.getEnhancementRun(enhId, rId);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    [sbomerApi],
  );

  const { loading, value, error, retry } = useAsyncRetry(
    () => getEnhancementRun(enhancementId, runId),
    [getEnhancementRun, enhancementId, runId],
  );

  return [
    {
      run: value,
      loading,
      error,
    },
    {
      retry,
    },
  ] as const;
}

