'use client';

import { Button } from '@/components/common';
import { useTranslation } from '@/hooks';

import styles from './TryItOutActions.module.css';

export interface TryItOutActionsProps {
  /** When false, Send is enabled (proxy wired in phase 5). */
  sendDisabled?: boolean;
  onSend?: () => void;
  onClear?: () => void;
  sending?: boolean;
}

export const TryItOutActions = ({
  sendDisabled = true,
  onSend,
  onClear,
  sending = false,
}: TryItOutActionsProps) => {
  const { viewerLang } = useTranslation();

  return (
    <div className={styles.actions}>
      <Button
        variant="primary"
        size="sm"
        type="button"
        disabled={sendDisabled || sending}
        onClick={onSend}
        title={sendDisabled ? viewerLang.tryItOutSendDisabledHint : undefined}
      >
        {sending ? viewerLang.tryItOutSending : viewerLang.tryItOutSend}
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
