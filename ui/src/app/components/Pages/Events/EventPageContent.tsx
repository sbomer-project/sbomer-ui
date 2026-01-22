import { useEvent } from '@app/components/Tables/EventTable/useEventManifest';
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

import { ErrorSection } from '@app/components/Sections/ErrorSection/ErrorSection';
import RelativeTimestamp from '@app/components/UtilsComponents/RelativeTimestamp';
import { eventStatusToColor, resultToColor, statusToColor } from '@app/utils/Utils';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEventGeneration } from '@app/components/Tables/EventTable/useEventGeneration';
import { SbomerGeneration } from '@app/types';

const generationHeaders = [
  { key: 'id', header: 'ID' },
  { key: 'status', header: 'Status' },
  { key: 'result', header: 'Result' },
  { key: 'creationTime', header: 'Created' },
  { key: 'updatedTime', header: 'Updated' },
  { key: 'finishedTime', header: 'Finished' },
];

export const EventPageContent = () => {
  const { id } = useParams<{ id: string }>();
  const [{ request, loading, error }] = useEvent(id!);
  const [{ value: generationsValue, loading: generationsLoading, error: generationsError }] =
    useEventGeneration(id!);

  if (error) {
    return <ErrorSection title="Could not load event details" message={error.message} />;
  }

  // Only show skeleton when we have no data yet
  if (loading && !request) {
    return <SkeletonText />;
  }

  if (!request) {
    return null;
  }

  const generationRows =
    (generationsValue?.data ?? []).map((g: SbomerGeneration) => ({
      id: String(g.id),
      status: g.status ?? 'unknown',
      result: g.result ?? 'unknown',
      creationTime: g.created ? new Date(g.created) : undefined,
      updatedTime: g.updated ? new Date(g.updated) : undefined,
      finishedTime: g.finished ? new Date(g.finished) : undefined,
    })) ?? [];

  const generationsTable = (
    <TableContainer title="Generations" description="Generations for this event">
      <Table aria-label="Event Generations">
        <TableHead>
          <TableRow>
            {generationHeaders.map((header) => (
              <TableHeader key={header.key}>{header.header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {generationRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Link to={`/generations/${row.id}`}>
                  <pre>{row.id}</pre>
                </Link>
              </TableCell>
              <TableCell>
                <Tag size="md" type={statusToColor(row.status)}>
                  {row.status || 'unknown'}
                </Tag>
              </TableCell>
              <TableCell>
                <Tag size="md" type={resultToColor(row.result)}>
                  {row.result || 'unknown'}
                </Tag>
              </TableCell>
              <TableCell>
                <RelativeTimestamp date={row.creationTime} />
              </TableCell>
              <TableCell>
                <RelativeTimestamp date={row.updatedTime} />
              </TableCell>
              <TableCell>
                <RelativeTimestamp date={row.finishedTime} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const generationsLoadingSkeleton = (
    <TableContainer title="Generations" description="Generations for this event">
      <DataTableSkeleton
        columnCount={generationHeaders.length}
        showHeader={false}
        showToolbar={false}
        rowCount={5}
      />
    </TableContainer>
  );

  const generationsSection = generationsError ? (
    <ErrorSection title="Could not load generations" message={generationsError.message} />
  ) : generationsLoading && !generationsValue ? (
    generationsLoadingSkeleton
  ) : generationRows.length === 0 ? (
    <p>No generations found for this event.</p>
  ) : (
    generationsTable
  );

  return (
    <Stack gap={7}>
      <Heading>Event {id}</Heading>
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
              <span>{id}</span>
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
            <StructuredListCell>Status</StructuredListCell>
            <StructuredListCell>
              <Tag size="md" type={eventStatusToColor(request.status)}>
                {request.status}
              </Tag>
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
      {generationsSection}
    </Stack>
  );
};
