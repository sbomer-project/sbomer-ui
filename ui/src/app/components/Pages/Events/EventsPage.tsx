import { AppLayout } from '@app/components/Pages/AppLayout/AppLayout';
import { EventTable } from '@app/components/Tables/EventTable/EventTable';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import * as React from 'react';

export function EventsPage() {
  useDocumentTitle('SBOMer | Events');

  return (
    <AppLayout>
      <EventTable />
    </AppLayout>
  );
}
