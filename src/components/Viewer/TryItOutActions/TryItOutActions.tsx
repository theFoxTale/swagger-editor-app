'use client';

import { Button } from '@/components/common';
import { useTranslation } from '@/hooks';

import styles from './TryItOutActions.module.css';

export interface TryItOutActionsProps {
  sendDisabled?: boolean;
  sendDisabledHint?: string;
  onSend?: () => void;
  onClear?: () => void;
  onCopyCurl?: () => void;
  sending?: boolean;
  copyCurlDisabled?: boolean;
  copyingCurl?: boolean;
  copyCurlSuccess?: boolean;
}

export const TryItOutActions = ({
  sendDisabled = false,
  sendDisabledHint,
  onSend,
  onClear,
  onCopyCurl,
  sending = false,
  copyCurlDisabled = false,
  copyingCurl = false,
  copyCurlSuccess = false,
}: TryItOutActionsProps) => {
  const { viewerLang } = useTranslation();
  const disabledTitle = sendDisabled
    ? (sendDisabledHint ?? viewerLang.tryItOutSendDisabledHint)
    : undefined;

  return (
    <div className={styles.actions}>
      <Button
        variant="primary"
        size="sm"
        type="button"
        disabled={sendDisabled || sending || !onSend}
        onClick={onSend}
        title={disabledTitle}
      >
        {sending ? viewerLang.tryItOutSending : viewerLang.tryItOutSend}
      </Button>

      <Button
        variant="secondary"
        size="sm"
        type="button"
        disabled={copyCurlDisabled || copyingCurl || !onCopyCurl}
        onClick={onCopyCurl}
        title={copyCurlDisabled ? disabledTitle : undefined}
      >
        {copyingCurl
          ? viewerLang.tryItOutCopyCurl
          : copyCurlSuccess
            ? viewerLang.tryItOutCopiedCurl
            : viewerLang.tryItOutCopyCurl}
      </Button>

      <Button
        variant="secondary"
        size="sm"
        type="button"
        disabled={!onClear || sending}
        onClick={onClear}
      >
        {viewerLang.tryItOutClear}
      </Button>
    </div>
  );
};
