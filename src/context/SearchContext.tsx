// src/context/SearchContext.tsx
import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { apiService, QueryRequest, QueryResponse, SearchResult } from '@/services/api';

// Convert SearchResult to VideoMetadata for compatibility with existing components
export interface VideoMetadata {
  id: string;
  video_id: string;
  title: string;
  thumbnail: string;
  duration: number;
  timestamp_ms: number;
  frame_number: number;
  description?: string;
  tags?: string[];
  metadata: Record<string, any>;
  total_score?: number;
  image_score?: number;
  text_score?: number;
  rank?: number;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  resultsCount: number;
  queryType: 'text' | 'image' | 'multimodal';
}

interface SearchState {
  sessionId: string | null;
  searchResults: VideoMetadata[];
  searchHistory: SearchHistoryItem[];
  currentStep: number;
  isLoading: boolean;
  hasSearched: boolean;
  error: string | null;
  queryHistory: any[]; // Using HistoryItem type from api service
}

type SearchAction =
  | { type: 'SET_SESSION'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESULTS'; payload: VideoMetadata[] }
  | { type: 'ADD_SEARCH_HISTORY'; payload: SearchHistoryItem }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_QUERY_HISTORY'; payload: any[] }
  | { type: 'RESET_SEARCH' };

const initialState: SearchState = {
  sessionId: null,
  searchResults: [],
  searchHistory: [],
  currentStep: 0,
  isLoading: false,
  hasSearched: false,
  error: null,
  queryHistory: [],
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, sessionId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
        hasSearched: true,
        error: null
      };
    case 'ADD_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [...state.searchHistory, action.payload],
        currentStep: state.searchHistory.length + 1,
      };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_QUERY_HISTORY':
      return { ...state, queryHistory: action.payload };
    case 'RESET_SEARCH':
      return {
        ...initialState,
        sessionId: state.sessionId // Keep session but reset search state
      };
    default:
      return state;
  }
}

function safeScore(score: number | null): number | undefined {
  return Number.isFinite(score) ? score! * 100 : undefined;
}
// Helper function to convert SearchResult to VideoMetadata
function convertSearchResultToVideoMetadata(result: SearchResult): VideoMetadata {
  const metadata = typeof result.property.metadata === 'string'
    ? apiService.parseMetadata(result.property.metadata)
    : result.property.metadata;

  return {
    id: result.frame_id,
    video_id: result.property.video_id,
    title: result.property.title,
    thumbnail: result.property.img_url,
    duration: metadata?.duration || 0,
    timestamp_ms: result.property.timestamp * 1000,
    frame_number: result.property.frame_idx,
    description: result.property.text,
    tags: metadata?.keyword || [],
    metadata: metadata || {},
    total_score: safeScore(result.total_score),
    image_score: safeScore(result.image_score),
    text_score: safeScore(result.text_score),
    rank: undefined,
  };
}

interface SearchContextType {
  // State
  sessionId: string | null;
  searchResults: VideoMetadata[];
  searchHistory: SearchHistoryItem[];
  queryHistory: any[];
  currentStep: number;
  isLoading: boolean;
  hasSearched: boolean;
  error: string | null;

  // Actions
  handleSearch: (query: QueryRequest) => Promise<void>;
  handleRefine: (refinement: string) => Promise<void>;
  handleVideoSelect: (video: VideoMetadata) => void;
  resetSearch: () => void;
  findVideoById: (id: string) => VideoMetadata | undefined;
  loadHistory: () => Promise<void>;
  createNewSession: () => Promise<void>;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        // Check for existing session in localStorage
        const existingSessionId = localStorage.getItem('searchSessionId');
        if (existingSessionId && /^[0-9a-fA-F-]{36}$/.test(existingSessionId)) {
          // valid UUID
          dispatch({ type: 'SET_SESSION', payload: existingSessionId });
          await loadHistoryForSession(existingSessionId);
        } else {
          await createNewSession();
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize session' });
      }
    };

    initSession();
  }, []);

  const createNewSession = useCallback(async () => {
    try {
      const session = await apiService.createSession();
      dispatch({ type: 'SET_SESSION', payload: session.session_id });
      localStorage.setItem('searchSessionId', session.session_id);
      dispatch({ type: 'RESET_SEARCH' });
    } catch (error) {
      console.error('Failed to create session:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create new session' });
    }
  }, []);

  const loadHistoryForSession = useCallback(async (sessionId: string) => {
    try {
      const history = await apiService.getHistory(sessionId);
      dispatch({ type: 'SET_QUERY_HISTORY', payload: history.queries });

      // Convert query history to search history format
      const searchHistory: SearchHistoryItem[] = history.queries.map((query, index) => ({
        id: query.query_id,
        query: query.text_query || query.image_query || query.ocr_text || query.asr_text || 'Multimodal query',
        timestamp: new Date(query.query_time),
        resultsCount: query.results.length,
        queryType: query.text_query ? 'text' : query.image_query ? 'image' : 'multimodal',
      }));

      searchHistory.forEach(item => {
        dispatch({ type: 'ADD_SEARCH_HISTORY', payload: item });
      });

      // Set results from last query if exists
      if (history.queries.length > 0) {
        const lastQuery = history.queries[history.queries.length - 1];
        const results = lastQuery.results.map(convertSearchResultToVideoMetadata);
        dispatch({ type: 'SET_RESULTS', payload: results });
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    if (!state.sessionId) return;
    await loadHistoryForSession(state.sessionId);
  }, [state.sessionId, loadHistoryForSession]);

  const handleSearch = useCallback(async (queryRequest: QueryRequest) => {
    if (!state.sessionId) {
      dispatch({ type: 'SET_ERROR', payload: 'No active session' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response: QueryResponse = await apiService.createQuery(state.sessionId, queryRequest);
      const results = response.results.map(convertSearchResultToVideoMetadata);

      dispatch({ type: 'SET_RESULTS', payload: results });

      // Add to search history
      const queryText = queryRequest.text_query || queryRequest.image_query || queryRequest.ocr_text || queryRequest.asr_text || queryRequest.od_json || '';
      const historyItem: SearchHistoryItem = {
        id: response.query_id || Math.random().toString(36).slice(2),
        query: queryText,
        timestamp: new Date(),
        resultsCount: results.length,
        queryType: queryRequest.text_query ? 'text' : queryRequest.image_query ? 'image' : 'multimodal',
      };

      dispatch({ type: 'ADD_SEARCH_HISTORY', payload: historyItem });
    } catch (error) {
      console.error('Search failed:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Search failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.sessionId]);

  const handleRefine = useCallback(async (refinement: string) => {
    const queryRequest: QueryRequest = {
      text_query: refinement,
    };
    await handleSearch(queryRequest);
  }, [handleSearch]);

  const handleVideoSelect = useCallback((video: VideoMetadata) => {
    // This could be extended to track video selections
    console.log('Video selected:', video);
  }, []);

  const resetSearch = useCallback(() => {
    dispatch({ type: 'RESET_SEARCH' });
  }, []);

  const findVideoById = useCallback((id: string): VideoMetadata | undefined => {
    return state.searchResults.find(video => video.id === id || video.video_id === id);
  }, [state.searchResults]);

  const value: SearchContextType = {
    // State
    sessionId: state.sessionId,
    searchResults: state.searchResults,
    searchHistory: state.searchHistory,
    queryHistory: state.queryHistory,
    currentStep: state.currentStep,
    isLoading: state.isLoading,
    hasSearched: state.hasSearched,
    error: state.error,

    // Actions
    handleSearch,
    handleRefine,
    handleVideoSelect,
    resetSearch,
    findVideoById,
    loadHistory,
    createNewSession,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

