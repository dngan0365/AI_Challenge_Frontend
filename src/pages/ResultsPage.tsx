import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, AlertCircle } from 'lucide-react';
import { useSearchContext } from '@/context/SearchContext';
import ProgressTracker from '@/components/ProgressTracker';
import RefinementPanel from '@/components/RefinementPanel';
import VideoCard from '@/components/VideoCard';
import VideoPreviewModal from '@/components/VideoPreviewModal';
import { VideoMetadata } from '@/context/SearchContext';
import AppHeader from '@/components/layout/AppHeader';

export default function ResultsPage() {
    const navigate = useNavigate();
    const {
        searchResults,
        searchHistory,
        currentStep,
        isLoading,
        hasSearched,
        error,
        handleRefine,
        handleVideoSelect,
        sessionId,
    } = useSearchContext();

    const [previewVideo, setPreviewVideo] = useState<VideoMetadata | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        if (!hasSearched && !isLoading) {
            navigate('/search');
        }
    }, [hasSearched, isLoading, navigate]);

    useEffect(() => {
        if (searchResults.length === 1 && hasSearched && searchHistory.length > 0) {
            navigate(`/video/${searchResults[0].id}`, { replace: true });
        }
    }, [searchResults, hasSearched, searchHistory.length, navigate]);

    const onPreview = useCallback((video: VideoMetadata) => {
        setPreviewVideo(video);
        setIsPreviewOpen(true);
    }, []);

    const onSelect = useCallback((video: VideoMetadata) => {
        handleVideoSelect(video);
    }, [handleVideoSelect]);

    const handleRefineSearch = useCallback(async (refinement: string) => {
        await handleRefine(refinement);
    }, [handleRefine]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-hero">
                <AppHeader />
                <div className="max-w-7xl mx-auto p-6">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center space-y-4">
                            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-muted-foreground">Searching videos...</p>
                            {sessionId && (
                                <p className="text-xs text-muted-foreground">Session: {sessionId}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-hero">
                <AppHeader />
                <div className="max-w-7xl mx-auto p-6">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center space-y-4">
                            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                            <h3 className="text-lg font-semibold">Search Error</h3>
                            <p className="text-muted-foreground max-w-md">{error}</p>
                            <button
                                onClick={() => navigate('/search')}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-hero">
            <AppHeader rightSlot={<>
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </span>
            </>} />

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Search History & Progress */}
                {searchHistory.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <ProgressTracker searchHistory={searchHistory} currentStep={currentStep} />
                        </div>
                        <div className="lg:col-span-2">
                            {searchResults.length > 1 && (
                                <RefinementPanel onRefine={handleRefineSearch} resultsCount={searchResults.length} />
                            )}
                        </div>
                    </div>
                )}

                {/* Session Info */}
                {sessionId && (
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                            Session ID: {sessionId}
                        </p>
                    </div>
                )}

                {/* Results Grid */}
                {searchResults.length > 0 && (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-semibold">
                                    {searchResults.length === 1 ? 'Perfect Match Found!' : 'Search Results'}
                                </h3>
                                {searchResults[0]?.score && (
                                    <p className="text-sm text-muted-foreground">
                                        Best match score: {(searchResults[0].score * 100).toFixed(1)}%
                                    </p>
                                )}
                            </div>
                            {searchResults.length > 1 && (
                                <p className="text-muted-foreground">Narrow down your results using the refinement panel above</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {searchResults.map((video, index) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    onPreview={onPreview}
                                    onSelect={searchResults.length > 1 ? onSelect : undefined}
                                    className={`animate-fade-in`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                />
                            ))}
                        </div>

                        {/* Additional result info */}
                        {searchResults.length > 0 && (
                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Showing {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} 
                                    {searchHistory.length > 0 && ` from ${searchHistory.length} search${searchHistory.length !== 1 ? 'es' : ''}`}
                                </p>
                                <button
                                    onClick={() => navigate('/search')}
                                    className="mt-2 text-sm text-primary hover:underline"
                                >
                                    Start new search
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {searchResults.length === 0 && !isLoading && hasSearched && (
                    <div className="text-center py-12 animate-fade-in">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No results found</h3>
                        <p className="text-muted-foreground mb-4">
                            No videos match your search criteria. Try adjusting your search query or using different keywords.
                        </p>
                        <div className="space-y-2">
                            <button
                                onClick={() => navigate('/search')}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Try different search
                            </button>
                            {searchHistory.length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mt-4 mb-2">
                                        Recent searches:
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {searchHistory.slice(-3).map((search) => (
                                            <button
                                                key={search.id}
                                                onClick={() => handleRefineSearch(search.query)}
                                                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded hover:bg-muted/80 transition-colors"
                                            >
                                                {search.query}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <VideoPreviewModal
                video={previewVideo}
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                onSelect={searchResults.length > 1 ? onSelect : undefined}
            />
        </div>
    );
}