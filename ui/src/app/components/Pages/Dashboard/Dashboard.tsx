import { AppLayout } from '@app/components/Pages/AppLayout/AppLayout';
import { AboutSection } from '@app/components/Sections/AboutSection/AboutSection';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { Heading, InlineNotification, Stack } from '@carbon/react';
import * as React from 'react';

const Dashboard: React.FunctionComponent = () => {
  useDocumentTitle('SBOMer | Dashboard');

  return (
    <AppLayout>
      <Stack gap={7}>
        <Heading>SBOMer</Heading>
        <InlineNotification
          kind="info"
          title="In Development"
          subtitle="Features are actively being developed and may change."
          hideCloseButton
        />
        <AboutSection />
      </Stack>
    </AppLayout>
  );
};

export { Dashboard };
