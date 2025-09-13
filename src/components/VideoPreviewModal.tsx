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
  console.log('Video in Modal:', video);

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
      <DialogContent className="w-[98vw] max-w-[98vw] sm:w-[95vw] sm:max-w-[95vw] md:max-w-4xl lg:max-w-5xl xl:max-w-5xl h-[98vh] max-h-[98vh] sm:h-[95vh] sm:max-h-[95vh] overflow-hidden flex flex-col p-2 sm:p-4 md:p-6">
        <DialogHeader className="flex-shrink-0 pb-2 sm:pb-4">
          <DialogTitle className="text-sm sm:text-base md:text-lg lg:text-xl font-bold pr-6 sm:pr-8 line-clamp-2 break-words">
            {video.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 md:space-y-6 pr-2">
          {/* ===================== Video Player ===================== */}
          <div className="w-full">
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
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
                    <Button size="sm" className="gradient-primary" disabled>
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">No preview available</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stop & Get Frame */}
          {videoUrl && (
            <div className="flex justify-center sm:justify-end">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleStopAndGetFrameIndex}
                className="h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 text-xs sm:text-sm"
              >
                <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Stop & Get Frame</span>
                <span className="sm:hidden">Stop</span>
              </Button>
            </div>
          )}

          {/* Captured Frame Info */}
          {currentFrameIndex !== null && (
            <div className="p-2 sm:p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                <div>
                  <label className="text-green-700 font-medium block">Current Time:</label>
                  <p className="text-green-600 break-all">{currentTime.toFixed(3)} seconds</p>
                </div>
                <div>
                  <label className="text-green-700 font-medium block">Frame Index:</label>
                  <p className="text-green-600 font-mono break-all">{currentFrameIndex}</p>
                </div>
              </div>
            </div>
          )}

          {/* ===================== Video Info ===================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 col-span-1 sm:col-span-2 lg:col-span-1">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
              <span className="flex-shrink-0">Video ID:</span>
              <span className="font-mono truncate text-xs break-all">{video.video_id}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
              <span className="flex-shrink-0">Frame:</span>
              <span className="truncate">{video.frame_number}</span>
            </div>
            {video.rank != null && (
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <Tag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
                <span className="flex-shrink-0">Rank:</span>
                <span className="truncate">{video.rank}</span>
              </div>
            )}
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
              <span className="flex-shrink-0">FPS:</span>
              <span className="truncate">{fps}</span>
            </div>
            {Number.isFinite(video.total_score) && (
              <div className="flex items-center gap-1 sm:gap-2 bg-yellow-100 text-yellow-800 px-2 sm:px-3 py-1 rounded-full font-semibold shadow-sm col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 min-w-0">
                <Tag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Total Score: {video.total_score.toFixed(3)}</span>
              </div>
            )}
            {Number.isFinite(video.image_score) && (
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <Tag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
                <span className="flex-shrink-0">Image Score:</span>
                <span className="truncate">{video.image_score.toFixed(3)}</span>
              </div>
            )}
            {Number.isFinite(video.text_score) && (
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <Tag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
                <span className="flex-shrink-0">Text Score:</span>
                <span className="truncate">{video.text_score.toFixed(3)}</span>
              </div>
            )}
          </div>

          {/* ===================== Tags ===================== */}
          {video.tags && video.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Tags:</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {video.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs sm:text-sm break-all">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* ===================== Description ===================== */}
          {video.description && (
            <div className="p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Description</h4>
              <p className="text-gray-700 whitespace-pre-line text-xs sm:text-sm leading-relaxed break-words">
                {video.description}
              </p>
            </div>
          )}

          {/* ===================== Metadata ===================== */}
          {video.metadata && Object.keys(video.metadata).length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <Info className="h-3 w-3 sm:h-4 sm:w-4" /> Metadata
              </h4>
              <div className="relative">
                <pre className="p-2 sm:p-3 bg-gray-100 rounded-lg overflow-x-auto text-xs sm:text-sm border border-gray-200 max-h-24 sm:max-h-32 md:max-h-48 lg:max-h-64 overflow-y-auto whitespace-pre-wrap break-all">
                  {JSON.stringify(video.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}