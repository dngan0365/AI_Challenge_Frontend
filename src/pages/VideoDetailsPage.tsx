import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FinalMatchView from '@/components/FinalMatchView';
import { useSearchContext } from '@/hooks/useSearchContext';

export default function VideoDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { searchResults, searchHistory, resetSearch, findVideoById } = useSearchContext();

    const video = searchResults[0] ?? (id ? findVideoById(id) : undefined);

    useEffect(() => {
        if (!video) navigate('/search');
    }, [video, navigate]);

    if (!video) return null;

    return (
        <FinalMatchView
            video={video}
            searchHistory={searchHistory}
            onNewSearch={() => {
                resetSearch();
                navigate('/search');
            }}
        />
    );
}


