import { ErrorSection } from '@app/components/Sections/ErrorSection/ErrorSection';
import { NoResultsSection } from '@app/components/Sections/NoResultsSection/NoResultSection';
import { RelativeTimestamp } from '@app/components/UtilsComponents/RelativeTimestamp';
import { extractQueryErrorMessageDetails } from '@app/utils/Utils';
import {
  Button,
  DataTableSkeleton,
  Heading,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tag,
  Tile,
} from '@carbon/react';
import { Help } from '@carbon/icons-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
}

export interface TablePageProps<T> {
  title: string;
  description: string;
  columns: TableColumn<T>[];
  data: T[] | undefined;
  loading: boolean;
  error: any;
  total: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;

  // Optional search functionality
  searchEnabled?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  searchLabel?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
  onSearchExecute?: () => void;

  // Optional help button
  helpEnabled?: boolean;
  helpPath?: string;

  // Optional no results customization
  noResultsTitle?: string;
  noResultsMessage?: string;
  noResultsActionText?: string;
  onNoResultsAction?: () => void;

  // Optional error handling
  isQueryValidationError?: (error: any) => boolean;

  // Row key extractor
  getRowKey: (row: T) => string;
}

export function TablePage<T>({
  title,
  description,
  columns,
  data,
  loading,
  error,
  total,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  searchEnabled = false,
  searchValue = '',
  searchPlaceholder = 'Enter query',
  searchLabel = 'Search',
  onSearchChange,
  onSearchClear,
  onSearchExecute,
  helpEnabled = false,
  helpPath = '/help',
  noResultsTitle = 'No results found',
  noResultsMessage = 'Try adjusting your search or filters.',
  noResultsActionText = 'Clear filters',
  onNoResultsAction,
  isQueryValidationError,
  getRowKey,
}: TablePageProps<T>) {
  const navigate = useNavigate();

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
          onPageChange(page);
        } else if (newPageSize !== pageSize) {
          onPageSizeChange(newPageSize);
        }
      }}
    />
  );

  const loadingSkeleton = (
    <TableContainer title={title} description={description}>
      <DataTableSkeleton
        columnCount={columns.length}
        showHeader={false}
        showToolbar={false}
        rowCount={10}
      />
      {pagination}
    </TableContainer>
  );

  if (loading) {
    return loadingSkeleton;
  }

  const isValidationError = isQueryValidationError ? isQueryValidationError(error) : false;

  if (error && !isValidationError) {
    return <ErrorSection title={`Could not load ${title.toLowerCase()}`} message={error.message} />;
  }

  const queryErrorTile =
    error &&
    isValidationError &&
    (() => {
      const { message, details } = extractQueryErrorMessageDetails(error);
      return (
        <Tile>
          <Stack gap={5}>
            <Heading>Invalid Query</Heading>
            <p>
              {message ||
                'Your search query is not valid. Please check your syntax or clear filters to try again.'}
            </p>
            {details && <p>{details}</p>}
            {onSearchClear && (
              <Button kind="primary" size="sm" onClick={onSearchClear}>
                Clear filters
              </Button>
            )}
          </Stack>
        </Tile>
      );
    })();

  return (
    <TableContainer title={title} description={description}>
      {searchEnabled && (
        <TableToolbar>
          <TableToolbarContent>
            <TableToolbarSearch
              persistent
              labelText={searchLabel}
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => {
                if (typeof event !== 'string' && event.target) {
                  onSearchChange?.(event.target.value);
                }
              }}
              onClear={onSearchClear}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onSearchExecute?.();
              }}
              size="md"
            />
            {helpEnabled && (
              <Button
                kind="ghost"
                hasIconOnly
                iconDescription="Query Reference"
                renderIcon={Help}
                onClick={() => navigate(helpPath)}
              />
            )}
          </TableToolbarContent>
        </TableToolbar>
      )}

      {queryErrorTile ? (
        queryErrorTile
      ) : data && data.length > 0 ? (
        <>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableHeader key={column.key}>{column.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={getRowKey(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{column.render(row)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {pagination}
        </>
      ) : (
        <NoResultsSection
          title={noResultsTitle}
          message={noResultsMessage}
          actionText={noResultsActionText}
          onActionClick={onNoResultsAction || (() => {})}
        />
      )}
    </TableContainer>
  );
}

// Helper components for common cell types
export const LinkCell: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to}>
    <pre>{children}</pre>
  </Link>
);

export const TagCell: React.FC<{ type: any; children: React.ReactNode }> = ({ type, children }) => (
  <Tag size="md" type={type}>
    {children}
  </Tag>
);

export const TimestampCell: React.FC<{ date: Date | undefined }> = ({ date }) => (
  <RelativeTimestamp date={date} />
);
