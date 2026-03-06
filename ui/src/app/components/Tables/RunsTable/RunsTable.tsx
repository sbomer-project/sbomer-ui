///
/// JBoss, Home of Professional Open Source.
/// Copyright 2023 Red Hat, Inc., and individual contributors
/// as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
/// http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import RelativeTimestamp from '@app/components/UtilsComponents/RelativeTimestamp';
import { EnhancementRunRecord, GenerationRunRecord } from '@app/types';
import { calculateDuration, runReasonToColor, runStateToColor } from '@app/utils/Utils';
import {
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
import { Link } from 'react-router-dom';

type RunRecord = GenerationRunRecord | EnhancementRunRecord;

interface RunsTableProps {
  runs: RunRecord[];
  parentType: 'generation' | 'enhancement';
  parentId: string;
  title?: string;
  description?: string;
}

const headers = [
  { key: 'attemptNumber', header: 'Attempt' },
  { key: 'state', header: 'State' },
  { key: 'reason', header: 'Reason' },
  { key: 'startTime', header: 'Start Time' },
  { key: 'completionTime', header: 'Completion Time' },
  { key: 'duration', header: 'Duration' },
];

export const RunsTable: React.FunctionComponent<RunsTableProps> = ({
  runs,
  parentType,
  parentId,
  title = 'Execution History',
  description = 'Execution attempts and retry history',
}) => {
  const rows = runs.map((run) => ({
    id: run.id,
    attemptNumber: run.attemptNumber,
    state: run.state,
    reason: run.reason,
    startTime: run.startTime,
    completionTime: run.completionTime,
    duration: calculateDuration(run.startTime, run.completionTime),
  }));

  return (
    <TableContainer title={title} description={description}>
      <Table aria-label="Runs Table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableHeader key={header.key}>{header.header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const linkPath =
              parentType === 'generation'
                ? `/generations/${parentId}/runs/${row.id}`
                : `/enhancements/${parentId}/runs/${row.id}`;

            return (
              <TableRow key={row.id}>
                <TableCell>
                  <Link to={linkPath}>
                    <strong>#{row.attemptNumber}</strong>
                  </Link>
                </TableCell>
                <TableCell>
                  <Tag size="md" type={runStateToColor(row.state)}>
                    {row.state}
                  </Tag>
                </TableCell>
                <TableCell>
                  <Tag size="md" type={runReasonToColor(row.reason)}>
                    {row.reason}
                  </Tag>
                </TableCell>
                <TableCell>
                  <RelativeTimestamp date={row.startTime} />
                </TableCell>
                <TableCell>
                  {row.completionTime ? <RelativeTimestamp date={row.completionTime} /> : 'N/A'}
                </TableCell>
                <TableCell>{row.duration}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

