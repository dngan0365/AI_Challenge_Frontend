// src/components/SearchPanel.tsx
import { useState, useRef } from 'react';
import { Search, Upload, Mic, Image, FileText, Loader2 } from 'lucide-react';
import { QueryRequest } from '@/services/api';

interface SearchPanelProps {
  onSearch: (query: QueryRequest) => Promise<void>;
  isLoading: boolean;
}

export default function SearchPanel({ onSearch, isLoading }: SearchPanelProps) {
  const [textQuery, setTextQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [asrText, setAsrText] = useState('');
  const [odJson, setOdJson] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'advanced'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const queryRequest: QueryRequest = {};

    // Add text query
    if (textQuery.trim()) {
      queryRequest.text_query = textQuery.trim();
    }

    // Add image query (convert to base64)
    if (imageFile) {
      try {
        const base64Image = await convertImageToBase64(imageFile);
        queryRequest.image_query = base64Image;
      } catch (error) {
        console.error('Failed to convert image:', error);
        return;
      }
    }

    // Add optional fields
    if (ocrText.trim()) {
      queryRequest.ocr_text = ocrText.trim();
    }

    if (asrText.trim()) {
      queryRequest.asr_text = asrText.trim();
    }

    if (odJson.trim()) {
      queryRequest.od_json = odJson.trim();
    }

    // Ensure at least one query parameter is provided
    if (!queryRequest.text_query && !queryRequest.image_query && !queryRequest.ocr_text && !queryRequest.asr_text && !queryRequest.od_json) {
      alert('Please provide at least one search parameter');
      return;
    }

    await onSearch(queryRequest);
  };

  const TabButton = ({ tab, icon: Icon, label }: { tab: string, icon: any, label: string }) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab as any)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
          <TabButton tab="text" icon={Search} label="Text Search" />
          <TabButton tab="image" icon={Image} label="Image Search" />
          <TabButton tab="advanced" icon={FileText} label="Advanced" />
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {/* Text Search Tab */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="text-query" className="block text-sm font-medium mb-2">
                  Describe what you're looking for
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <textarea
                    id="text-query"
                    value={textQuery}
                    onChange={(e) => setTextQuery(e.target.value)}
                    placeholder="e.g., 'a person riding a bicycle in a park' or 'red car on a highway'"
                    className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Image Search Tab */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload an image to search for similar content
                </label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  {imageFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Preview"
                          className="max-h-32 rounded-lg"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{imageFile.name}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="text-sm text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload an image or drag and drop
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-primary hover:underline"
                      >
                        Choose file
                      </button>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {/* Text query option in image tab */}
              <div>
                <label htmlFor="image-text-query" className="block text-sm font-medium mb-2">
                  Additional text description (optional)
                </label>
                <input
                  id="image-text-query"
                  type="text"
                  value={textQuery}
                  onChange={(e) => setTextQuery(e.target.value)}
                  placeholder="Describe what you're looking for..."
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="text-query-advanced" className="block text-sm font-medium mb-2">
                  Text Query
                </label>
                <input
                  id="text-query-advanced"
                  type="text"
                  value={textQuery}
                  onChange={(e) => setTextQuery(e.target.value)}
                  placeholder="Text description..."
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="ocr-text" className="block text-sm font-medium mb-2">
                  OCR Text (text found in images)
                </label>
                <input
                  id="ocr-text"
                  type="text"
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                  placeholder="Text that appears in the video..."
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="asr-text" className="block text-sm font-medium mb-2">
                  ASR Text (speech/audio transcription)
                </label>
                <input
                  id="asr-text"
                  type="text"
                  value={asrText}
                  onChange={(e) => setAsrText(e.target.value)}
                  placeholder="Spoken words or audio content..."
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="od-json" className="block text-sm font-medium mb-2">
                  Object Detection JSON
                </label>
                <textarea
                  id="od-json"
                  value={odJson}
                  onChange={(e) => setOdJson(e.target.value)}
                  placeholder='{"objects": [{"name": "person", "confidence": 0.9}, {"name": "car", "confidence": 0.8}]}'
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Search Videos
            </>
          )}
        </button>
      </form>
    </div>
  );
}