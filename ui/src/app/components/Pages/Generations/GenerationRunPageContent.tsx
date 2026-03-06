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

import { ErrorSection } from '@app/components/Sections/ErrorSection/ErrorSection';
import RelativeTimestamp from '@app/components/UtilsComponents/RelativeTimestamp';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import {
  calculateDuration,
  runReasonToColor,
  runReasonToDescription,
  runStateToColor,
} from '@app/utils/Utils';
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
import { useGenerationRun } from './useGenerationRun';

const GenerationRunPageContent: React.FunctionComponent = () => {
  const { id, runId } = useParams<{ id: string; runId: string }>();
  const [{ run, error, loading }] = useGenerationRun(id!, runId!);

  useDocumentTitle(`SBOMer | Generation ${id} | Run ${runId}`);

  if (error) {
    return (
      <Stack gap={6}>
        <ErrorSection title="Could not load generation run" message={error.message} />
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

  if (!run) {
    return null;
  }

  const duration = calculateDuration(run.startTime, run.completionTime);

  return (
    <Stack gap={7}>
      <Heading>
        Generation Run - Attempt #{run.attemptNumber}
      </Heading>
      <StructuredListWrapper isCondensed>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Property</StructuredListCell>
            <StructuredListCell head>Value</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          <StructuredListRow>
            <StructuredListCell>Run ID</StructuredListCell>
            <StructuredListCell>
              <span>{run.id}</span>
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Generation ID</StructuredListCell>
            <StructuredListCell>
              <Link to={`/generations/${run.generationId}`}>
                <pre>{run.generationId}</pre>
              </Link>
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Attempt Number</StructuredListCell>
            <StructuredListCell>
              <strong>#{run.attemptNumber}</strong>
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>State</StructuredListCell>
            <StructuredListCell>
              <Tag size="md" type={runStateToColor(run.state)}>
                {run.state}
              </Tag>
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Reason</StructuredListCell>
            <StructuredListCell>
              <Tag size="md" type={runReasonToColor(run.reason)}>
                {runReasonToDescription(run.reason)}
              </Tag>
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Start Time</StructuredListCell>
            <StructuredListCell>
              <Stack gap={2}>
                <RelativeTimestamp date={run.startTime} />
                <span>{run.startTime.toISOString()}</span>
              </Stack>
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Completion Time</StructuredListCell>
            <StructuredListCell>
              {run.completionTime ? (
                <Stack gap={2}>
                  <RelativeTimestamp date={run.completionTime} />
                  <span>{run.completionTime.toISOString()}</span>
                </Stack>
              ) : (
                'N/A'
              )}
            </StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Duration</StructuredListCell>
            <StructuredListCell>{duration}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Message</StructuredListCell>
            <StructuredListCell>
              {run.message ? <pre style={{ whiteSpace: 'pre-wrap' }}>{run.message}</pre> : 'N/A'}
            </StructuredListCell>
          </StructuredListRow>
        </StructuredListBody>
      </StructuredListWrapper>
      <Stack gap={5}>
        <Heading>Raw JSON</Heading>
        <CodeSnippet type="multi">{JSON.stringify(run, null, 2)}</CodeSnippet>
      </Stack>
    </Stack>
  );
};

export { GenerationRunPageContent };

