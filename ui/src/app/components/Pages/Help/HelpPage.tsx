import React from 'react';
import { AppLayout } from '@app/components/Pages/AppLayout/AppLayout';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { HelpPageContent } from './HelpPageContent';

const HelpPage: React.FunctionComponent = () => {
  useDocumentTitle('SBOMer | Help');

  return (
    <AppLayout>
      <HelpPageContent />
    </AppLayout>
  );
};

export { HelpPage };
