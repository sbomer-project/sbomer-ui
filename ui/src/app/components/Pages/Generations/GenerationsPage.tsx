import { AppLayout } from '@app/components/Pages/AppLayout/AppLayout';
import { GenerationTable } from '@app/components/Tables/GenerationTable/GenerationTable';
import { GenerationTableRefactored } from '@app/components/Tables/GenerationTable/GenerationTableRefactored';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import * as React from 'react';

export function GenerationsPage() {
  useDocumentTitle('SBOMer | Generations');

  return (
    <AppLayout>
      <GenerationTableRefactored />
    </AppLayout>
  );
}
