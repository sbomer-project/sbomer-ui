import { ErrorSection } from '@app/components/Sections/ErrorSection/ErrorSection';
import { RunsTable } from '@app/components/Tables/RunsTable/RunsTable';
import RelativeTimestamp from '@app/components/UtilsComponents/RelativeTimestamp';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { enhancementStatusToColor, resultToColor } from '@app/utils/Utils';
import {
  CodeSnippet,
  DataTableSkeleton,
  Heading,
  SkeletonText,
  Stack,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
  TableContainer,
  Tag,
} from '@carbon/react';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEnhancement } from './useEnhancement';
import { useEnhancementRuns } from './useEnhancementRuns';

const EnhancementPageContent: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [{ request, error, loading }] = useEnhancement(id!);
  const [{ runs, loading: runsLoading, error: runsError }] = useEnhancementRuns(id!);

  useDocumentTitle('SBOMer | Enhancements | ' + id);

  if (error) {
    return (
      <Stack gap={6}>
        <ErrorSection title="Could not load enhancement" message={error.message} />
      </Stack>
    );
  }

  if (loading) {
    return (
      <Stack gap={6}>
        <SkeletonText />
      </Stack>
    );
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
              <Tag size="md" type={enhancementStatusToColor(request.status)}>
                {request.status}
              </Tag>
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Result</StructuredListCell>
            <StructuredListCell>{request.result || 'N/A'}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Reason</StructuredListCell>
            <StructuredListCell>{request.reason || 'N/A'}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Latest Run Result</StructuredListCell>
            <StructuredListCell>
              {request.latestResult ? (
                <Tag size="md" type={resultToColor(request.latestResult)}>
                  {request.latestResult}
                </Tag>
              ) : (
                'N/A'
              )}
            </StructuredListCell>
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
          <StructuredListRow>
            <StructuredListCell>SBOM URLs</StructuredListCell>
            <StructuredListCell>
              {request.enhancementSbomUrls && request.enhancementSbomUrls.length > 0 ? (
                <Stack gap={2}>
                  {request.enhancementSbomUrls.map((url, index) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  ))}
                </Stack>
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
      {runsError ? (
        <Stack gap={6}>
          <ErrorSection title="Could not load execution history" message={runsError.message} />
        </Stack>
      ) : runsLoading && !runs ? (
        <TableContainer title="Execution History" description="Execution attempts and retry history">
          <DataTableSkeleton columnCount={6} showHeader={false} showToolbar={false} rowCount={3} />
        </TableContainer>
      ) : runs && runs.length > 0 ? (
        <RunsTable runs={runs} parentType="enhancement" parentId={id!} />
      ) : (
        <p>No execution history found for this enhancement.</p>
      )}
    </Stack>
  );
};

export { EnhancementPageContent };
