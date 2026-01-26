import { ErrorSection } from '@app/components/Sections/ErrorSection/ErrorSection';
import RelativeTimestamp from '@app/components/UtilsComponents/RelativeTimestamp';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { resultToColor, statusToColor } from '@app/utils/Utils';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
} from '@carbon/react';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGeneration } from './useGeneration';
import { useGenerationEnhancements } from './useGenerationEnhancements';

const enhancementHeaders = [
  { key: 'id', header: 'ID' },
  { key: 'status', header: 'Status' },
  { key: 'result', header: 'Result' },
  { key: 'enhancerName', header: 'Enhancer Name' },
  { key: 'enhancerVersion', header: 'Version' },
  { key: 'created', header: 'Created' },
  { key: 'updated', header: 'Updated' },
  { key: 'finished', header: 'Finished' },
];

const GenerationPageContent: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [{ request, error, loading }] = useGeneration(id!);
  const [{ value: enhancementsValue, loading: enhancementsLoading, error: enhancementsError }] =
    useGenerationEnhancements(id!);

  useDocumentTitle('SBOMer | Generations | ' + id);

  if (error) {
    return <ErrorSection title="Could not load generations" message={error.message} />;
  }

  if (loading) {
    return <SkeletonText />;
  }

  if (!request) {
    return null;
  }

  const enhancementRows =
    (enhancementsValue?.data ?? []).map((e: any) => {
      const parseDate = (dateValue: any): Date | undefined => {
        if (!dateValue) return undefined;
        if (dateValue instanceof Date) return dateValue;
        try {
          const parsed = new Date(dateValue);
          return isNaN(parsed.getTime()) ? undefined : parsed;
        } catch {
          return undefined;
        }
      };

      return {
        id: String(e.id),
        status: e.status ?? 'unknown',
        result: e.result ?? null,
        enhancerName: e.enhancerName ?? 'N/A',
        enhancerVersion: e.enhancerVersion ?? 'N/A',
        created: parseDate(e.created),
        updated: parseDate(e.updated),
        finished: parseDate(e.finished),
      };
    }) ?? [];

  const enhancementsTable = (
    <TableContainer title="Enhancements" description="Enhancements for this generation">
      <Table aria-label="Generation Enhancements">
        <TableHead>
          <TableRow>
            {enhancementHeaders.map((header) => (
              <TableHeader key={header.key}>{header.header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {enhancementRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Link to={`/enhancements/${row.id}`}>
                  <pre>{row.id}</pre>
                </Link>
              </TableCell>
              <TableCell>
                <Tag size="md" type={statusToColor(row.status)}>
                  {row.status}
                </Tag>
              </TableCell>
              <TableCell>
                {row.result ? (
                  <Tag size="md" type={resultToColor(row.result)}>
                    {row.result}
                  </Tag>
                ) : (
                  'In progress'
                )}
              </TableCell>
              <TableCell>{row.enhancerName}</TableCell>
              <TableCell>{row.enhancerVersion}</TableCell>
              <TableCell>
                <RelativeTimestamp date={row.created} />
              </TableCell>
              <TableCell>
                <RelativeTimestamp date={row.updated} />
              </TableCell>
              <TableCell>
                <RelativeTimestamp date={row.finished} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const enhancementsLoadingSkeleton = (
    <TableContainer title="Enhancements" description="Enhancements for this generation">
      <DataTableSkeleton
        columnCount={enhancementHeaders.length}
        showHeader={false}
        showToolbar={false}
        rowCount={5}
      />
    </TableContainer>
  );

  const enhancementsSection = enhancementsError ? (
    <ErrorSection title="Could not load enhancements" message={enhancementsError.message} />
  ) : enhancementsLoading && !enhancementsValue ? (
    enhancementsLoadingSkeleton
  ) : enhancementRows.length === 0 ? (
    <p>No enhancements found for this generation.</p>
  ) : (
    enhancementsTable
  );

  return (
    <Stack gap={7}>
      <Heading>Generation {id}</Heading>
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
              <Tag size="md" type={resultToColor(request.result)}>
                {request.result || 'In progress'}
              </Tag>
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Reason</StructuredListCell>
            <StructuredListCell>{request.reason || 'N/A'}</StructuredListCell>
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
            <StructuredListCell>Generator Name</StructuredListCell>
            <StructuredListCell>{request.generatorName || 'N/A'}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Generator Version</StructuredListCell>
            <StructuredListCell>{request.generatorVersion || 'N/A'}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Target Type</StructuredListCell>
            <StructuredListCell>{request.targetType || 'N/A'}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Target Identifier</StructuredListCell>
            <StructuredListCell>{request.targetIdentifier || 'N/A'}</StructuredListCell>
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
      {enhancementsSection}
    </Stack>
  );
};

export { GenerationPageContent as GenerationPageContent };
