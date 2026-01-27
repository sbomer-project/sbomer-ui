import { ErrorSection } from '@app/components/Sections/ErrorSection/ErrorSection';
import RelativeTimestamp from '@app/components/UtilsComponents/RelativeTimestamp';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { resultToColor, statusToColor } from '@app/utils/Utils';
import {
  CodeSnippet,
  Heading,
  SkeletonText,
  Stack,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
  Tag,
} from '@carbon/react';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEnhancement } from './useEnhancement';

const EnhancementPageContent: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [{ request, error, loading }] = useEnhancement(id!);

  useDocumentTitle('SBOMer | Enhancements | ' + id);

  if (error) {
    return <ErrorSection title="Could not load enhancement" message={error.message} />;
  }

  if (loading) {
    return <SkeletonText />;
  }

  if (!request) {
    return null;
  }

  return (
    <Stack gap={7}>
      <Heading>Enhancement {id}</Heading>
      <StructuredListWrapper isCondensed>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Property</StructuredListCell>
            <StructuredListCell head>Value</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          <StructuredListRow>
            <StructuredListCell>ID</StructuredListCell>
            <StructuredListCell>
              <span>{request.id}</span>
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Created</StructuredListCell>
            <StructuredListCell>
              {request.created ? (
                <Stack gap={2}>
                  <RelativeTimestamp date={request.created} />
                  <span>{request.created.toISOString()}</span>
                </Stack>
              ) : (
                'N/A'
              )}
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Updated</StructuredListCell>
            <StructuredListCell>
              {request.updated ? (
                <Stack gap={2}>
                  <RelativeTimestamp date={request.updated} />
                  <span>{request.updated.toISOString()}</span>
                </Stack>
              ) : (
                'N/A'
              )}
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Finished</StructuredListCell>
            <StructuredListCell>
              {request.finished ? (
                <Stack gap={2}>
                  <RelativeTimestamp date={request.finished} />
                  <span>{request.finished.toISOString()}</span>
                </Stack>
              ) : (
                'N/A'
              )}
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Status</StructuredListCell>
            <StructuredListCell>
              <Tag size="md" type={statusToColor(request.status)}>
                {request.status}
              </Tag>
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Result</StructuredListCell>
            <StructuredListCell>
              <Tag size="md" type={resultToColor(request.result || 'unknown')}>
                {request.result || 'In progress'}
              </Tag>
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Reason</StructuredListCell>
            <StructuredListCell>{request.reason || 'N/A'}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Enhancer Name</StructuredListCell>
            <StructuredListCell>{request.enhancerName || 'N/A'}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Enhancer Version</StructuredListCell>
            <StructuredListCell>{request.enhancerVersion || 'N/A'}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Request ID</StructuredListCell>
            <StructuredListCell>
              {request.requestId ? (
                <Link to={`/events/${request.requestId}`}>
                  <pre>{request.requestId}</pre>
                </Link>
              ) : (
                'N/A'
              )}
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Generation ID</StructuredListCell>
            <StructuredListCell>
              {request.generationId ? (
                <Link to={`/generations/${request.generationId}`}>
                  <pre>{request.generationId}</pre>
                </Link>
              ) : (
                'N/A'
              )}
            </StructuredListCell>
          </StructuredListRow>
        </StructuredListBody>
      </StructuredListWrapper>
      <Stack gap={5}>
        <Heading>Raw JSON</Heading>
        <CodeSnippet type="multi">
          {JSON.stringify(
            request,
            (key, value) => {
              if (value instanceof Map) {
                return Object.fromEntries(value.entries());
              }
              return value;
            },
            2,
          )}
        </CodeSnippet>
      </Stack>
    </Stack>
  );
};

export { EnhancementPageContent };
