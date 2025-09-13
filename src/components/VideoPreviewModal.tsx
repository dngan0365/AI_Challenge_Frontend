import { VideoMetadata } from '@/context/SearchContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Tag, Square, Info } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface VideoPreviewModalProps {
  video: VideoMetadata | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPreviewModal({ video, isOpen, onClose }: VideoPreviewModalProps) {
  if (!video) return null;

  const keyframeSeconds = Math.max(0, Math.floor((video.timestamp_ms || 0) / 1000));
  const watchUrl = (video as any)?.metadata?.watch_url || '';
  const videoUrl = (video as any)?.metadata?.video_url || '';
  const fps = (video as any)?.metadata?.fps || 30;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentFrameIndex, setCurrentFrameIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [autoCaptured, setAutoCaptured] = useState<boolean>(false);

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = keyframeSeconds;
        const handler = () => {
          if (!autoCaptured) {
            handleStopAndGetFrameIndex();
            setAutoCaptured(true);
          }
          videoRef.current?.removeEventListener('seeked', handler);
        };
        videoRef.current.addEventListener('seeked', handler);
      } catch {
        // no-op
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleStopAndGetFrameIndex = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      const timeSeconds = videoRef.current.currentTime;
      const frameIndex = Math.floor(timeSeconds * fps);
      setCurrentTime(timeSeconds);
      setCurrentFrameIndex(frameIndex);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setAutoCaptured(false);
      setCurrentFrameIndex(null);
      setCurrentTime(0);

      if (!videoUrl) {
        setCurrentTime(keyframeSeconds);
        setCurrentFrameIndex(video.frame_number);
        setAutoCaptured(true);
      }
    }
  }, [isOpen, videoUrl, keyframeSeconds, video.frame_number]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{video.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* ===================== Video Player ===================== */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full h-full object-contain bg-black"
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
              />
            ) : watchUrl ? (
              <iframe
                className="w-full h-full"
                src={`${watchUrl.replace('watch?v=', 'embed/').split('&')[0]}?start=${keyframeSeconds}&autoplay=0`}
                title="Keyframe Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full bg-muted">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Button size="lg" className="gradient-primary" disabled>
                    <Play className="h-6 w-6 mr-2" />
                    No preview available
                  </Button>
                </div>
              </div>
            )}

            {/* Duration Overlay */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/70 text-white px-3 py-1 rounded">
              <Clock className="h-4 w-4" />
              <span>
                {Math.floor((video.duration || 0) / 60)}:
                {String(Math.floor((video.duration || 0) % 60)).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Stop & Get Frame */}
          {videoUrl && (
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleStopAndGetFrameIndex}
                className="h-8 px-3"
              >
                <Square className="h-3 w-3 mr-1" />
                Stop & Get Frame
              </Button>
            </div>
          )}

          {/* Captured Frame Info */}
          {currentFrameIndex !== null && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-green-700 font-medium">Current Time:</label>
                  <p className="text-green-600">{currentTime.toFixed(3)} seconds</p>
                </div>
                <div>
                  <label className="text-green-700 font-medium">Frame Index:</label>
                  <p className="text-green-600 font-mono">{currentFrameIndex}</p>
                </div>
              </div>
            </div>
          )}

          {/* ===================== Video Info ===================== */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" /> Video ID: <span className="font-mono">{video.video_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" /> Frame Number: <span>{video.frame_number}</span>
            </div>
            {video.score != null && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" /> Score: <span>{video.score}</span>
              </div>
            )}
            {video.rank != null && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" /> Rank: <span>{video.rank}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" /> FPS: <span>{fps}</span>
            </div>
          </div>

          {/* ===================== Tags ===================== */}
          {video.tags && video.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* ===================== Description ===================== */}
          {video.description && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
              <p className="text-gray-700 whitespace-pre-line">{video.description}</p>
            </div>
          )}

          {/* ===================== Metadata ===================== */}
          {video.metadata && Object.keys(video.metadata).length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" /> Metadata
              </h4>
              <pre className="p-3 bg-gray-100 rounded-lg overflow-x-auto text-xs border border-gray-200">
                {JSON.stringify(video.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
