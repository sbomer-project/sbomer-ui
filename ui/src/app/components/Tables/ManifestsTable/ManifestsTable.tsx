import { useManifestsFilters } from '@app/components/Tables/ManifestsTable/useManifestsFilters';
import { useManifests } from '@app/components/Tables/ManifestsTable/useSboms';


import { ErrorSection } from '@app/components/Sections/ErrorSection/ErrorSection';
import { NoResultsSection } from '@app/components/Sections/NoResultsSection/NoResultSection';
import { RelativeTimestamp } from '@app/components/UtilsComponents/RelativeTimestamp';
import { DataTable, DataTableSkeleton, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@carbon/react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const columnNames = {
  id: 'ID',
  creationTime: 'Created',
};

const headers = [
  { key: 'id', header: columnNames.id },
  { key: 'creationTime', header: columnNames.creationTime },
];

export const ManifestsTable = () => {
  const navigate = useNavigate();
  const { pageIndex, pageSize, setFilters } = useManifestsFilters();

  // getting the data and applying the filters sent to the backend here
  const [{ value, loading, total, error }] = useManifests();

  const onSetPage = (newPage: number) => {
    setFilters(newPage, pageSize)
  };

  const onPerPageSelect = (newPerPage: number) => {
    setFilters(pageIndex, newPerPage)
  };


  const pagination = (
    <Pagination
      backwardText="Previous page"
      forwardText="Next page"
      itemsPerPageText="Items per page:"
      itemRangeText={(min: number, max: number, total: number) => `${min}–${max} of ${total} items`}
      page={pageIndex}
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
        if (page !== pageIndex) {
          onSetPage(page);
        } else if (newPageSize !== pageSize) {
          onPerPageSelect(newPageSize);
        }
      }}
    />
  );

const rows = (value || []).map(manifest => ({
  id: manifest.id,
  creationTime: manifest.created,
}));

const table = (
  <DataTable
    rows={rows}
    headers={[
      { key: 'id', header: columnNames.id },
      { key: 'creationTime', header: columnNames.creationTime },
    ]}
  >{({
    rows,
    headers,
    getTableProps,
    getHeaderProps,
    getRowProps,
    getCellProps,
  }) => (

    <TableContainer title="Manifests" description="Latest manifests">
      <Table {...getTableProps()}>
        <TableHead>
          <TableRow>
            {headers.map(header => (
              <TableHeader {...getHeaderProps({ header })}>
                {header.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow {...getRowProps({ row })}>
              {row.cells.map(cell => {
                const cellKey = cell.info.header;
                switch (cellKey) {
                  case 'id':
                    return (
                      <TableCell {...getCellProps({ cell })}>
                        <Link to={`/manifests/${cell.value}`}>
                          <pre>{cell.value}</pre>
                        </Link>
                      </TableCell>
                    );
                  case 'creationTime':
                    return (
                      <TableCell {...getCellProps({ cell })}>
                        <RelativeTimestamp date={cell.value as Date | undefined} />
                      </TableCell>
                    );
                  default:
                    return (
                      <TableCell {...getCellProps({ cell })}>
                        {cell.value}
                      </TableCell>
                    );
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

  const noResults = <NoResultsSection title="No manifests found" message="Looks like no manifests were generated." onActionClick={() => { navigate('/') }} actionText={'Take me home'} />;
  const loadingSkeleton = (
    <TableContainer title="Manifests" description="Latest manifests">
      <DataTableSkeleton
        columnCount={Object.keys(headers).length}
        showHeader={false}
        showToolbar={false}
        rowCount={10}
      />
      {pagination}
    </TableContainer>
  );


  const tableArea =
    error ? <ErrorSection title="Could not load manifests" message={error.message} /> :
      loading ? loadingSkeleton :
        total === 0 ? noResults : table;


  return <div className='table-wrapper'>
    {tableArea}
  </div>
};
