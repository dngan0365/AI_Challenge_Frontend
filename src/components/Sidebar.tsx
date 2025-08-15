'use client'
import { useState } from 'react'
import { 
  Home, Search, Image, Video, Mic, MapPin, Clock, 
  Layers, Bot, Settings, Menu, X 
} from 'lucide-react'

const sidebarItems = [
  { icon: Home, label: 'Trang chủ', id: 'home' },
  { icon: Search, label: 'Tìm kiếm văn bản', id: 'text' },
  { icon: Image, label: 'Tìm kiếm hình ảnh', id: 'image' },
  { icon: Video, label: 'Tìm kiếm video', id: 'video' },
  { icon: Mic, label: 'Tìm kiếm âm thanh', id: 'audio' },
  { icon: MapPin, label: 'Tìm kiếm bản đồ', id: 'map' },
  { icon: Clock, label: 'Điều hướng thời gian', id: 'temporal' },
  { icon: Layers, label: 'Phân cụm cảnh', id: 'clustering' },
  { icon: Bot, label: 'Chat với AI', id: 'chat' },
  { icon: Settings, label: 'Cài đặt', id: 'settings' },
]

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={`bg-blue-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-blue-800 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold">AI Video Search</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <IconComponent size={20} />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}