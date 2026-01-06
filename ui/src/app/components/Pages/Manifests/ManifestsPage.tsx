import { ManifestsTable } from '@app/components/Tables/ManifestsTable/ManifestsTable';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import * as React from 'react';
import { AppLayout } from '../AppLayout/AppLayout';

const ManifestsPage: React.FunctionComponent = () => {
  useDocumentTitle('SBOMer | Manifests');

  return (
    <AppLayout>
      <ManifestsTable />
    </AppLayout>
  );
};

export { ManifestsPage };
