'use client';

import { Button } from '@/components/common';
import { useTranslation } from '@/hooks';

import styles from './TryItOutActions.module.css';

export interface TryItOutActionsProps {
  sendDisabled?: boolean;
  sendDisabledHint?: string;
  onSend?: () => void;
  onClear?: () => void;
  sending?: boolean;
}

export const TryItOutActions = ({
  sendDisabled = false,
  sendDisabledHint,
  onSend,
  onClear,
  sending = false,
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
        disabled={!onClear || sending}
        onClick={onClear}
      >
        {viewerLang.tryItOutClear}
      </Button>
    </div>
  );
};
