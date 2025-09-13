import { UUID } from 'crypto';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Enhanced Types matching your backend models
export interface QueryRequest {
  text_query?: string;
  image_query?: string; // Text
  image?: string; // base64 encoded image
  od_json?: string;
  ocr_text?: string;
  asr_text?: string;
}

export interface VideoMetadata {
  id: string;
  video_id: string;
  timestamp: string;
  fps: number;
  n_keyframe?: number;
  frame_idx: number;
  image_url: string;
  video_url: string;
  objects?: Array<{
    name: string;
    id: number;
    score: number;
    bbox: [number, number, number, number];
    center: [number, number];
    color: string;
  }>;
  sound?: string;
  entities?: Record<string, any>;
  title: string;
  author: string;
  keyword?: string[];
  length: number;
  publish_date: string;
  duration: number;
  channel_url: string;
  watch_url: string;
  thumbnail_url: string;
  location?: string;
  asr_text?: string;
}

export interface SearchResult {
  frame_id: string;
  property: {
    fps: number;
    frame_idx: number;
    title: string;
    author: string;
    frame_id: string;
    publish_date: string;
    text: string;
    img_url: string;
    video_id: string;
    metadata: string | VideoMetadata;
    timestamp: number;
  };
  total_score: number | null;
  text_score: number | null;
  image_score: number | null;
}

export interface QueryResponse {
  query_id: string;
  session_id: string;
  results: SearchResult[];
}

export interface SessionResponse {
  session_id: string;
  created_at: string;
}

export interface AllSessionsResponse {
  session_id: string;
  created_at: string;
  last_updated: string;
}

export interface HistoryResult extends SearchResult {}

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

export interface ApiError {
  detail: string;
  status_code: number;
}

// Enhanced API Service Class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('API Request:', { url, method: options.method || 'GET', body: options.body });
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        const error: ApiError = {
          detail: errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
          status_code: response.status
        };
        throw new Error(JSON.stringify(error));
      }

      return response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Session Management
  async createSession(): Promise<SessionResponse> {
    return this.request<SessionResponse>('/session', {
      method: 'POST',
    });
  }

  async getAllSessions(): Promise<AllSessionsResponse[]> {
    return this.request<AllSessionsResponse[]>('/sessions');
  }

  // Query Operations - Text Only
  async createTextQuery(sessionId: string, queryData: QueryRequest): Promise<QueryResponse> {
    const searchParams = new URLSearchParams({ session: sessionId });
    return this.request<QueryResponse>(`/query-text?${searchParams}`, {
      method: 'POST',
      body: JSON.stringify(queryData),
    });
  }

  // Query Operations - Image + Text
  async createImageQuery(sessionId: string, queryData: QueryRequest): Promise<QueryResponse> {
    const searchParams = new URLSearchParams({ session: sessionId });
    return this.request<QueryResponse>(`/query-img?${searchParams}`, {
      method: 'POST',
      body: JSON.stringify(queryData),
    });
  }

  // Generic query method that chooses the appropriate endpoint
  async createQuery(sessionId: string, queryData: QueryRequest): Promise<QueryResponse> {
    if (queryData.image_query) {
      return this.createImageQuery(sessionId, queryData);
    } else {
      return this.createTextQuery(sessionId, queryData);
    }
  }

  // History Operations
  async getHistory(sessionId: string): Promise<HistoryResponse> {
    const searchParams = new URLSearchParams({ session: sessionId });
    return this.request<HistoryResponse>(`/history?${searchParams}`);
  }

  async getAllHistory(): Promise<{ history: HistoryItem[] }> {
    return this.request<{ history: HistoryItem[] }>('/history/all');
  }

  // Utility Methods
  parseMetadata(metadataString: string): VideoMetadata | null {
    try {
      return JSON.parse(metadataString) as VideoMetadata;
    } catch (error) {
      console.warn('Failed to parse metadata:', error);
      return null;
    }
  }

  formatTimestamp(timestampSeconds: number): string {
    const minutes = Math.floor(timestampSeconds / 60);
    const seconds = Math.floor(timestampSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getVideoUrl(result: SearchResult): string {
    const metadata = typeof result.property.metadata === 'string' 
      ? this.parseMetadata(result.property.metadata)
      : result.property.metadata;
    
    return metadata?.video_url || '';
  }

  getWatchUrl(result: SearchResult): string {
    const metadata = typeof result.property.metadata === 'string' 
      ? this.parseMetadata(result.property.metadata)
      : result.property.metadata;
    
    return metadata?.watch_url || '';
  }

  getThumbnailUrl(result: SearchResult): string {
    const metadata = typeof result.property.metadata === 'string' 
      ? this.parseMetadata(result.property.metadata)
      : result.property.metadata;
    
    return metadata?.thumbnail_url || result.property.img_url;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      return this.request<{ status: string; message: string }>('/health');
    } catch (error) {
      return {
        status: 'error',
        message: 'API service is not available'
      };
    }
  }

  // Batch operations
  async batchCreateQueries(
    sessionId: string, 
    queries: QueryRequest[]
  ): Promise<QueryResponse[]> {
    const results = await Promise.allSettled(
      queries.map(query => this.createQuery(sessionId, query))
    );

    return results
      .filter((result): result is PromiseFulfilledResult<QueryResponse> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }

  // Search refinement
  async refineSearch(
    originalResults: SearchResult[],
    refinementQuery: string
  ): Promise<SearchResult[]> {
    // Client-side filtering based on refinement query
    const terms = refinementQuery.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return originalResults.filter(result => {
      const searchText = `${result.property.title} ${result.property.text} ${result.property.author}`.toLowerCase();
      return terms.some(term => searchText.includes(term));
    });
  }

  // Get detailed result information
  getResultDetails(result: SearchResult): {
    title: string;
    author: string;
    duration: string;
    publishDate: string;
    location?: string;
    objects?: string[];
    description: string;
  } {
    const metadata = typeof result.property.metadata === 'string' 
      ? this.parseMetadata(result.property.metadata)
      : result.property.metadata;

    return {
      title: result.property.title,
      author: result.property.author,
      duration: this.formatTimestamp(result.property.timestamp),
      publishDate: result.property.publish_date,
      location: metadata?.location,
      objects: metadata?.objects?.map(obj => obj.name) || [],
      description: result.property.text
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export utility functions for use in components
export const apiUtils = {
  formatTimestamp: (seconds: number) => apiService.formatTimestamp(seconds),
  parseMetadata: (metadataString: string) => apiService.parseMetadata(metadataString),
  getVideoUrl: (result: SearchResult) => apiService.getVideoUrl(result),
  getWatchUrl: (result: SearchResult) => apiService.getWatchUrl(result),
  getThumbnailUrl: (result: SearchResult) => apiService.getThumbnailUrl(result),
  getResultDetails: (result: SearchResult) => apiService.getResultDetails(result),
};

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    try {
      const apiError = JSON.parse(error.message) as ApiError;
      return apiError.detail;
    } catch {
      return error.message;
    }
  }
  return 'An unknown error occurred';
};

export const isApiError = (error: unknown): error is Error => {
  if (!(error instanceof Error)) return false;
  
  try {
    JSON.parse(error.message);
    return true;
  } catch {
    return false;
  }
};