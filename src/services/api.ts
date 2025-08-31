import { UUID } from 'crypto';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Types matching your Pydantic models
export interface QueryRequest {
  text_query?: string;
  image_query?: string;
  od_json?: string;
  ocr_text?: string;
  asr_text?: string;
}

export interface QueryResult {
  keyframe_id: string;
  video_id: string;
  frame_number: number;
  timestamp_ms: number;
  image_url: string;
  metadata: Record<string, any>;
  rank: number;
  score: number;
}

export interface QueryResponse {
  query_id: string;
  session_id: string;
  results: QueryResult[];
}

export interface SessionResponse {
  session_id: string;
  created_at: string;
}

export interface HistoryResult {
  keyframe_id: string;
  video_id: string;
  frame_number: number;
  timestamp_ms: number;
  image_url: string;
  metadata: Record<string, any>;
  rank: number;
  score: number;
}

export interface HistoryItem {
  query_id: string;
  session_id: string;
  text_query?: string;
  image_query?: string;
  od_json?: string;
  ocr_text?: string;
  asr_text?: string;
  query_time: string;
  results: HistoryResult[];
}

export interface HistoryResponse {
  session_id: string;
  queries: HistoryItem[];
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log(url, options);
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // Session endpoints
  async createSession(): Promise<SessionResponse> {
    return this.request<SessionResponse>('/session', {
      method: 'POST',
    });
  }

  async getAllSessions(): Promise<SessionResponse[]> {
    return this.request<SessionResponse[]>('/sessions');
  }

  // Query endpoints
  async createQuery(sessionId: string, queryData: QueryRequest): Promise<QueryResponse> {
    return this.request<QueryResponse>(`/query?session=${sessionId}`, {
      method: 'POST',
      body: JSON.stringify(queryData),
    });
  }

  // History endpoints
  async getHistory(sessionId: string): Promise<HistoryResponse> {
    return this.request<HistoryResponse>(`/history?session=${sessionId}`);
  }

  async getAllHistory(): Promise<{ history: HistoryItem[] }> {
    return this.request<{ history: HistoryItem[] }>('/history/all');
  }
}

export const apiService = new ApiService();