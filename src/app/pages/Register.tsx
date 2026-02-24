import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { User, Phone, Mail, Key, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    referralCode: '',
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.referralCode) {
      setError('کد معرف الزامی است');
      return;
    }
    
    setError('');
    setLoading(true);
    
    // Mock OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      setError('کد تایید: 1234');
    }, 500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp !== '1234') {
      setError('کد تایید نادرست است');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'خطا در ثبت‌نام');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">ثبت‌نام</h1>
            <p className="text-gray-600">عضویت در کمپین انتخاباتی</p>
          </div>

          {error && (
            <div className={`mb-4 p-3 border rounded-lg flex items-start gap-2 ${
              error.includes('1234') 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              {error.includes('1234') ? (
                <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${
                error.includes('1234') ? 'text-blue-800' : 'text-red-800'
              }`}>
                {error}
              </p>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام و نام خانوادگی <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="نام خود را وارد کنید"
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شماره موبایل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="09123456789"
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ایمیل (اختیاری)
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  کد معرف یا لینک دعوت <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    placeholder="کد معرف خود را وارد کنید"
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  برای تست: ALI2024 یا MARYAM2024
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  کد تایید
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1234"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={4}
                  required
                />
                <p className="text-sm text-gray-600 mt-2">
                  کد تایید به شماره {formData.mobile} ارسال شد
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'در حال ثبت‌نام...' : 'تایید و ثبت‌نام'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setError('');
                }}
                className="w-full text-blue-600 hover:text-blue-700 text-sm"
              >
                ویرایش اطلاعات
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-700 text-sm">
              حساب کاربری دارید؟ وارد شوید
            </Link>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-700 mb-2">
            <strong>توجه:</strong> ثبت‌نام فقط با دعوت‌نامه امکان‌پذیر است
          </p>
          <p className="text-xs text-gray-600">
            برای تست می‌توانید از کدهای معرف ALI2024 یا MARYAM2024 استفاده کنید
          </p>
        </div>
      </div>
    </div>
  );
}
