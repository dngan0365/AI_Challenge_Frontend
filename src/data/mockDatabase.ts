export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  duration: string;
  eventId: string;
  uploadDate: string;
  category: string;
  resolution: string;
  fileSize: string;
  video_id: string;
  frame_number: number;
  timestamp_ms: number;
  metadata: {
    watch_url: string;
    video_url: string;
    thumbnail_url: string;
    asr_text?: string;
    objects?: Array<{ name: string, score: number }>;
    location?: string;
  };
  score?: number;
  rank?: number;
}

export const mockVideoDatabase: VideoMetadata[] = [];

export function searchVideos(query: string, queryType: 'text' | 'video' | 'image'): VideoMetadata[] {
  if (!query.trim()) return mockVideoDatabase;

  const searchTerms = query.toLowerCase().split(' ');

  return mockVideoDatabase.filter(video => {
    // Build comprehensive search text including metadata
    const searchText = `${video.title} ${video.description} ${video.tags.join(' ')} ${video.category}`.toLowerCase();

    // Add ASR text if available
    const asrText = video.metadata?.asr_text || '';
    const fullSearchText = `${searchText} ${asrText}`.toLowerCase();

    // Add object names if available
    const objectNames = video.metadata?.objects?.map(obj => obj.name).join(' ') || '';
    const location = video.metadata?.location || '';
    const completeSearchText = `${fullSearchText} ${objectNames} ${location}`.toLowerCase();

    // For text queries, match against all available text fields
    if (queryType === 'text') {
      return searchTerms.some(term => completeSearchText.includes(term));
    }

    // For video/image queries, simulate content-based matching
    if (queryType === 'video' || queryType === 'image') {
      // Simulate matching based on visual content keywords
      const visualKeywords = ['demo', 'presentation', 'showcase', 'workshop', 'meeting', 'bicycle', 'person'];
      return searchTerms.some(term =>
        completeSearchText.includes(term) ||
        visualKeywords.some(keyword => completeSearchText.includes(keyword))
      );
    }

    return false;
  });
}

export function refineSearch(currentResults: VideoMetadata[], refinementQuery: string, queryType: 'text' | 'video' | 'image'): VideoMetadata[] {
  if (!refinementQuery.trim()) return currentResults;

  const searchTerms = refinementQuery.toLowerCase().split(' ');

  return currentResults.filter(video => {
    const searchText = `${video.title} ${video.description} ${video.tags.join(' ')} ${video.category}`.toLowerCase();
    return searchTerms.some(term => searchText.includes(term));
  });
}

// --- MOCK KEYFRAME SEARCH (for UI testing like real API) ---

export interface MockQueryResult {
  keyframe_id: string;
  video_id: string;
  frame_number: number;
  timestamp_ms: number;
  image_url: string;
  metadata: Record<string, any>;
  rank: number;
  score: number;
}

function secondsToMs(seconds: number): number {
  return Math.floor(seconds * 1000);
}

function msToFrame(timestampMs: number, fps = 30): number {
  return Math.floor((timestampMs / 1000) * fps);
}

function timestampToMs(timestamp: string): number {
  // Format: HH:MM:SS
  const parts = timestamp.split(':').map(p => parseInt(p, 10));
  if (parts.length !== 3 || parts.some(isNaN)) return 0;
  const [hh, mm, ss] = parts;
  return secondsToMs(hh * 3600 + mm * 60 + ss);
}

// Very simple parser: supports keywords, location:"...", objects:"a,b"
function parseQuery(text: string): { terms: string[]; location?: string; objects: string[] } {
  const q = text.toLowerCase();
  const terms: string[] = [];
  let location: string | undefined;
  const objects: string[] = [];

  // Extract filters first
  const locMatch = q.match(/location\s*:\s*([^,;\n]+)/);
  if (locMatch) location = locMatch[1].trim();

  const objMatch = q.match(/objects?\s*:\s*([^\n]+)/);
  if (objMatch) {
    objMatch[1].split(/[;,]/).forEach(o => {
      const t = o.trim();
      if (t) objects.push(t);
    });
  }

  // Remove filter segments before collecting general terms
  const qWithoutFilters = q
    .replace(/location\s*:\s*[^,;\n]+/g, ' ')
    .replace(/objects?\s*:\s*[^\n]+/g, ' ');

  qWithoutFilters.split(/\s+/).forEach(t => {
    if (t && !t.includes(':') && !t.includes(',') && !t.includes(';') && t.length > 1) {
      terms.push(t);
    }
  });

  return { terms, location, objects };
}

// Build three keyframes per video with fake timestamps and image urls
function buildKeyframesForVideo(video: VideoMetadata, rankBase: number): MockQueryResult[] {
  const videoId = video.id;
  const durationSec = 60; // mock 60s duration baseline
  const keyframeSeconds = [5, 15, 30];
  return keyframeSeconds.map((sec, i) => {
    const ts = secondsToMs(Math.min(sec, durationSec));
    return {
      keyframe_id: `${videoId}_kf_${i + 1}`,
      video_id: videoId,
      frame_number: msToFrame(ts, 30),
      timestamp_ms: ts,
      image_url: video.thumbnail,
      metadata: {
        title: video.title,
        description: video.description,
        tags: video.tags,
        location: (video.description.match(/location:\s*([^\.]+)/i)?.[1] || '').trim(),
        objects: (video.description.match(/objects:\s*([^\.]+)/i)?.[1] || '').split(',').map(s => s.trim()).filter(Boolean),
        // Public sample video URL for demo playback
        video_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Videos_L21_a/video/L21_V001.mp4',
        // Also provide a YouTube-like watch URL to demo iframe embedding & start time
        watch_url: 'https://www.youtube.com/watch?v=-3DpZteWZW4',
        thumbnail_url: 'https://i.ytimg.com/vi/-3DpZteWZW4/sddefault.jpg',
      },
      rank: rankBase + i,
      score: Math.max(0.5, 0.9 - i * 0.1),
    } as MockQueryResult;
  });
}

export function mockSearchKeyframes(queryText: string): MockQueryResult[] {
  const { terms, location, objects } = parseQuery(queryText || '');

  // Score videos by matching in title/description/tags/category/location/objects
  let candidates = mockVideoDatabase.map((video) => {
    const text = `${video.title} ${video.description} ${video.tags.join(' ')} ${video.category}`.toLowerCase();
    let score = 0;
    if (terms.length) {
      score += terms.reduce((s, t) => s + (text.includes(t) ? 1 : 0), 0);
    }
    if (location) {
      score += text.includes(location) ? 2 : 0;
    }
    if (objects.length) {
      objects.forEach(o => { if (text.includes(o)) score += 1; });
    }
    return { video, score };
  });

  // If no filters provided or no matches, return a small demo set
  const hasFilters = (terms.length + (location ? 1 : 0) + objects.length) > 0;
  if (hasFilters) {
    candidates = candidates.filter(v => v.score > 0);
  }
  if (!hasFilters || candidates.length === 0) {
    candidates = mockVideoDatabase.slice(0, 4).map(v => ({ video: v, score: 1 }));
  }

  // Expand to keyframes
  const results: MockQueryResult[] = [];
  candidates.sort((a, b) => b.score - a.score).forEach((c, idx) => {
    results.push(...buildKeyframesForVideo(c.video, idx * 3 + 1));
  });

  // Use provided real keyframes instead of fabricated ones
  const sampleKeyframes: MockQueryResult[] = [
    {
      keyframe_id: 'L23_V015_F074',
      video_id: 'L23_V015',
      frame_number: 9075,
      timestamp_ms: timestampToMs('00:06:03'),
      image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L23/keyframes/L23_V015/074.jpg',
      metadata: {
        id: 'L23_V015_F074',
        timestamp: '00:06:03',
        frame_idx: 9075,
        image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L23/keyframes/L23_V015/074.jpg',
        location: 'Ho Chi Minh',
        asr_text: 'ở góc quay này thì khá rõ nguyễn văn bình là người đã về trước',
        sound: 'Speech:0.85;Music:0.27;Outside, urban or manmade:0.00',
        objects: [
          { name: 'Bicycle', id: 1, score: 0.82, bbox: [0.18, 0.31, 0.32, 0.48], center: [0.25, 0.4], color: 'Gray' },
          { name: 'Person', id: 1, score: 0.74, bbox: [0.4, 0.21, 0.51, 0.44], center: [0.45, 0.33], color: 'Blue' },
          { name: 'Person', id: 2, score: 0.72, bbox: [0.2, 0.23, 0.3, 0.45], center: [0.25, 0.34], color: 'Black' },
          { name: 'Bicycle', id: 2, score: 0.71, bbox: [0.36, 0.3, 0.54, 0.48], center: [0.45, 0.39], color: 'Black' },
          { name: 'Person', id: 3, score: 0.69, bbox: [0.55, 0.2, 0.65, 0.43], center: [0.6, 0.31], color: 'Gray' },
          { name: 'Bicycle', id: 3, score: 0.68, bbox: [0.11, 0.31, 0.23, 0.48], center: [0.17, 0.39], color: 'Gray' },
          { name: 'Bicycle', id: 4, score: 0.58, bbox: [0.54, 0.29, 0.7, 0.48], center: [0.62, 0.38], color: 'Black' },
          { name: 'Bicycle wheel', id: 1, score: 0.52, bbox: [0.47, 0.36, 0.54, 0.49], center: [0.51, 0.42], color: 'Gray' },
          { name: 'Bicycle wheel', id: 2, score: 0.51, bbox: [0.26, 0.36, 0.32, 0.48], center: [0.29, 0.42], color: 'Gray' }
        ],
        title: 'LỜI KHẲNG ĐỊNH ĐẦY MẠNH MẼ TỪ ANH LONG - RIKUNOV  DIỄN BIẾN NHỮNG KM CUỐI CHẶNG 15',
        author: 'HTV Sports',
        length: 370,
        publish_date: '18/04/2024',
        duration: 370,
        channel_url: 'https://www.youtube.com/channel/UC_OBG47Y3PswSHnMWSlrgZA',
        watch_url: 'https://youtube.com/watch?v=6dJAWIYPpYs',
        thumbnail_url: 'https://i.ytimg.com/vi/6dJAWIYPpYs/sddefault.jpg?v=6621f9b0',
        video_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Videos_L23_a/video/L23_V015.mp4',
      },
      rank: 1,
      score: 23.238
    },
    {
      keyframe_id: 'L23_V016_F057',
      video_id: 'L23_V016',
      frame_number: 7025,
      timestamp_ms: timestampToMs('00:04:41'),
      image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L23/keyframes/L23_V016/057.jpg',
      metadata: {
        id: 'L23_V016_F057',
        timestamp: '00:04:41',
        frame_idx: 7025,
        image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L23/keyframes/L23_V016/057.jpg',
        location: 'TP.HCM',
        asr_text: 'những màn thi đấu xuất sắc của các tây đua quân khu bảy ở đoạn nước rút đã không mang về được quả ngọt như họ mong đợi',
        sound: 'Speech:0.96;Music:0.16;Outside, urban or manmade:0.00',
        objects: [
          { name: 'Bicycle', id: 1, score: 0.89, bbox: [0.72, 0.56, 0.83, 0.9], center: [0.77, 0.73], color: 'Gray' },
          { name: 'Bicycle', id: 2, score: 0.83, bbox: [0.26, 0.57, 0.35, 0.9], center: [0.31, 0.74], color: 'Gray' },
          { name: 'Bicycle', id: 3, score: 0.82, bbox: [0.12, 0.54, 0.21, 0.88], center: [0.16, 0.71], color: 'Gray' },
          { name: 'Bicycle helmet', id: 1, score: 0.8, bbox: [0.29, 0.38, 0.33, 0.48], center: [0.31, 0.43], color: 'Gray' },
          { name: 'Person', id: 1, score: 0.76, bbox: [0.71, 0.38, 0.83, 0.83], center: [0.77, 0.6], color: 'Gray' },
          { name: 'Bicycle', id: 4, score: 0.75, bbox: [0.04, 0.56, 0.12, 0.84], center: [0.08, 0.7], color: 'Gray' },
          { name: 'Bicycle', id: 5, score: 0.74, bbox: [0.42, 0.6, 0.49, 0.94], center: [0.46, 0.77], color: 'Gray' },
          { name: 'Bicycle', id: 6, score: 0.7, bbox: [0.59, 0.58, 0.68, 0.88], center: [0.64, 0.73], color: 'Gray' },
          { name: 'Bicycle', id: 7, score: 0.69, bbox: [0.52, 0.54, 0.59, 0.86], center: [0.56, 0.7], color: 'Gray' }
        ],
        title: 'NỖ LỰC TUYỆT VỜI CỦA LÊ NGUYỆT MINH - GIÚP TP.HCM NEW GROUP CÓ CHIẾN THẮNG CHẶNG ĐẦU TIÊN',
        author: 'HTV Sports',
        length: 336,
        publish_date: '19/04/2024',
        duration: 336,
        channel_url: 'https://www.youtube.com/channel/UC_OBG47Y3PswSHnMWSlrgZA',
        watch_url: 'https://youtube.com/watch?v=AxrWuYGHZ7U',
        thumbnail_url: 'https://i.ytimg.com/vi/AxrWuYGHZ7U/sddefault.jpg?v=66235268',
        video_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Videos_L23_a/video/L23_V016.mp4',
      },
      rank: 2,
      score: 23.258
    },
    {
      keyframe_id: 'L30_V028_F024',
      video_id: 'L30_V028',
      frame_number: 1541,
      timestamp_ms: timestampToMs('00:01:01'),
      image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L30/keyframes/L30_V028/024.jpg',
      metadata: {
        id: 'L30_V028_F024',
        timestamp: '00:01:01',
        frame_idx: 1541,
        image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L30/keyframes/L30_V028/024.jpg',
        location: 'Ho Chi Minh City',
        asr_text: 'rồi xong rồi bắt đầu nó kế tiếp là cái xe cu láp ý thứ hai là cái xe bốn thì',
        sound: 'Speech:1.00;Narration, monologue:0.01;Speech synthesizer:0.01',
        objects: [
          { name: 'Bicycle', id: 1, score: 0.83, bbox: [0.14, 0.02, 1.0, 0.95], center: [0.57, 0.49], color: 'Gray' },
          { name: 'Bicycle', id: 2, score: 0.7, bbox: [0.42, 0.0, 0.98, 0.58], center: [0.7, 0.29], color: 'Gray' },
          { name: 'Fashion accessory', id: 1, score: 0.53, bbox: [0.71, 0.58, 0.82, 0.84], center: [0.76, 0.71], color: 'Gray' },
          { name: 'Person', id: 1, score: 0.5, bbox: [0.55, 0.2, 0.99, 0.96], center: [0.77, 0.58], color: 'Gray' }
        ],
        title: 'Lan tỏa năng lượng tích cực 2024 Thỏa sức sáng tạo dù ở bất cứ độ tuổi nào',
        author: 'Báo Tuổi Trẻ',
        length: 245,
        publish_date: '13/09/2024',
        duration: 245,
        channel_url: 'https://www.youtube.com/channel/UC47WI-kZXFf0H_f7pvaNCEQ',
        watch_url: 'https://youtube.com/watch?v=zU7WeOX915I',
        thumbnail_url: 'https://i.ytimg.com/vi/zU7WeOX915I/sddefault.jpg?sqp=-oaymwEmCIAFEOAD8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgYShXMA8=&rs=AOn4CLBtiT7RhMc6AFrGukeFx4TukDNyBQ',
        video_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Videos_L30_a/video/L30_V028.mp4',

      },
      rank: 3,
      score: 23.305
    },
    {
      keyframe_id: 'L23_V003_F068',
      video_id: 'L23_V003',
      frame_number: 7577,
      timestamp_ms: timestampToMs('00:05:03'),
      image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L23/keyframes/L23_V003/068.jpg',
      metadata: {
        id: 'L23_V003_F068',
        timestamp: '00:05:03',
        frame_idx: 7577,
        image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L23/keyframes/L23_V003/068.jpg',
        location: 'Can Tho',
        asr_text: 'và qua bàha chặn đùa thì bê tơ đi cu nớp gồn đã bỏ thúi cho mình bà a mươi giây thượng đó thật sự là một phon độ cực kỳ ấn tượng của tây đùa đàng trong mộc tiều và ông',
        sound: 'Music:0.53;Speech:0.30;Electronic music:0.07',
        objects: [
          { name: 'Bicycle', id: 1, score: 0.94, bbox: [0.56, 0.36, 1.0, 0.82], center: [0.78, 0.59], color: 'Gray' },
          { name: 'Bicycle', id: 2, score: 0.93, bbox: [0.0, 0.31, 0.21, 0.6], center: [0.11, 0.46], color: 'Gray' },
          { name: 'Bicycle', id: 3, score: 0.86, bbox: [0.36, 0.37, 0.67, 0.7], center: [0.51, 0.54], color: 'Black' },
          { name: 'Bicycle helmet', id: 1, score: 0.68, bbox: [0.85, 0.13, 0.92, 0.24], center: [0.89, 0.19], color: 'Gray' },
          { name: 'Person', id: 1, score: 0.58, bbox: [0.03, 0.18, 0.16, 0.5], center: [0.09, 0.34], color: 'Gray' },
          { name: 'Bicycle wheel', id: 1, score: 0.55, bbox: [0.1, 0.4, 0.21, 0.6], center: [0.15, 0.5], color: 'Gray' },
          { name: 'Bicycle wheel', id: 2, score: 0.52, bbox: [0.84, 0.5, 1.0, 0.85], center: [0.92, 0.67], color: 'White' },
          { name: 'Bicycle wheel', id: 3, score: 0.52, bbox: [0.58, 0.49, 0.76, 0.83], center: [0.67, 0.66], color: 'Gray' }
        ],
        title: '🔥🔥 QUÁ KHỦNG KHIẾP VỚI CÚ HATTRICK CỦA ANH LONG - PETR RIKUNOV  DIỄN BIẾN NHỮNG VÒNG ĐUA CUỐI',
        author: 'HTV Sports',
        length: 310,
        publish_date: '04/04/2024',
        duration: 310,
        channel_url: 'https://www.youtube.com/channel/UC_OBG47Y3PswSHnMWSlrgZA',
        watch_url: 'https://youtube.com/watch?v=Btr8jXBzZXE',
        thumbnail_url: 'https://i.ytimg.com/vi/Btr8jXBzZXE/sddefault.jpg?v=660f7e86',
        video_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Videos_L23_a/video/L23_V003.mp4',

      },
      rank: 4,
      score: 23.329
    },
    {
      keyframe_id: 'L23_V022_F040',
      video_id: 'L23_V022',
      frame_number: 4766,
      timestamp_ms: timestampToMs('00:03:10'),
      image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L23/keyframes/L23_V022/040.jpg',
      metadata: {
        id: 'L23_V022_F040',
        timestamp: '00:03:10',
        frame_idx: 4766,
        image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L23/keyframes/L23_V022/040.jpg',
        location: 'Can Tho',
        asr_text: '',
        sound: '',
        objects: [
          { name: 'Bicycle', id: 1, score: 0.91, bbox: [0.24, 0.72, 0.34, 0.99], center: [0.29, 0.86], color: 'Gray' },
          { name: 'Bicycle helmet', id: 1, score: 0.84, bbox: [0.6, 0.42, 0.66, 0.49], center: [0.63, 0.45], color: 'White' },
          { name: 'Bicycle', id: 2, score: 0.81, bbox: [0.77, 0.44, 0.84, 0.72], center: [0.8, 0.58], color: 'Gray' },
          { name: 'Bicycle helmet', id: 2, score: 0.77, bbox: [0.64, 0.39, 0.68, 0.45], center: [0.66, 0.42], color: 'White' },
          { name: 'Bicycle helmet', id: 3, score: 0.74, bbox: [0.28, 0.43, 0.33, 0.51], center: [0.3, 0.47], color: 'Gray' },
          { name: 'Car', id: 1, score: 0.68, bbox: [0.8, 0.14, 1.0, 0.62], center: [0.9, 0.38], color: 'Gray' },
          { name: 'Bicycle', id: 3, score: 0.65, bbox: [0.59, 0.71, 0.71, 0.99], center: [0.65, 0.85], color: 'Gray' },
          { name: 'Person', id: 1, score: 0.64, bbox: [0.94, 0.43, 1.0, 0.99], center: [0.97, 0.71], color: 'Gray' },
          { name: 'Bicycle helmet', id: 4, score: 0.59, bbox: [0.27, 0.21, 0.31, 0.28], center: [0.29, 0.25], color: 'White' },
          { name: 'Bicycle', id: 4, score: 0.56, bbox: [0.42, 0.63, 0.57, 1.0], center: [0.49, 0.81], color: 'Gray' },
          { name: 'Bicycle', id: 5, score: 0.53, bbox: [0.42, 0.67, 0.52, 1.0], center: [0.47, 0.83], color: 'Gray' }
        ],
        title: 'MARTIN LAAS CÓ THÊM CHIẾN THẮNG CHẶNG ĐẦY NẮNG NÓNG TẠI TP. CẦN THƠ  DIỄN BIẾN NHỮNG KM CUỐI C22',
        author: 'HTV Sports',
        length: 365,
        publish_date: '27/04/2024',
        duration: 365,
        channel_url: 'https://www.youtube.com/channel/UC_OBG47Y3PswSHnMWSlrgZA',
        watch_url: 'https://youtube.com/watch?v=A4GVOdnoIDU',
        thumbnail_url: 'https://i.ytimg.com/vi/A4GVOdnoIDU/sddefault.jpg?sqp=-oaymwEmCIAFEOAD8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgZShlMA8=&rs=AOn4CLA_RWML8r8NE_CHH-N51uYd1AtLJg',
        video_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Videos_L23_a/video/L23_V022.mp4',

      },
      rank: 5,
      score: 23.354
    }
    ,
    {
      keyframe_id: 'L22_V020_F282',
      video_id: 'L22_V020',
      frame_number: 35150,
      timestamp_ms: timestampToMs('00:19:31'),
      image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L22/keyframes/L22_V020/282.jpg',
      metadata: {
        id: 'L22_V020_F282',
        timestamp: '00:19:31',
        frame_idx: 35150,
        image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L22/keyframes/L22_V020/282.jpg',
        location: 'Da Nang',
        asr_text: 'tại giải đui xe đạp bla vu en ta tây đua người bỹ bút v nét dành chiến thắng chặn ba để tiếp tục dẫn đầu bản tậm sóc chặng ba dài một trăm chín mươi mốt phẩy hai ki lô mét từ lu sa đến cát ti lô đa nan cô',
        sound: 'Speech:0.86;Outside, urban or manmade:0.02;Boiling:0.01',
        objects: { 'Clothing': 1, 'Man': 1, 'Human face': 1, 'Bicycle': 1, 'Segway': 1 },
        title: '60 Giây Chiều - Ngày 20082024 - HTV Tin Tức Mới Nhất 2024',
        author: '60 Giây Official',
        length: 1299,
        publish_date: '21/08/2024',
        duration: 1299,
        channel_url: 'https://www.youtube.com/channel/UCRjzfa1E0gA50lvDQipbDMg',
        watch_url: 'https://youtube.com/watch?v=60qHcTBp6VY',
        thumbnail_url: 'https://i.ytimg.com/vi/60qHcTBp6VY/sddefault.jpg?v=66c55ade',
        video_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Videos_L22_a/video/L22_V020.mp4',

      },
      rank: 6,
      score: 23.412
    },
    {
      keyframe_id: 'L30_V001_F004',
      video_id: 'L30_V001',
      frame_number: 290,
      timestamp_ms: timestampToMs('00:00:11'),
      image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L30/keyframes/L30_V001/004.jpg',
      metadata: {
        id: 'L30_V001_F004',
        timestamp: '00:00:11',
        frame_idx: 290,
        image_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Keyframes_L30/keyframes/L30_V001/004.jpg',
        location: 'Ho Chi Minh City',
        asr_text: 'thì đây là một số chiếc xe mà mình nhận được các màn hành qủuanh về một số tì đá pờ phong rôi sau khi hoàn tên vên mình sẽ người tặng ch các bạn học sin ngờ các vùng sau nxa có hoàn cản đặc biệt khó khăn còn người ngh bà nàythan rồi ành có hông có việc à nhưng mà cũng không so mình không quan tâm tì cơ bản là mình b ờ mình thấy vui và mình có thể giốt quyết được cho người khác trong căn phòng trò chưa đầy hai mươi lăm mết phưôn quanh nô chiến thắng ba mươi mốt tuổi ngộn vùn chín thành phố hồ chí minh để ắp những chiếc xe đạp cũ và phụ tùng đó là những chiếc xe đạp thắng cùng bạn bè thu gơm ở khắp nơi trong thành phố về tân trang sửa lỗi họng hóc thầy mới các phụ tùng hư cũ để tặp cho các em học sinh người lao động có hoàn cảnh khó khăn đang cần xe đạp để đến trường và lạp việt là nhân viên kỹ thuật của một công ty công nghệ ở thành phố hồ chí minh ngoài làm đêm ở công ty thắng dành thời gian còn lại để sửa xe đạp',
        sound: 'Speech:0.45;Music:0.40;Musical instrument:0.02',
        objects: [
          { name: 'Window', id: 1, score: 0.8, bbox: [0.0, 0.0, 0.09, 0.42], center: [0.04, 0.21], color: 'Gray' },
          { name: 'Window', id: 2, score: 0.74, bbox: [0.2, 0.0, 0.25, 0.47], center: [0.22, 0.24], color: 'Gray' },
          { name: 'Person', id: 1, score: 0.71, bbox: [0.54, 0.43, 0.66, 0.78], center: [0.6, 0.61], color: 'Gray' },
          { name: 'Bicycle', id: 1, score: 0.56, bbox: [0.52, 0.54, 0.66, 0.78], center: [0.59, 0.66], color: 'Gray' },
          { name: 'Door', id: 1, score: 0.52, bbox: [0.19, 0.0, 0.28, 0.94], center: [0.23, 0.47], color: 'Gray' }
        ],
        title: 'Lan tỏa năng lượng tích cực 2024 Chàng trai ‘hồi sinh’ xe đạp tặng người nghèo',
        author: 'Báo Tuổi Trẻ',
        length: 127,
        publish_date: '10/10/2024',
        duration: 127,
        channel_url: 'https://www.youtube.com/channel/UC47WI-kZXFf0H_f7pvaNCEQ',
        watch_url: 'https://youtube.com/watch?v=-3DpZteWZW4',
        thumbnail_url: 'https://i.ytimg.com/vi/-3DpZteWZW4/sddefault.jpg?sqp=-oaymwEmCIAFEOAD8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGE8gWChlMA8=&rs=AOn4CLDKyQ2kjDkVhrajb4ZdlWm-YVYn1Q',
        video_url: 'https://storage.googleapis.com/test-video-retrieval/dataset/unzips/Videos_L30_a/video/L30_V001.mp4',

      },
      rank: 7,
      score: 23.507
    }
  ];

  // Merge results and sample keyframes
  let merged: MockQueryResult[] = [...sampleKeyframes, ...results];

  // Apply text-based filtering on keyframes when filters are provided
  const hasKeyframeFilters = (terms.length + (location ? 1 : 0) + objects.length) > 0;
  if (hasKeyframeFilters) {
    merged = merged.filter(kf => {
      const md = (kf.metadata || {}) as any;
      const textBlob = `${md.title || ''} ${md.asr_text || ''} ${md.location || ''}`.toLowerCase();

      // Gather object names from either array or object map
      let objectNames: string[] = [];
      if (Array.isArray(md.objects)) {
        objectNames = md.objects.map((o: any) => (o?.name || '').toString().toLowerCase()).filter(Boolean);
      } else if (md.objects && typeof md.objects === 'object') {
        objectNames = Object.keys(md.objects).map(n => n.toLowerCase());
      }

      // Terms: at least one term appears in text
      const termOk = terms.length === 0 || terms.some(t => textBlob.includes(t));

      // Location: simple contains check in text
      const locOk = !location || textBlob.includes(location.toLowerCase());

      // Objects: each requested object must appear in detected object names
      const objsOk = objects.length === 0 || objects.every((o: string) => objectNames.includes(o.toLowerCase()));

      return termOk && locOk && objsOk;
    });
  }

  return merged;

}