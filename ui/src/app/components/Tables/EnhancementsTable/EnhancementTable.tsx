import { SbomerEnhancement } from '@app/types';
import { LinkCell, TableColumn, TablePage, TagCell, TimestampCell } from '../TablePage/TablePage';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParam } from 'react-use';
import { resultToColor, statusToColor } from '@app/utils/Utils';
import { useEnhancements } from './useEnhancements';

interface EnhancementRow {
  id: string;
  created: Date | undefined;
  updated: Date | undefined;
  finished: Date | undefined;
  status: string;
  result: string | undefined;
  reason: string | undefined;
  enhancerType: string | undefined;
  enhancerVersion: string | undefined;
  generationId: string | undefined;
  requestId: string | undefined;
}

const columns: TableColumn<EnhancementRow>[] = [
  {
    key: 'id',
    header: 'ID',
    render: (row) => <LinkCell to={`/enhancements/${row.id}`}>{row.id}</LinkCell>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <TagCell type={statusToColor(row.status)}>{row.status || 'unknown'}</TagCell>,
  },
  {
    key: 'result',
    header: 'Result',
    render: (row) => (
      <TagCell type={resultToColor(row.result || 'unknown')}>{row.result || 'unknown'}</TagCell>
    ),
  },
  { key: 'created', header: 'Created', render: (row) => <TimestampCell date={row.created} /> },
  { key: 'updated', header: 'Updated', render: (row) => <TimestampCell date={row.updated} /> },
  { key: 'finished', header: 'Finished', render: (row) => <TimestampCell date={row.finished} /> },
  { key: 'reason', header: 'Reason', render: (row) => row.reason || 'N/A' },
  { key: 'enhancerType', header: 'Enhancer Type', render: (row) => row.enhancerType || 'N/A' },
  {
    key: 'enhancerVersion',
    header: 'Enhancer Version',
    render: (row) => row.enhancerVersion || 'N/A',
  },
  {
    key: 'generationId',
    header: 'Generation ID',
    render: (row) => (
      <LinkCell to={`/generations/${row.generationId}`}>{row.generationId}</LinkCell>
    ),
  },
  { key: 'requestId', header: 'Request ID', render: (row) => row.requestId || 'N/A' },
];

export const EnhancementTable = () => {
  const navigate = useNavigate();
  const paramPage = useSearchParam('page') || 1;
  const paramPageSize = useSearchParam('pageSize') || 10;

  const [{ pageIndex, pageSize, value, loading, total, error }, { setPageIndex, setPageSize }] =
    useEnhancements(+paramPage - 1, +paramPageSize);

  const onSetPage = (newPage: number) => {
    setPageIndex(newPage - 1);
    navigate({ search: `?page=${newPage}&pageSize=${pageSize}` });
  };

  const onPerPageSelect = (newPerPage: number) => {
    setPageSize(newPerPage);
    setPageIndex(0);
    navigate({ search: `?page=1&pageSize=${newPerPage}` });
  };

  const rows: EnhancementRow[] =
    (value ?? []).map((enhancement: SbomerEnhancement) => ({
      id: enhancement.id,
      status: enhancement.status,
      result: enhancement.result,
      created: enhancement.created,
      updated: enhancement.updated,
      finished: enhancement.finished,
      reason: enhancement.reason,
      enhancerType: enhancement.enhancerName,
      enhancerVersion: enhancement.enhancerVersion,
      generationId: enhancement.generationId,
      requestId: enhancement.requestId,
    })) ?? [];

  return (
    <TablePage
      title="Enhancements"
      description="Latest enhancements"
      columns={columns}
      data={rows}
      loading={loading}
      error={error}
      total={total || 0}
      pageIndex={pageIndex + 1}
      pageSize={pageSize}
      onPageChange={onSetPage}
      onPageSizeChange={onPerPageSelect}
      noResultsTitle="No enhancements found"
      noResultsMessage="No enhancements were made."
      noResultsActionText="Take me home"
      onNoResultsAction={() => navigate('/')}
      getRowKey={(row) => row.id}
    />
  );
};
