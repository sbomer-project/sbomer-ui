import { useGenerations } from '@app/components/Tables/GenerationTable/useGenerations';
import {
  LinkCell,
  TableColumn,
  TablePage,
  TagCell,
  TimestampCell,
} from '@app/components/Tables/TablePage/TablePage';
import { resultToColor, statusToColor } from '@app/utils/Utils';
import { SbomerGeneration } from '@app/types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParam } from 'react-use';

interface GenerationRow {
  id: string;
  status: string;
  result: string;
  creationTime: Date | undefined;
  updatedTime: Date | undefined;
  finishedTime: Date | undefined;
}

const columns: TableColumn<GenerationRow>[] = [
  {
    key: 'id',
    header: 'ID',
    render: (row) => <LinkCell to={`/generations/${row.id}`}>{row.id}</LinkCell>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <TagCell type={statusToColor(row.status)}>{row.status || 'unknown'}</TagCell>,
  },
  {
    key: 'result',
    header: 'Result',
    render: (row) => <TagCell type={resultToColor(row.result)}>{row.result || 'unknown'}</TagCell>,
  },
  {
    key: 'creationTime',
    header: 'Created',
    render: (row) => <TimestampCell date={row.creationTime} />,
  },
  {
    key: 'updatedTime',
    header: 'Updated',
    render: (row) => <TimestampCell date={row.updatedTime} />,
  },
  {
    key: 'finishedTime',
    header: 'Finished',
    render: (row) => <TimestampCell date={row.finishedTime} />,
  },
];

export const GenerationTable = () => {
  const navigate = useNavigate();
  const paramPage = useSearchParam('page') || 1;
  const paramPageSize = useSearchParam('pageSize') || 10;

  const [{ pageIndex, pageSize, value, loading, total, error }, { setPageIndex, setPageSize }] =
    useGenerations(+paramPage - 1, +paramPageSize);

  const onSetPage = (newPage: number) => {
    setPageIndex(newPage - 1);
    navigate({ search: `?page=${newPage}&pageSize=${pageSize}` });
  };

  const onPerPageSelect = (newPerPage: number) => {
    setPageSize(newPerPage);
    setPageIndex(0);
    navigate({ search: `?page=1&pageSize=${newPerPage}` });
  };

  const rows: GenerationRow[] =
    (value ?? []).map((g: SbomerGeneration) => ({
      id: String(g.id),
      status: g.status ?? 'unknown',
      result: g.result ?? 'unknown',
      creationTime: g.created ? new Date(g.created) : undefined,
      updatedTime: g.updated ? new Date(g.updated) : undefined,
      finishedTime: g.finished ? new Date(g.finished) : undefined,
    })) ?? [];

  return (
    <TablePage
      title="Generations"
      description="Latest generations"
      columns={columns}
      data={rows}
      loading={loading}
      error={error}
      total={total || 0}
      pageIndex={pageIndex + 1}
      pageSize={pageSize}
      onPageChange={onSetPage}
      onPageSizeChange={onPerPageSelect}
      noResultsTitle="No generations found"
      noResultsMessage="Looks like no generations happened."
      noResultsActionText="Take me home"
      onNoResultsAction={() => navigate('/')}
      getRowKey={(row) => row.id}
    />
  );
};
