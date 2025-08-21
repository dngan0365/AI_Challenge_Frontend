import { VideoMetadata } from '@/data/mockDatabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Calendar, Tag, FileText, HardDrive } from 'lucide-react';

interface VideoPreviewModalProps {
  video: VideoMetadata | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (video: VideoMetadata) => void;
}

export default function VideoPreviewModal({ video, isOpen, onClose, onSelect }: VideoPreviewModalProps) {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{video.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Video Player Placeholder */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Button size="lg" className="gradient-primary">
                <Play className="h-6 w-6 mr-2" />
                Play Preview
              </Button>
            </div>
          </div>

          {/* Video Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Metadata */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Metadata</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tag className="h-4 w-4" />
                      Event ID
                    </div>
                    <span className="font-mono">{video.eventId}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Duration
                    </div>
                    <span>{video.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Upload Date
                    </div>
                    <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Category
                    </div>
                    <Badge variant="outline">{video.category}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HardDrive className="h-4 w-4" />
                      File Size
                    </div>
                    <span>{video.fileSize}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tag className="h-4 w-4" />
                      Resolution
                    </div>
                    <span>{video.resolution}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {onSelect && (
              <Button onClick={() => onSelect(video)} className="flex-1 gradient-primary">
                Select This Video
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}