import { AppLayout } from '@app/components/Pages/AppLayout/AppLayout';
import { EventTableRefactored } from '@app/components/Tables/EventTable/EventTableRefactored';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import * as React from 'react';

export function EventsPage() {
  useDocumentTitle('SBOMer | Events');

  return (
    <AppLayout>
      <EventTableRefactored />
    </AppLayout>
  );
}
