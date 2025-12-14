export interface BlockedItem {
  id: string;
  name: string;
  url: string;
  iconUrl?: string;
  dateAdded: number;
}

export enum SessionStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
}

export interface SessionConfig {
  durationMinutes: number;
  startTime: number | null;
  endTime: number | null;
}

export interface AiResponse {
  message: string;
  sentiment: 'encouraging' | 'strict' | 'neutral';
}