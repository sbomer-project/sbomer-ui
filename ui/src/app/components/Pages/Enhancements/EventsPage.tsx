import React from 'react';
import { AppLayout } from '../AppLayout/AppLayout';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { EnhancementTable } from '@app/components/Tables/EnhancementsTable/EnhancementTable';

export function EnhancementsPage() {
  useDocumentTitle('SBOMer | Enhancements');

  return (
    <AppLayout>
      <EnhancementTable />
    </AppLayout>
  );
}
