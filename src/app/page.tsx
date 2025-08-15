'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import HomePage from '@/components/HomePage'
import SearchSection from '@/components/SearchSection'
import ChatSection from '@/components/ChatSection'

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage />
      case 'text':
        return <SearchSection type="text" />
      case 'image':
        return <SearchSection type="image" />
      case 'video':
        return <SearchSection type="video" />
      case 'audio':
        return <SearchSection type="audio" />
      case 'map':
        return <SearchSection type="map" />
      case 'temporal':
        return <SearchSection type="temporal" />
      case 'clustering':
        return <SearchSection type="clustering" />
      case 'chat':
        return <ChatSection />
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Cài đặt hệ thống</h2>
              <p className="text-gray-600">Trang cài đặt đang được phát triển...</p>
            </div>
          </div>
        )
      default:
        return <HomePage />
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  )
}
