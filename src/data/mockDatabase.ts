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
}

export const mockVideoDatabase: VideoMetadata[] = [
  {
    id: "vid_001",
    title: "Tech Conference Opening Keynote",
    description: "CEO presenting new AI innovations and company roadmap for the next quarter",
    thumbnail: "/placeholder.svg?height=200&width=300",
    tags: ["technology", "AI", "innovation", "keynote", "CEO", "roadmap"],
    duration: "24:15",
    eventId: "EVT_TECH_2024_001",
    uploadDate: "2024-01-15",
    category: "Corporate",
    resolution: "1920x1080",
    fileSize: "485MB"
  },
  {
    id: "vid_002", 
    title: "Product Demo: Smart Analytics Dashboard",
    description: "Live demonstration of the new analytics platform with real-time data visualization",
    thumbnail: "/placeholder.svg?height=200&width=300",
    tags: ["product", "demo", "analytics", "dashboard", "data", "visualization"],
    duration: "18:42",
    eventId: "EVT_PROD_2024_002",
    uploadDate: "2024-01-18",
    category: "Product",
    resolution: "1920x1080", 
    fileSize: "312MB"
  },
  {
    id: "vid_003",
    title: "Team Building Workshop",
    description: "Interactive workshop focused on improving team collaboration and communication skills",
    thumbnail: "/placeholder.svg?height=200&width=300",
    tags: ["team building", "workshop", "collaboration", "communication", "training"],
    duration: "45:30",
    eventId: "EVT_TRAIN_2024_003",
    uploadDate: "2024-01-22",
    category: "Training",
    resolution: "1920x1080",
    fileSize: "890MB"
  },
  {
    id: "vid_004",
    title: "Marketing Campaign Launch",
    description: "Strategic presentation of Q1 marketing initiatives and campaign objectives",
    thumbnail: "/placeholder.svg?height=200&width=300", 
    tags: ["marketing", "campaign", "launch", "strategy", "Q1", "objectives"],
    duration: "32:18",
    eventId: "EVT_MKT_2024_004",
    uploadDate: "2024-01-25",
    category: "Marketing",
    resolution: "1920x1080",
    fileSize: "658MB"
  },
  {
    id: "vid_005",
    title: "Security Training Webinar",
    description: "Comprehensive cybersecurity awareness training covering latest threats and best practices",
    thumbnail: "/placeholder.svg?height=200&width=300",
    tags: ["security", "cybersecurity", "training", "webinar", "threats", "best practices"],
    duration: "28:45",
    eventId: "EVT_SEC_2024_005",
    uploadDate: "2024-01-28",
    category: "Training", 
    resolution: "1920x1080",
    fileSize: "545MB"
  },
  {
    id: "vid_006",
    title: "Customer Success Stories",
    description: "Client testimonials and case studies showcasing successful project implementations",
    thumbnail: "/placeholder.svg?height=200&width=300",
    tags: ["customer", "success", "testimonials", "case studies", "implementations"],
    duration: "21:33",
    eventId: "EVT_CUST_2024_006",
    uploadDate: "2024-02-01",
    category: "Customer",
    resolution: "1920x1080",
    fileSize: "428MB"
  },
  {
    id: "vid_007",
    title: "Financial Quarterly Review",
    description: "Detailed analysis of Q4 financial performance and projections for upcoming quarter",
    thumbnail: "/placeholder.svg?height=200&width=300",
    tags: ["financial", "quarterly", "review", "performance", "projections", "Q4"],
    duration: "36:22",
    eventId: "EVT_FIN_2024_007", 
    uploadDate: "2024-02-05",
    category: "Finance",
    resolution: "1920x1080",
    fileSize: "721MB"
  },
  {
    id: "vid_008",
    title: "Remote Work Best Practices",
    description: "Guidelines and tips for effective remote work collaboration and productivity",
    thumbnail: "/placeholder.svg?height=200&width=300",
    tags: ["remote work", "best practices", "collaboration", "productivity", "guidelines"],
    duration: "19:15",
    eventId: "EVT_HR_2024_008",
    uploadDate: "2024-02-08",
    category: "HR",
    resolution: "1920x1080",
    fileSize: "385MB"
  },
  {
    id: "vid_009",
    title: "Innovation Lab Showcase",
    description: "Presentation of cutting-edge research projects and experimental technologies",
    thumbnail: "/placeholder.svg?height=200&width=300",
    tags: ["innovation", "lab", "research", "experimental", "technologies", "showcase"],
    duration: "41:28",
    eventId: "EVT_INNO_2024_009",
    uploadDate: "2024-02-12",
    category: "Research",
    resolution: "1920x1080",
    fileSize: "825MB"
  },
  {
    id: "vid_010",
    title: "Global Team Meeting",
    description: "All-hands meeting with international teams discussing strategic initiatives",
    thumbnail: "/placeholder.svg?height=200&width=300",
    tags: ["global", "team meeting", "all-hands", "international", "strategic", "initiatives"],
    duration: "52:18",
    eventId: "EVT_GLOBAL_2024_010",
    uploadDate: "2024-02-15",
    category: "Corporate",
    resolution: "1920x1080",
    fileSize: "1.2GB"
  }
];

export function searchVideos(query: string, queryType: 'text' | 'video' | 'image'): VideoMetadata[] {
  if (!query.trim()) return mockVideoDatabase;
  
  const searchTerms = query.toLowerCase().split(' ');
  
  return mockVideoDatabase.filter(video => {
    const searchText = `${video.title} ${video.description} ${video.tags.join(' ')} ${video.category}`.toLowerCase();
    
    // For text queries, match against title, description, tags, and category
    if (queryType === 'text') {
      return searchTerms.some(term => searchText.includes(term));
    }
    
    // For video/image queries, simulate content-based matching
    // In a real implementation, this would use computer vision/ML
    if (queryType === 'video' || queryType === 'image') {
      // Simulate matching based on visual content keywords
      const visualKeywords = ['demo', 'presentation', 'showcase', 'workshop', 'meeting'];
      return searchTerms.some(term => 
        searchText.includes(term) || 
        visualKeywords.some(keyword => searchText.includes(keyword))
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