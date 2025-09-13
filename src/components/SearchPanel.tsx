// src/components/SearchPanel.tsx
import { useState, useRef } from 'react';
import { Search, Upload, Mic, Image, FileText, Loader2, AlertCircle } from 'lucide-react';
import { QueryRequest } from '@/services/api';

interface SearchPanelProps {
  onSearch: (query: QueryRequest) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

export default function SearchPanel({ onSearch, isLoading, disabled = false }: SearchPanelProps) {
  const [textQuery, setTextQuery] = useState('');
  const [imageQuery, setImageQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [asrText, setAsrText] = useState('');
  const [odJson, setOdJson] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'advanced'>('text');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (e.g., max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      setImageFile(file);
      setError(null);
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
    setError(null);

    if (disabled) {
      setError('Search is currently disabled. Please check API connection.');
      return;
    }

    const queryRequest: QueryRequest = {};

    // Handle text query
    if (textQuery.trim()) {
      queryRequest.text_query = textQuery.trim();
    }
    if (imageQuery.trim()) {
      queryRequest.image_query = imageQuery.trim();
    }

    // Handle OCR text
    if (ocrText.trim()) {
      queryRequest.ocr_text = ocrText.trim();
    }

    // Handle ASR text
    if (asrText.trim()) {
      queryRequest.asr_text = asrText.trim();
    }

    // Handle object detection JSON
    if (odJson.trim()) {
      try {
        // Validate JSON format
        JSON.parse(odJson.trim());
        queryRequest.od_json = odJson.trim();
      } catch (err) {
        setError('Invalid JSON format in Object Detection field');
        return;
      }
    }

    // Handle image upload
    if (imageFile) {
      try {
        const base64Image = await convertImageToBase64(imageFile);
        queryRequest.image = base64Image;
      } catch (error) {
        console.error('Failed to convert image:', error);
        setError('Failed to process image. Please try again.');
        return;
      }
    }

    // Ensure at least one query parameter is provided
    if (!queryRequest.text_query && !queryRequest.image_query && !queryRequest.image && !queryRequest.ocr_text && !queryRequest.asr_text && !queryRequest.od_json) {
      setError('Please provide at least one search parameter');
      return;
    }

    try {
      await onSearch(queryRequest);
    } catch (error) {
      setError('Search failed. Please try again.');
    }
  };

  const TabButton = ({ tab, icon: Icon, label }: { tab: string, icon: any, label: string }) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab as any)}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : activeTab === tab
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
        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

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
                  Describe what you're looking for by ocr, asr (audio transcription, music), objects:
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <textarea
                    id="text-query"
                    value={textQuery}
                    onChange={(e) => setTextQuery(e.target.value)}
                    disabled={disabled}
                    placeholder="e.g., Cuộc đua, lễ hội múa lân..."
                    className={`w-full pl-10 pr-2 py-2 border border-input bg-background rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    rows={3}
                  />
                </div>
                <label htmlFor="text-query" className="block text-sm font-medium mb-2">
                  Describe image (keyframe):
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <textarea
                    id="image-query"
                    value={imageQuery}
                    onChange={(e) => setImageQuery(e.target.value)}
                    disabled={disabled}
                    placeholder="e.g., person are in black clothing..."
                    className={`w-full pl-10 pr-2 py-2 border border-input bg-background rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
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
                <div className={`border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center ${
                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
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
                        disabled={disabled}
                        className="text-sm text-destructive hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <p className="text-xs text-muted-foreground mb-2">
                        Supported formats: JPG, PNG, GIF (max 10MB)
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                        className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Choose file
                      </button>
                    </div>
                  )}
                </div>
                <input
                  aria-label="Upload Image"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={disabled}
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
                  disabled={disabled}
                  placeholder="Describe what you're looking for..."
                  className={`w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
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
                  disabled={disabled}
                  placeholder="Text description..."
                  className={`w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
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
                  disabled={disabled}
                  placeholder="Text that appears in the video..."
                  className={`w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
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
                  disabled={disabled}
                  placeholder="Spoken words or audio content..."
                  className={`w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
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
                  disabled={disabled}
                  placeholder='{"objects": [{"name": "person", "confidence": 0.9}, {"name": "car", "confidence": 0.8}]}'
                  className={`w-full px-3 py-2 border border-input bg-background rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter valid JSON with object detection results
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || disabled}
          className={`w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            disabled ? 'bg-muted text-muted-foreground' : ''
          }`}
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

        {/* API Status Info */}
        {disabled && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Search is currently unavailable. Please check your API connection.</p>
          </div>
        )}
      </form>
    </div>
  );
}