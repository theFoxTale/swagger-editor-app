export interface RequestHistory {
  id: number;
  user_id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  request_duration: number;
  request_size: number;
  response_size: number;
  error: string | null;
}
