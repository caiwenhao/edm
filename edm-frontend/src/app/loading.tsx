import { Mail } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo with animation */}
        <div className="relative mb-6">
          <Mail className="h-12 w-12 text-blue-600 mx-auto animate-pulse" />
          <div className="absolute inset-0 h-12 w-12 mx-auto border-2 border-blue-200 rounded-full animate-ping"></div>
        </div>
        
        {/* Loading spinner */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        
        {/* Loading text */}
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          EDM智能投递网关
        </h2>
        <p className="text-gray-600">正在加载...</p>
      </div>
    </div>
  );
}
