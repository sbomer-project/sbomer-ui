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
import { SbomerEnhancement } from '@app/types';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';

export function useEnhancement(id: string) {
  const sbomerApi = DefaultSbomerApi.getInstance();

  const getEnhancement = async (id: string) => {
    try {
      const response = await fetch(`${sbomerApi.getBaseUrl()}/api/v1/enhancements/${id}`);

      if (response.status !== 200) {
        const body = await response.text();
        throw new Error(
          'Failed fetching enhancement from SBOMer, got: ' +
            response.status +
            " response: '" +
            body +
            "'",
        );
      }

      const data = await response.json();
      return new SbomerEnhancement(data);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const { loading, value, error, retry } = useAsyncRetry(() => getEnhancement(id), [id]);

  return [
    {
      request: value,
      loading,
      error,
    },
    {
      retry,
    },
  ] as const;
}
