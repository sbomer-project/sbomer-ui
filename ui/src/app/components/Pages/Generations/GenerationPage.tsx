import { AppLayout } from '@app/components/Pages/AppLayout/AppLayout';
import { GenerationPageContent } from '@app/components/Pages/Generations/GenerationPageContent';
import * as React from 'react';

export function GenerationPage() {
  return (
    <AppLayout>
      <GenerationPageContent />
    </AppLayout>
  );
}
