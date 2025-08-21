import { VideoMetadata } from '@/data/mockDatabase';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Calendar, Tag } from 'lucide-react';

interface VideoCardProps {
  video: VideoMetadata;
  onPreview: (video: VideoMetadata) => void;
  onSelect?: (video: VideoMetadata) => void;
  className?: string;
}

export default function VideoCard({ video, onPreview, onSelect, className = "" }: VideoCardProps) {
  return (
    <Card className={`video-card group ${className}`}>
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted rounded-t-xl overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 hover:bg-black/70 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(video);
              }}
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
            {video.duration}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {video.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(video.uploadDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {video.duration}
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Tag className="h-3 w-3" />
              <span>Event ID: {video.eventId}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {video.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{video.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(video);
            }}
          >
            <Play className="h-3 w-3 mr-1" />
            Preview
          </Button>
          {onSelect && (
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(video);
              }}
            >
              Select
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}