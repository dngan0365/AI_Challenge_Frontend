import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { useSearchContext } from '@/context/SearchContext';
import ProgressTracker from '@/components/ProgressTracker';
import RefinementPanel from '@/components/RefinementPanel';
import VideoCard from '@/components/VideoCard';
import VideoPreviewModal from '@/components/VideoPreviewModal';
import { VideoMetadata } from '@/data/mockDatabase';
import AppHeader from '@/components/layout/AppHeader';

export default function ResultsPage() {
    const navigate = useNavigate();
    const {
        searchResults,
        searchHistory,
        currentStep,
        isLoading,
        hasSearched,
        handleRefine,
        handleVideoSelect,
    } = useSearchContext();

    const [previewVideo, setPreviewVideo] = useState<VideoMetadata | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        if (!hasSearched) navigate('/search');
    }, [hasSearched, navigate]);

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
                                <RefinementPanel onRefine={handleRefine} resultsCount={searchResults.length} />
                            )}
                        </div>
                    </div>
                )}

                {/* Results Grid */}
                {searchResults.length > 0 && (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold">
                                {searchResults.length === 1 ? 'Perfect Match Found!' : 'Search Results'}
                            </h3>
                            {searchResults.length > 1 && (
                                <p className="text-muted-foreground">Narrow down your results using the refinement panel above</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {searchResults.map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    onPreview={onPreview}
                                    onSelect={searchResults.length > 1 ? onSelect : undefined}
                                    className={`animate-fade-in`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {searchResults.length === 0 && !isLoading && (
                    <div className="text-center py-12 animate-fade-in">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No results found</h3>
                        <p className="text-muted-foreground mb-4">Try adjusting your search query or using different keywords</p>
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


