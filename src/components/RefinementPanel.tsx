import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, FileText, Video, Image, Filter, Upload } from 'lucide-react';

interface RefinementPanelProps {
  onRefine: (query: string, queryType: 'text' | 'video' | 'image', file?: File) => void;
  resultsCount: number;
}

export default function RefinementPanel({ onRefine, resultsCount }: RefinementPanelProps) {
  const [refinementQuery, setRefinementQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Array<'text' | 'video' | 'image'>>(['text']);
  const [refineVideoFile, setRefineVideoFile] = useState<File | null>(null);
  const [refineImageFile, setRefineImageFile] = useState<File | null>(null);

  const handleRefine = () => {
    if (selectedTypes.includes('text') && refinementQuery.trim()) {
      onRefine(refinementQuery, 'text');
    }
    if (selectedTypes.includes('video') && refineVideoFile) {
      onRefine(refineVideoFile.name, 'video', refineVideoFile);
    }
    if (selectedTypes.includes('image') && refineImageFile) {
      onRefine(refineImageFile.name, 'image', refineImageFile);
    }
  };

  const handleFileUpload = (type: 'video' | 'image') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (type === 'video') {
      setRefineVideoFile(file);
    } else {
      setRefineImageFile(file);
    }
  };

  const getQueryTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  return (
    <Card className="refinement-panel animate-slide-up">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Refine Search
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            {resultsCount} result{resultsCount !== 1 ? 's' : ''} found
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Refinement Type Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Refine with:</Label>
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="refine-text"
                checked={selectedTypes.includes('text')}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setSelectedTypes(prev => isChecked ? Array.from(new Set([...prev, 'text'])) : prev.filter(t => t !== 'text'));
                }}
              />
              <Label htmlFor="refine-text" className="flex items-center gap-2 cursor-pointer">
                {getQueryTypeIcon('text')}
                Text
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="refine-video"
                checked={selectedTypes.includes('video')}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setSelectedTypes(prev => isChecked ? Array.from(new Set([...prev, 'video'])) : prev.filter(t => t !== 'video'));
                }}
              />
              <Label htmlFor="refine-video" className="flex items-center gap-2 cursor-pointer">
                {getQueryTypeIcon('video')}
                Video
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="refine-image"
                checked={selectedTypes.includes('image')}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setSelectedTypes(prev => isChecked ? Array.from(new Set([...prev, 'image'])) : prev.filter(t => t !== 'image'));
                }}
              />
              <Label htmlFor="refine-image" className="flex items-center gap-2 cursor-pointer">
                {getQueryTypeIcon('image')}
                Image
              </Label>
            </div>
          </div>
        </div>

        {/* Refinement Inputs */}
        <div className="space-y-3">
          {selectedTypes.includes('text') && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter additional search terms..."
                value={refinementQuery}
                onChange={(e) => setRefinementQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRefine()}
                className="flex-1"
              />
              <Input
                placeholder="Enter additional search terms..."
                value={refinementQuery}
                onChange={(e) => setRefinementQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRefine()}
                className="flex-1"
              />
            </div>
          )}

          {selectedTypes.includes('video') && (
            <div className="space-y-2">
              <Label htmlFor="refine-file-upload-video">Upload video clip</Label>
              <div className="relative">
                <Input
                  id="refine-file-upload-video"
                  type="file"
                  accept={'video/*'}
                  onChange={handleFileUpload('video')}
                />
                <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {refineVideoFile && (
                <p className="text-sm text-muted-foreground">Selected: {refineVideoFile.name}</p>
              )}
            </div>
          )}

          {selectedTypes.includes('image') && (
            <div className="space-y-2">
              <Label htmlFor="refine-file-upload-image">Upload image</Label>
              <div className="relative">
                <Input
                  id="refine-file-upload-image"
                  type="file"
                  accept={'image/*'}
                  onChange={handleFileUpload('image')}
                />
                <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {refineImageFile && (
                <p className="text-sm text-muted-foreground">Selected: {refineImageFile.name}</p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleRefine}
              disabled={
                !(
                  (selectedTypes.includes('text') && refinementQuery.trim().length > 0) ||
                  (selectedTypes.includes('video') && !!refineVideoFile) ||
                  (selectedTypes.includes('image') && !!refineImageFile)
                )
              }
              size="sm"
            >
              <Search className="h-4 w-4 mr-1" />
              Refine
            </Button>
          </div>
        </div>

        {/* Quick refinement suggestions */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Quick refinements:</Label>
          <div className="flex flex-wrap gap-2">
            {['presentation', 'meeting', 'demo', 'training', 'team'].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => {
                  setRefinementQuery(suggestion);
                  onRefine(suggestion, 'text');
                }}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}