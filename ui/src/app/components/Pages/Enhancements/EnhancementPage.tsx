import { AppLayout } from '@app/components/Pages/AppLayout/AppLayout';
import { EnhancementPageContent } from './EnhancementPageContent';
import * as React from 'react';

export function EnhancementPage() {
  return (
    <AppLayout>
      <EnhancementPageContent />
    </AppLayout>
  );
}

export default EnhancementPage;
