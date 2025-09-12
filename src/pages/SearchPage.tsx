import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchPanel from '@/components/SearchPanel';
import { Video, AlertCircle, CheckCircle } from 'lucide-react';
import { useSearchContext } from '@/hooks/useSearchContext';
import { apiService } from '@/services/api';

export default function SearchPage() {
    const navigate = useNavigate();
    const { handleSearch, isLoading, hasSearched, sessionId, error } = useSearchContext();
    const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');

    useEffect(() => {
        if (hasSearched) navigate('/results');
    }, [hasSearched, navigate]);

    // Check API health on component mount
    useEffect(() => {
        const checkApiHealth = async () => {
            try {
                await apiService.healthCheck();
                setApiStatus('connected');
            } catch (error) {
                console.error('API health check failed:', error);
                setApiStatus('error');
            }
        };

        checkApiHealth();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-hero">
            <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
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

                        {/* API Status Indicator */}
                        <div className="flex items-center gap-2 text-sm">
                            {apiStatus === 'checking' && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full"></div>
                                    <span>Connecting to API...</span>
                                </div>
                            )}
                            {apiStatus === 'connected' && (
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>API Connected</span>
                                </div>
                            )}
                            {apiStatus === 'error' && (
                                <div className="flex items-center gap-2 text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>API Disconnected</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Session Info */}
                    {sessionId && (
                        <div className="mt-2 text-xs text-muted-foreground">
                            Session ID: {sessionId}
                        </div>
                    )}
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

                        {/* Show error if API is not connected */}
                        {apiStatus === 'error' && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-2 text-destructive mb-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="font-medium">API Connection Error</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Unable to connect to the API server. Please check if your backend is running on the configured URL.
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-2 text-sm text-destructive hover:underline"
                                >
                                    Retry Connection
                                </button>
                            </div>
                        )}

                        {/* Show search error if exists */}
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-2 text-destructive mb-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="font-medium">Search Error</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{error}</p>
                            </div>
                        )}

                        <SearchPanel 
                            onSearch={handleSearch} 
                            isLoading={isLoading} 
                            disabled={apiStatus !== 'connected'}
                        />

                        {/* API Configuration Info */}
                        <div className="mt-8 text-center text-xs text-muted-foreground">
                            <p>API Endpoint: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}</p>
                            <p>
                                Make sure your backend server is running and accessible at the configured URL.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}