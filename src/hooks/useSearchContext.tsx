import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { SearchContext } from '@/context/SearchContext';


export function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}