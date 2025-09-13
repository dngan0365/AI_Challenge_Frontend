import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  FileSpreadsheet,
  Check
} from 'lucide-react';

interface CSVEntry {
  id: string;
  video_id: string;
  frame_idx: number;
  video_title?: string;
  added_at: string;
}

interface CSVManagerProps {
  className?: string;
}

function CSVManager({ className }: CSVManagerProps) {
  const [entries, setEntries] = useState<CSVEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingFrameIdx, setEditingFrameIdx] = useState<number>(0);
  const [newFrameIdx, setNewFrameIdx] = useState<string>('');

  // Add new entry
  const addEntry = useCallback((video_id: string, frame_idx: number, video_title?: string) => {
    const newEntry: CSVEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      video_id,
      frame_idx,
      video_title,
      added_at: new Date().toISOString()
    };
    
    setEntries(prev => [...prev, newEntry]);
    return true;
  }, []);

  // Remove entry
  const removeEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  // Start editing
  const startEditing = useCallback((entry: CSVEntry) => {
    setEditingId(entry.id);
    setEditingFrameIdx(entry.frame_idx);
  }, []);

  // Save edit
  const saveEdit = useCallback(() => {
    if (editingId) {
      setEntries(prev => prev.map(entry => 
        entry.id === editingId 
          ? { ...entry, frame_idx: editingFrameIdx }
          : entry
      ));
      setEditingId(null);
    }
  }, [editingId, editingFrameIdx]);

  // Cancel edit
  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingFrameIdx(0);
  }, []);

  // Add manual entry
  const addManualEntry = useCallback(() => {
    const frameIdx = parseInt(newFrameIdx);
    if (!isNaN(frameIdx) && frameIdx >= 0) {
      const videoId = `manual-${Date.now()}`;
      addEntry(videoId, frameIdx, 'Manual Entry');
      setNewFrameIdx('');
    }
  }, [newFrameIdx, addEntry]);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    if (entries.length === 0) return;

    const headers = ['video_id', 'frame_idx', 'video_title', 'added_at'];
    const csvData = [
      headers.join(','),
      ...entries.map(entry => [
        entry.video_id,
        entry.frame_idx,
        entry.video_title || '',
        entry.added_at
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `video_frames_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [entries]);

  // Clear all entries
  const clearAll = useCallback(() => {
    setEntries([]);
  }, []);

  // Expose addEntry function to parent components
  React.useImperativeHandle(React.createRef(), () => ({
    addEntry
  }), [addEntry]);

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileSpreadsheet className="h-5 w-5" />
            Video Frames CSV
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {entries.length} entries
          </Badge>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            onClick={exportToCSV} 
            disabled={entries.length === 0}
            size="sm"
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-2" />
            Export CSV
          </Button>
          <Button 
            onClick={clearAll} 
            disabled={entries.length === 0}
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            <Trash2 className="h-3 w-3 mr-2" />
            Clear All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Manual Entry */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Add Manual Entry</h4>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Frame index"
              value={newFrameIdx}
              onChange={(e) => setNewFrameIdx(e.target.value)}
              className="text-xs"
              min="0"
            />
            <Button 
              onClick={addManualEntry}
              size="sm"
              disabled={!newFrameIdx || isNaN(parseInt(newFrameIdx))}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>

        <Separator />

        {/* Entries List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Saved Entries</h4>
            {entries.length > 0 && (
              <span className="text-xs text-muted-foreground">
                Click frame index to edit
              </span>
            )}
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No entries yet</p>
              <p className="text-xs">Add videos from search results or manually</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {entries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground truncate">
                        {entry.video_title || entry.video_id}
                      </span>
                      <Badge variant="outline" className="text-xs shrink-0">
                        ID: {entry.video_id.slice(-8)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Frame:</span>
                      {editingId === entry.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={editingFrameIdx}
                            onChange={(e) => setEditingFrameIdx(parseInt(e.target.value) || 0)}
                            className="w-20 h-6 text-xs"
                            min="0"
                          />
                          <Button size="sm" onClick={saveEdit} className="h-6 w-6 p-0">
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={cancelEdit}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(entry)}
                          className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors"
                        >
                          {entry.frame_idx}
                          <Edit3 className="h-3 w-3 inline ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeEntry(entry.id)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Add videos from search results using the "Add to CSV" button</p>
          <p>• Click frame numbers to edit them inline</p>
          <p>• Export entries as CSV file for external use</p>
        </div>
      </CardContent>
    </Card>
  );
}

CSVManager.displayName = 'CSVManager';

export default CSVManager;

