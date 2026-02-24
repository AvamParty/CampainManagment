import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Phone, Lock, AlertCircle, Sparkles, Zap, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const toggleRef = useRef<HTMLDivElement>(null);
  const passwordButtonRef = useRef<HTMLButtonElement>(null);
  const otpButtonRef = useRef<HTMLButtonElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const update = () => {
      const selectedButton =
        loginMethod === 'password' ? passwordButtonRef.current : otpButtonRef.current;
      if (!selectedButton) return;
      setPillStyle({
        left: selectedButton.offsetLeft,
        width: selectedButton.offsetWidth,
      });
    };

    update();
    const ro = new ResizeObserver(update);
    if (toggleRef.current) {
      ro.observe(toggleRef.current);
    }
    return () => ro.disconnect();
  }, [loginMethod]);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, loginWithOTP } = useAuth();
  const navigate = useNavigate();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(mobile, password);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.message || 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Mock OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      setError('کد تایید: 1234');
    }, 500);
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await loginWithOTP(mobile, otp);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.message || 'کد تایید نادرست است');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl mb-4 shadow-xl"
            >
              <Sparkles className="text-white" size={40} />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              حزب عوام ایران
            </h1>
            <p className="text-gray-600">ورود به سامانه کمپین</p>
          </div>

          {/* Login Method Toggle */}
          <div ref={toggleRef} className="relative flex gap-2 mb-6 bg-gray-100/80 backdrop-blur-xl p-1 rounded-2xl">
            {/* Sliding pill – animates horizontally (left to right / right to left) */}
            {pillStyle.width > 0 && (
              <motion.div
                className="absolute top-1 bottom-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl shadow-lg"
                style={{
                  width: pillStyle.width,
                  left: pillStyle.left,
                }}
                animate={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                }}
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <button
              ref={passwordButtonRef}
              onClick={() => {
                setLoginMethod('password');
                setOtpSent(false);
                setError('');
              }}
              className={`relative flex-1 py-3 px-4 rounded-xl transition-all font-medium z-10 ${
                loginMethod === 'password'
                  ? 'text-white'
                  : 'text-gray-600'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Lock size={18} />
                رمز عبور
              </span>
            </button>
            <button
              ref={otpButtonRef}
              onClick={() => {
                setLoginMethod('otp');
                setOtpSent(false);
                setError('');
              }}
              className={`relative flex-1 py-3 px-4 rounded-xl transition-all font-medium z-10 ${
                loginMethod === 'otp'
                  ? 'text-white'
                  : 'text-gray-600'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Zap size={18} />
                کد یکبار مصرف
              </span>
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-4 p-4 rounded-xl flex items-start gap-3 ${
                  error.includes('کد تایید: ')
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <AlertCircle
                  className={error.includes('کد تایید: ') ? 'text-green-600' : 'text-red-600'}
                  size={20}
                />
                <p className={`text-sm ${error.includes('کد تایید: ') ? 'text-green-800' : 'text-red-800'}`}>
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="min-h-[250px]">
            {/* Password Login Form */}
            {loginMethod === 'password' && (
              <motion.form
                key="password"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handlePasswordLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شماره موبایل
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="09123456789"
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all"
                      required
                    />
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رمز عبور
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="رمز عبور خود را وارد کنید"
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all"
                      required
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                >
                  {loading ? 'در حال ورود...' : 'ورود'}
                </motion.button>
              </motion.form>
            )}

            {/* OTP Login Form */}
            {loginMethod === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        شماره موبایل
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="09123456789"
                          className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all"
                          required
                        />
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                    >
                      {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
                    </motion.button>
                  </form>
                ) : (
                  <form onSubmit={handleOTPLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        کد تایید
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="کد 4 رقمی را وارد کنید"
                          maxLength={4}
                          className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all text-center text-2xl tracking-widest"
                          required
                        />
                        <Shield className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                    >
                      {loading ? 'در حال تایید...' : 'تایید و ورود'}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full text-center text-gray-600 hover:text-[#667eea] text-sm font-medium"
                    >
                      ویرایش شماره موبایل
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-medium text-blue-900 mb-2">اطلاعات ورود دمو:</p>
            <div className="text-xs text-blue-800 space-y-1">
              <p>موبایل: <span className="font-mono bg-white px-2 py-0.5 rounded">09123456789</span></p>
              <p>رمز: <span className="font-mono bg-white px-2 py-0.5 rounded">password123</span></p>
              <p>کد OTP: <span className="font-mono bg-white px-2 py-0.5 rounded">1234</span></p>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              حساب کاربری ندارید؟{' '}
              <Link
                to="/register"
                className="font-bold text-[#667eea] hover:text-[#764ba2] transition-colors"
              >
                ثبت‌نام کنید
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
