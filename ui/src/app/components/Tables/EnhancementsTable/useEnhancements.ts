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

import { useCallback, useState } from 'react';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { DefaultSbomerApi } from '@app/api/DefaultSbomerApi';
import { SbomerEnhancementPayload } from '@app/types';
import { ApiPaginatedResponse } from '@app/api/types';

export function useEnhancements(initialPage: number, initialPageSize: number) {
  const sbomerApi = DefaultSbomerApi.getInstance();
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(initialPage || 0);
  const [pageSize, setPageSize] = useState(initialPageSize || 10);

  const getEnhancements = useCallback(
    async ({ pageSize, pageIndex }: { pageSize: number; pageIndex: number }) => {
      try {
        const response = await fetch(
          `${sbomerApi.getBaseUrl()}/api/v1/enhancements?pageSize=${pageSize}&pageIndex=${pageIndex}`,
        );

        if (response.status !== 200) {
          const body = await response.text();
          throw new Error(
            'Failed fetching enhancements from SBOMer, got: ' +
              response.status +
              " response: '" +
              body +
              "'",
          );
        }

        const data: ApiPaginatedResponse<SbomerEnhancementPayload> = await response.json();
        const enhancements: SbomerEnhancementPayload[] = [];

        // Helper function to safely parse dates
        const parseDate = (dateValue: string | Date | null | undefined): Date | undefined => {
          if (!dateValue) return undefined;
          if (dateValue instanceof Date) return dateValue;
          try {
            const parsed = new Date(dateValue);
            return isNaN(parsed.getTime()) ? undefined : parsed;
          } catch {
            return undefined;
          }
        };

        if (data.content) {
          data.content.forEach((enhancement) => {
            enhancements.push({
              ...enhancement,
              created: parseDate(enhancement.created) as unknown as string,
              updated: enhancement.updated
                ? (parseDate(enhancement.updated) as unknown as string)
                : undefined,
              finished: enhancement.finished
                ? (parseDate(enhancement.finished) as unknown as string)
                : undefined,
            });
          });
        }

        return { data: enhancements, total: data.totalHits };
      } catch (error) {
        return Promise.reject(error);
      }
    },
    [sbomerApi],
  );

  const { loading, value, error, retry } = useAsyncRetry(
    () =>
      getEnhancements({
        pageSize: pageSize,
        pageIndex: pageIndex,
      }).then((data) => {
        setTotal(data.total);
        return data.data;
      }),
    [getEnhancements, pageIndex, pageSize],
  );

  return [
    {
      pageIndex,
      pageSize,
      total,
      value,
      loading,
      error,
    },
    {
      setPageIndex,
      setPageSize,
      retry,
    },
  ] as const;
}
