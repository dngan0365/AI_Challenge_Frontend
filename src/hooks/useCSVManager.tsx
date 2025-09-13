import { useCallback, useState } from "react";

// Hook to use CSV manager across components
export function useCSVManager() {
  const [csvManager, setCSVManager] = useState<any>(null);
  
  const addToCSV = useCallback((video_id: string, frame_idx: number = 0, video_title?: string) => {
    if (csvManager && csvManager.addEntry) {
      return csvManager.addEntry(video_id, frame_idx, video_title);
    }
    return false;
  }, [csvManager]);

  return {
    csvManager,
    setCSVManager,
    addToCSV
  };
}