import { useNavigate } from 'react-router';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            صفحه یافت نشد
          </h2>
          <p className="text-gray-600">
            صفحه مورد نظر شما وجود ندارد یا منتقل شده است
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home size={20} />
            <span>بازگشت به داشبورد</span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowRight size={20} />
            <span>بازگشت به صفحه قبل</span>
          </button>
        </div>
      </div>
    </div>
  );
}
