import { VideoMetadata } from '@/data/mockDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Download, Share2, Clock, Calendar, Tag, FileText, HardDrive, CheckCircle } from 'lucide-react';

interface SearchStep {
  id: number;
  label: string;
  query: string;
  queryType: 'text' | 'video' | 'image';
  resultsCount: number;
  completed: boolean;
}

interface FinalMatchViewProps {
  video: VideoMetadata;
  searchHistory: SearchStep[];
  onNewSearch: () => void;
}

export default function FinalMatchView({ video, searchHistory, onNewSearch }: FinalMatchViewProps) {
  const [frameIndex, setFrameIndex] = useState<string>('');
  const [isAddedToCSV, setIsAddedToCSV] = useState(false);
  const csvManagerRef = useRef<any>();

  

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Perfect Match Found!</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your search has been successfully narrowed down to this specific video.
            All refinement criteria have been satisfied.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-bounce-in">
              <CardContent className="p-0">
                {/* Video Player */}
                <div className="relative aspect-video bg-black rounded-t-xl overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Button size="lg" className="gradient-primary h-16 px-8">
                      <Play className="h-8 w-8 mr-3" />
                      Play Full Video
                    </Button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button className="gradient-primary">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Now
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" onClick={onNewSearch} className="ml-auto">
                      New Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Metadata */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Detailed Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Event ID</label>
                      <p className="font-mono text-sm mt-1">{video.eventId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Category</label>
                      <div className="mt-1">
                        <Badge variant="secondary">{video.category}</Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Upload Date</label>
                      <p className="text-sm mt-1">{new Date(video.uploadDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Duration</label>
                      <p className="text-sm mt-1">{video.duration}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Resolution</label>
                      <p className="text-sm mt-1">{video.resolution}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">File Size</label>
                      <p className="text-sm mt-1">{video.fileSize}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search History Sidebar */}
          <div className="space-y-6">
            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-lg">Search Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchHistory.map((step, index) => (
                    <div key={step.id} className="relative">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{step.label}</span>
                            <Badge variant="secondary" className="text-xs">
                              {step.queryType}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            "{step.query}"
                          </p>
                          <p className="text-xs text-primary font-medium">
                            {step.resultsCount} result{step.resultsCount !== 1 ? 's' : ''} →
                            {index === searchHistory.length - 1 ? ' Perfect match!' : ` Refined to ${searchHistory[index + 1]?.resultsCount || 0}`}
                          </p>
                        </div>
                      </div>
                      {index < searchHistory.length - 1 && (
                        <div className="absolute left-4 top-10 w-px h-6 bg-border"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={onNewSearch}>
                  <Tag className="h-4 w-4 mr-2" />
                  Start New Search
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Browse Similar Videos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Event Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}