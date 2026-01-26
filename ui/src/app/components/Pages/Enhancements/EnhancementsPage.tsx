import { AppLayout } from '@app/components/Pages/AppLayout/AppLayout';
import { EnhancementTable } from '@app/components/Tables/EnhancementsTable/EnhancementTable';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import * as React from 'react';

export function EnhancementsPage() {
  useDocumentTitle('SBOMer | Enhancements');

  return (
    <AppLayout>
      <EnhancementTable />
    </AppLayout>
  );
}
