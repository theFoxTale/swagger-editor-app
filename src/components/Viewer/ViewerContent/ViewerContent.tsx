'use client';

import { useTranslation } from '@/hooks';
import { getServerUrl, type ExtractedEndpoints } from '@/lib/openapi';

import { EndpointList } from '../EndpointList';

import styles from '../Viewer.module.css';
import { ViewerHeader } from '../ViewerHeader';

export interface ViewerContentProps {
  extracted: ExtractedEndpoints | null;
}

export const ViewerContent = ({ extracted }: ViewerContentProps) => {
  const { viewerLang } = useTranslation();

  if (!extracted) {
    return <p className={styles.placeholder}>{viewerLang.emptySchema}</p>;
  }

  const serverUrl = getServerUrl(extracted);

  return (
    <>
      <ViewerHeader
        title={extracted.info.title}
        version={extracted.info.version}
        description={extracted.info.description}
        serverUrl={serverUrl}
      />
      <EndpointList tagGroups={extracted.tagGroups} document={extracted.document} />
    </>
  );
};
