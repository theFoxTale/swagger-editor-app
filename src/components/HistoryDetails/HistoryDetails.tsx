import CloseHistoryBtn from './CloseHistoryBtn';

import './HistoryDetails.css';
import { RequestHistory } from '@/types/history';

interface Props {
  item: RequestHistory;
}

export default function HistoryDetails({ item }: Props) {
  return (
    <div className="history-details">
      <div className="history-details-header">
        <h3>Request #{item.id}</h3>
        <CloseHistoryBtn />
      </div>
      <div className="history-details-content">
        <div className="history-details-row">
          <span className="history-details-label">Method</span>
          <span>{item.method}</span>
        </div>
        <div className="history-details-row">
          <span className="history-details-label">Endpoint</span>
          <span>{item.endpoint}</span>
        </div>
        <div className="history-details-row">
          <span className="history-details-label">Status</span>
          <span>{item.status}</span>
        </div>
        <div className="history-details-row">
          <span className="history-details-label">Duration</span>
          <span>{item.request_duration}ms</span>
        </div>
        <div className="history-details-row">
          <span className="history-details-label">Timestamp</span>
          <span>{new Date(item.timestamp).toLocaleString()}</span>
        </div>
        <div className="history-details-row">
          <span className="history-details-label">Request Size</span>
          <span>{item.request_size}B</span>
        </div>
        <div className="history-details-row">
          <span className="history-details-label">Response Size</span>
          <span>{item.response_size}B</span>
        </div>
        {item.error && (
          <div className="history-details-row history-details-row-error">
            <span className="history-details-label">Error</span>
            <span>{item.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
