import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchPanel from '@/components/SearchPanel';
import { Video } from 'lucide-react';
import { useSearchContext } from '@/context/SearchContext';

export default function SearchPage() {
    const navigate = useNavigate();
    const { handleSearch, isLoading, hasSearched } = useSearchContext();

    useEffect(() => {
        if (hasSearched) navigate('/results');
    }, [hasSearched, navigate]);

    return (
        <div className="min-h-screen bg-gradient-hero">
            <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 gradient-primary rounded-lg">
                                <Video className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">AI Video Search Assistant</h1>
                                <p className="text-sm text-muted-foreground">Know-Item Search for Video Database</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="text-center mb-8 animate-fade-in">
                            <h2 className="text-3xl font-bold mb-4">Find Videos with AI-Powered Search</h2>
                            <p className="text-muted-foreground max-w-lg mx-auto">
                                Search through your video database using text descriptions, video clips, or images. Refine your results iteratively to find the exact content you need.
                            </p>
                        </div>
                        <SearchPanel onSearch={handleSearch} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
}


