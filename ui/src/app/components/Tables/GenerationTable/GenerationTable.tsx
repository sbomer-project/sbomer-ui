import { resultToColor, statusToColor } from '@app/utils/Utils';

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchParam } from 'react-use';

import { ErrorSection } from '@app/components/Sections/ErrorSection/ErrorSection';
import { NoResultsSection } from '@app/components/Sections/NoResultsSection/NoResultSection';
import { useGenerations } from '@app/components/Tables/GenerationTable/useGenerations';
import RelativeTimestamp from '@app/components/UtilsComponents/RelativeTimestamp';
import {
  DataTable,
  DataTableSkeleton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
} from '@carbon/react';
import { SbomerGeneration } from '@app/types';

const headers = [
  { key: 'id', header: 'ID' },
  { key: 'status', header: 'Status' },
  { key: 'result', header: 'Result' },
  { key: 'creationTime', header: 'Created' },
  { key: 'updatedTime', header: 'Updated' },
  { key: 'finishedTime', header: 'Finished' },
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

  const pagination = (
    <Pagination
      backwardText="Previous page"
      forwardText="Next page"
      itemsPerPageText="Items per page:"
      itemRangeText={(min: number, max: number, total: number) => `${min}–${max} of ${total} items`}
      page={pageIndex + 1}
      pageNumberText="Page Number"
      pageSize={pageSize}
      pageSizes={[
        { text: '10', value: 10 },
        { text: '20', value: 20 },
        { text: '50', value: 50 },
        { text: '100', value: 100 },
      ]}
      totalItems={total || 0}
      onChange={({ page, pageSize: newPageSize }) => {
        if (page !== pageIndex + 1) {
          onSetPage(page);
        } else if (newPageSize !== pageSize) {
          onPerPageSelect(newPageSize);
        }
      }}
    />
  );

  const rows = (value ?? []).map((g: SbomerGeneration) => ({
    id: String(g.id),
    status: g.status ?? 'unknown',
    result: g.result ?? 'unknown',
    creationTime: g.created ? new Date(g.created) : undefined,
    updatedTime: g.updated ? new Date(g.updated) : undefined,
    finishedTime: g.finished ? new Date(g.finished) : undefined,
  }));

  const table = (
    <DataTable rows={rows} headers={headers}>
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getCellProps }) => (
        <TableContainer title="Generations" description="Latest generations">
          <Table aria-label="Generations" {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => {
                    const cellKey = cell.info.header;
                    switch (cellKey) {
                      case 'id':
                        return (
                          <TableCell {...getCellProps({ cell })}>
                            <Link to={`/generations/${cell.value}`}>
                              <pre>{cell.value}</pre>
                            </Link>
                          </TableCell>
                        );
                      case 'status':
                        return (
                          <TableCell {...getCellProps({ cell })}>
                            <Tag size="md" type={statusToColor(cell.value as string)}>
                              {cell.value || 'unknown'}
                            </Tag>
                          </TableCell>
                        );
                      case 'result':
                        return (
                          <TableCell {...getCellProps({ cell })}>
                            <Tag size="md" type={resultToColor(cell.value as string)}>
                              {cell.value || 'unknown'}
                            </Tag>
                          </TableCell>
                        );
                      case 'creationTime':
                      case 'updatedTime':
                      case 'finishedTime':
                        return (
                          <TableCell {...getCellProps({ cell })}>
                            <RelativeTimestamp date={cell.value as Date | undefined} />
                          </TableCell>
                        );
                      default:
                        return <TableCell {...getCellProps({ cell })}>{cell.value}</TableCell>;
                    }
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {pagination}
        </TableContainer>
      )}
    </DataTable>
  );

  const noResults = (
    <NoResultsSection
      title="No generations found"
      message="Looks like no generations happened."
      onActionClick={() => {
        navigate('/');
      }}
      actionText={'Take me home'}
    />
  );
  const loadingSkeleton = (
    <TableContainer title="Generations" description="Latest generations">
      <DataTableSkeleton
        columnCount={headers.length}
        showHeader={false}
        showToolbar={false}
        rowCount={10}
      />
      {pagination}
    </TableContainer>
  );

  const tableArea = error ? (
    <ErrorSection title="Could not load generations" message={error.message} />
  ) : loading ? (
    loadingSkeleton
  ) : total === 0 ? (
    noResults
  ) : (
    table
  );

  return <div className="table-wrapper">{tableArea}</div>;
};
