import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Search, Upload, Image, Video, FileText, Loader2 } from 'lucide-react';

interface SearchPanelProps {
  onSearch: (query: string, queryType: 'text' | 'video' | 'image', file?: File) => void;
  isLoading?: boolean;
}

export default function SearchPanel({ onSearch, isLoading = false }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Array<'text' | 'video' | 'image'>>(['text']);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const handleFileUpload = (type: 'video' | 'image') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'video') {
        setSelectedVideoFile(file);
      } else {
        setSelectedImageFile(file);
      }
    }
  };

  const handleSearch = () => {
    if (selectedTypes.includes('text') && query.trim()) {
      onSearch(query, 'text');
    }
    if (selectedTypes.includes('video') && selectedVideoFile) {
      onSearch(selectedVideoFile.name, 'video', selectedVideoFile);
    }
    if (selectedTypes.includes('image') && selectedImageFile) {
      onSearch(selectedImageFile.name, 'image', selectedImageFile);
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

  const hasValidText = selectedTypes.includes('text') && query.trim().length > 0;
  const hasValidVideo = selectedTypes.includes('video') && !!selectedVideoFile;
  const hasValidImage = selectedTypes.includes('image') && !!selectedImageFile;
  const isSearchDisabled = isLoading || !(hasValidText || hasValidVideo || hasValidImage);

  return (
    <Card className="search-panel animate-fade-in">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Search Video Database</h2>
          <p className="text-muted-foreground">
            Find specific events using text, video clips, or images
          </p>
        </div>

        {/* Query Type Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Query Types</Label>
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="text"
                checked={selectedTypes.includes('text')}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setSelectedTypes(prev => isChecked ? Array.from(new Set([...prev, 'text'])) : prev.filter(t => t !== 'text'));
                }}
              />
              <Label htmlFor="text" className="flex items-center gap-2 cursor-pointer">
                {getQueryTypeIcon('text')}
                Text Query
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="video"
                checked={selectedTypes.includes('video')}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setSelectedTypes(prev => isChecked ? Array.from(new Set([...prev, 'video'])) : prev.filter(t => t !== 'video'));
                }}
              />
              <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
                {getQueryTypeIcon('video')}
                Video Clip
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="image"
                checked={selectedTypes.includes('image')}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setSelectedTypes(prev => isChecked ? Array.from(new Set([...prev, 'image'])) : prev.filter(t => t !== 'image'));
                }}
              />
              <Label htmlFor="image" className="flex items-center gap-2 cursor-pointer">
                {getQueryTypeIcon('image')}
                Image
              </Label>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-3">
          {selectedTypes.includes('text') && (
            <div className="space-y-2">
              <Label htmlFor="text-query">Enter your search query</Label>
              <Input
                id="text-query"
                placeholder="e.g., 'AI presentation', 'team meeting', 'product launch'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12"
              />
            </div>
          )}

          {selectedTypes.includes('video') && (
            <div className="space-y-2">
              <Label htmlFor="file-upload-video">Upload video clip</Label>
              <div className="relative">
                <Input
                  id="file-upload-video"
                  type="file"
                  accept={'video/*'}
                  onChange={handleFileUpload('video')}
                  className="h-12 cursor-pointer"
                />
                <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {selectedVideoFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedVideoFile.name}
                </p>
              )}
            </div>
          )}

          {selectedTypes.includes('image') && (
            <div className="space-y-2">
              <Label htmlFor="file-upload-image">Upload image</Label>
              <div className="relative">
                <Input
                  id="file-upload-image"
                  type="file"
                  accept={'image/*'}
                  onChange={handleFileUpload('image')}
                  className="h-12 cursor-pointer"
                />
                <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {selectedImageFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedImageFile.name}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={isSearchDisabled}
          className="w-full h-12 gradient-primary hover:opacity-90 transition-opacity"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search Videos
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}