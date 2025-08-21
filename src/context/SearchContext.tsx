import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { VideoMetadata, searchVideos, refineSearch, mockVideoDatabase } from '@/data/mockDatabase';

type QueryType = 'text' | 'video' | 'image';

interface SearchStep {
    id: number;
    label: string;
    query: string;
    queryType: QueryType;
    resultsCount: number;
    completed: boolean;
}

interface SearchContextValue {
    searchResults: VideoMetadata[];
    searchHistory: SearchStep[];
    currentStep: number;
    isLoading: boolean;
    hasSearched: boolean;
    handleSearch: (query: string, queryType: QueryType, file?: File) => Promise<void>;
    handleRefine: (refinementQuery: string, queryType: QueryType) => Promise<void>;
    handleVideoSelect: (video: VideoMetadata) => void;
    resetSearch: () => void;
    findVideoById: (id: string) => VideoMetadata | undefined;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [searchResults, setSearchResults] = useState<VideoMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchHistory, setSearchHistory] = useState<SearchStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    const handleSearch = useCallback(async (query: string, queryType: QueryType, file?: File) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const results = searchVideos(query, queryType);
        setSearchResults(prev => {
            if (prev.length === 0) return results;
            const map = new Map(prev.map(v => [v.id, v]));
            for (const v of results) map.set(v.id, v);
            return Array.from(map.values());
        });
        setHasSearched(true);
        setIsLoading(false);
        const newStep: SearchStep = {
            id: Date.now(),
            label: `Initial Search - ${queryType}`,
            query,
            queryType,
            resultsCount: results.length,
            completed: true
        };
        setSearchHistory(prev => [...prev, newStep]);
        setCurrentStep(prev => prev + 1);
    }, []);

    const handleRefine = useCallback(async (refinementQuery: string, queryType: QueryType) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 400));
        const refinedResults = refineSearch(searchResults, refinementQuery, queryType);
        setSearchResults(refinedResults);
        setIsLoading(false);
        const newStep: SearchStep = {
            id: Date.now(),
            label: `Refinement ${searchHistory.length}`,
            query: refinementQuery,
            queryType,
            resultsCount: refinedResults.length,
            completed: true
        };
        setSearchHistory(prev => [...prev, newStep]);
        setCurrentStep(prev => prev + 1);
    }, [searchResults, searchHistory.length]);

    const handleVideoSelect = useCallback((video: VideoMetadata) => {
        setSearchResults([video]);
        const refinementStep: SearchStep = {
            id: Date.now(),
            label: 'Final Selection',
            query: video.title,
            queryType: 'text',
            resultsCount: 1,
            completed: true
        };
        setSearchHistory(prev => [...prev, refinementStep]);
        setCurrentStep(prev => prev + 1);
    }, []);

    const resetSearch = useCallback(() => {
        setSearchResults([]);
        setHasSearched(false);
        setSearchHistory([]);
        setCurrentStep(0);
    }, []);

    const findVideoById = useCallback((id: string) => {
        return mockVideoDatabase.find(v => v.id === id);
    }, []);

    const value = useMemo<SearchContextValue>(() => ({
        searchResults,
        searchHistory,
        currentStep,
        isLoading,
        hasSearched,
        handleSearch,
        handleRefine,
        handleVideoSelect,
        resetSearch,
        findVideoById
    }), [searchResults, searchHistory, currentStep, isLoading, hasSearched, handleSearch, handleRefine, handleVideoSelect, resetSearch, findVideoById]);

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearchContext(): SearchContextValue {
    const ctx = useContext(SearchContext);
    if (!ctx) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return ctx;
}


