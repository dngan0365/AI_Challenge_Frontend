import { useState, useEffect } from 'react';
import { Search, MessageCircle, Map, Clock, Image, BarChart3, Play, ArrowRight, Sparkles, Bot } from 'lucide-react';

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const features = [
    {
      icon: Search,
      title: 'Tìm kiếm Thông minh',
      description: 'Chỉ cần gõ những gì bạn muốn tìm bằng ngôn ngữ tự nhiên - AI sẽ hiểu và tìm chính xác cho bạn',
      color: 'from-blue-500 to-cyan-500',
      demo: 'Thử: "Tìm cảnh có người đàn ông mặc áo đỏ"'
    },
    {
      icon: Image,
      title: 'Tìm bằng Hình ảnh',
      description: 'Upload ảnh hoặc chụp màn hình - hệ thống sẽ tìm những cảnh tương tự trong video',
      color: 'from-purple-500 to-pink-500',
      demo: 'Kéo thả ảnh vào đây để tìm kiếm'
    },
    {
      icon: MessageCircle,
      title: 'Chat với AI',
      description: 'Trò chuyện trực tiếp với AI Assistant như với một người bạn am hiểu về video',
      color: 'from-green-500 to-emerald-500',
      demo: 'Thử: "Có những cảnh nào thú vị nhất?"'
    },
    {
      icon: Map,
      title: 'Tìm theo Vị trí',
      description: 'Chọn khu vực trên bản đồ để tìm video được quay tại địa điểm đó',
      color: 'from-orange-500 to-red-500',
      demo: 'Click vào bản đồ để khoanh vùng'
    },
    {
      icon: Clock,
      title: 'Duyệt Thời gian',
      description: 'Tìm kiếm theo thứ tự sự kiện hoặc khoảng thời gian cụ thể',
      color: 'from-indigo-500 to-purple-500',
      demo: 'Thử: "Những gì xảy ra sau 10 phút đầu?"'
    },
    {
      icon: BarChart3,
      title: 'Phân tích Cảnh',
      description: 'Xem tổng quan và thống kê về nội dung video một cách trực quan',
      color: 'from-teal-500 to-blue-500',
      demo: 'Xem biểu đồ phân tích chi tiết'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-700 px-4 py-2 rounded-full mb-6 shadow-sm">
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium">Powered by Advanced AI</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Video Search
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Thông Minh
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Trải nghiệm cách thức hoàn toàn mới để tìm kiếm và khám phá nội dung video 
              với sức mạnh của AI
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Bắt đầu ngay
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button className="group flex items-center gap-3 text-gray-700 hover:text-blue-600 font-semibold transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Play className="w-5 h-5 ml-1" />
                </div>
                Xem demo
              </button>
            </div>

            {/* Search Preview */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 text-gray-500 mb-3">
                  <Search className="w-5 h-5" />
                  <span className="text-sm">Thử tìm kiếm:</span>
                </div>
                <div className="text-left">
                  <div className="bg-gray-50 rounded-xl p-4 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      {isTyping ? (
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      ) : (
                        <span className="text-gray-700">Tìm cảnh có người đang nấu ăn trong nhà bếp</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>AI đã tìm thấy 23 kết quả phù hợp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Features */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tính năng
            <span className="text-blue-600"> Đột phá</span>
          </h2>
          <p className="text-xl text-gray-600">Khám phá những cách thức tìm kiếm video chưa từng có</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <div
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`group cursor-pointer bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 ${
                    isActive ? 'border-blue-300 shadow-blue-100' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-500 italic border-l-4 border-blue-200">
                    {feature.demo}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Feature Showcase */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className={`h-48 bg-gradient-to-r ${features[activeFeature].color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative h-full flex items-center justify-center">
                    <div className="text-white text-center">
                      {(() => {
                        const ActiveIcon = features[activeFeature].icon;
                        return <ActiveIcon className="w-16 h-16 mx-auto mb-4" />;
                      })()}
                      <h3 className="text-2xl font-bold">{features[activeFeature].title}</h3>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Sparkles className="w-6 h-6 text-white/70 animate-pulse" />
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {features[activeFeature].description}
                  </p>
                  
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                    Thử ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sẵn sàng khám phá?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Hãy bắt đầu hành trình tìm kiếm video thông minh với AI ngay hôm nay
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Bắt đầu miễn phí
            </button>
            <button className="border-2 border-white/30 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300">
              Tìm hiểu thêm
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-12 text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">AI sẵn sàng 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Xử lý tức thời</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Độ chính xác cao</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}