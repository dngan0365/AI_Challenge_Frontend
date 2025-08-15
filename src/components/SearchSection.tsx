'use client'
import { useState } from 'react'
import { Search, Upload, Mic, Image as ImageIcon, Video, MapPin } from 'lucide-react'

type SearchResult = { id: number; title: string; duration: string; thumbnail: string }

export default function SearchSection({ type }: { type:  "map" | "text" | "image" | "video" | "audio" | "temporal" | "clustering" }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setResults([
        { id: 1, title: 'Video về chùa Thiên Mụ', duration: '5:32', thumbnail: '/api/placeholder/300/200' },
        { id: 2, title: 'Cảnh hoàng hôn trên biển', duration: '3:45', thumbnail: '/api/placeholder/300/200' },
        { id: 3, title: 'Cuộc họp trong phòng hội thảo', duration: '12:15', thumbnail: '/api/placeholder/300/200' }
      ])
      setIsLoading(false)
    }, 1500)
  }

  const getSearchConfig = (
    type: "map" | "text" | "image" | "video" | "audio" | "temporal" | "clustering"
  ) => {
    const configs = {
      text: {
        title: 'Tìm kiếm bằng văn bản',
        placeholder: 'Nhập câu hỏi hoặc mô tả video bạn muốn tìm...',
        icon: Search,
        description: 'Sử dụng ngôn ngữ tự nhiên để tìm kiếm video'
      },
      image: {
        title: 'Tìm kiếm bằng hình ảnh',
        placeholder: 'Tải lên hình ảnh để tìm video tương tự...',
        icon: ImageIcon,
        description: 'Tải lên ảnh để tìm video có cảnh tương tự'
      },
      video: {
        title: 'Tìm kiếm bằng video',
        placeholder: 'Tải lên video mẫu...',
        icon: Video,
        description: 'Tải lên video để tìm nội dung tương tự'
      },
      audio: {
        title: 'Tìm kiếm bằng âm thanh',
        placeholder: 'Ghi âm hoặc tải lên file âm thanh...',
        icon: Mic,
        description: 'Tìm video chứa âm thanh tương tự'
      },
      map: {
        title: 'Tìm kiếm theo vị trí',
        placeholder: 'Chọn vùng trên bản đồ...',
        icon: MapPin,
        description: 'Tìm video theo vị trí địa lý'
      }
    }
    // Fallback to 'text' config for unsupported types
    return configs[type as keyof typeof configs] || configs.text
  }

  const config = getSearchConfig(type)
  const IconComponent = config.icon

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <IconComponent size={32} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{config.title}</h2>
          <p className="text-gray-600">{config.description}</p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          {type === 'text' ? (
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={config.placeholder}
                className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200"
              >
                {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">{config.placeholder}</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Chọn file
              </button>
            </div>
          )}
        </div>

        {/* Search Results */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">AI đang phân tích và tìm kiếm...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <div key={result.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="bg-gray-300 h-40 rounded-lg mb-4 flex items-center justify-center">
                  <Video size={48} className="text-gray-500" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{result.title}</h3>
                <p className="text-sm text-gray-600">Thời lượng: {result.duration}</p>
                <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Xem video
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
