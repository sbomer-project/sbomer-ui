import { DefaultSbomerApi } from '@app/api/DefaultSbomerApi';
import { useAsyncRetry } from 'react-use';

export function useGenerationEnhancements(generationId: string) {
  const sbomerApi = DefaultSbomerApi.getInstance();

  const getGenerationEnhancements = async (generationId: string) => {
    try {
      const response = await fetch(
        `${sbomerApi.getBaseUrl()}/api/v1/enhancements/generation/${generationId}`,
      );

      if (response.status !== 200) {
        const body = await response.text();
        throw new Error(
          'Failed fetching enhancements for generation ' +
            generationId +
            ', got: ' +
            response.status +
            " response: '" +
            body +
            "'",
        );
      }

      const data = await response.json();

      let enhancements: any[] = [];

      if (Array.isArray(data)) {
        enhancements = data;
      } else if (data.content && Array.isArray(data.content)) {
        enhancements = data.content;
      } else if (data.data && Array.isArray(data.data)) {
        enhancements = data.data;
      }

      return { data: enhancements, total: data.totalHits || data.total || enhancements.length };
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const { loading, value, error } = useAsyncRetry(
    () =>
      getGenerationEnhancements(generationId).then((data) => {
        return data;
      }),
    [generationId],
  );

  return [
    {
      value,
      loading,
      error,
    },
  ] as const;
}
