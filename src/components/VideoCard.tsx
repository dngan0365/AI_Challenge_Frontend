// src/components/VideoCard.tsx
import { Play, Clock, Eye, Star } from 'lucide-react';
import { VideoMetadata } from '@/context/SearchContext';

interface VideoCardProps {
  video: VideoMetadata;
  onPreview: (video: VideoMetadata) => void;
  onSelect?: (video: VideoMetadata) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function VideoCard({ video, onPreview, onSelect, className = '', style }: VideoCardProps) {
  const formatDuration = (durationInSeconds: number): string => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestampMs: number): string => {
    const totalSeconds = Math.floor(timestampMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(video);
    }
  };

  return (
    <div
      className={`group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary/50 ${className}`}
      style={style}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback for broken images
            e.currentTarget.src = `data:image/svg+xml;base64,${btoa(
              '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"><rect width="400" height="225" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14" fill="#6b7280">No Preview</text></svg>'
            )}`;
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

        {/* Play button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview(video);
          }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <div className="bg-black/80 text-white p-3 rounded-full hover:bg-black/90 transition-colors">
            <Play className="h-6 w-6 ml-1" />
          </div>
        </button>

        {/* Duration badge */}
        {video.duration > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            <Clock className="h-3 w-3 inline mr-1" />
            {formatDuration(video.duration)}
          </div>
        )}

        {/* Score badge */}
        {video.score && (
          <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Star className="h-3 w-3" />
            {(video.score).toFixed(3)}%
          </div>
        )}

        {/* Frame info */}
        <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          Frame {video.frame_number}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {video.description}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Video ID: {video.video_id}</span>
            {video.rank && (
              <span className="bg-muted px-2 py-1 rounded">
                Rank #{video.rank}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>At {formatTimestamp(video.timestamp_ms)}</span>
          </div>

          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {video.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="bg-muted px-1 py-0.5 rounded text-xs">
                  {tag}
                </span>
              ))}
              {video.tags.length > 3 && (
                <span className="text-muted-foreground">
                  +{video.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(video);
            }}
            className="flex-1 bg-muted hover:bg-muted/80 text-foreground px-3 py-2 rounded text-xs transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="h-3 w-3" />
            Preview
          </button>

          {onSelect && (
            <button
              onClick={handleCardClick}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded text-xs transition-colors"
            >
              Select
            </button>
          )}
        </div>
      </div>
    </div>
  );
}