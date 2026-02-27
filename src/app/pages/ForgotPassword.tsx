import { AlertCircle, ArrowLeft, Lock, Phone, Shield } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

export default function ForgotPassword(): React.JSX.Element {
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { sendOTP, loginWithOTP } = useAuth()
  const navigate = useNavigate()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await sendOTP(mobile, 'reset')
      setOtpSent(true)
      // If OTP is included in response (mock mode), show it to user
      if (
        response.otp !== null &&
        response.otp !== undefined &&
        response.otp.length > 0
      ) {
        setError(`کد تایید: ${response.otp}`)
      } else {
        setError('کد تایید ارسال شد')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'خطا در ارسال کد تایید')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // For now, we'll just verify the OTP and allow password reset
      // In a real implementation, you might want a separate verify endpoint
      await loginWithOTP(mobile, otp)
      setOtpVerified(true)
      setError('کد تایید صحیح است. لطفاً رمز عبور جدید را وارد کنید.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'کد تایید نادرست است')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('رمز عبور و تأیید آن مطابقت ندارند')
      return
    }

    if (newPassword.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد')
      return
    }

    setLoading(true)

    try {
      await resetPassword(mobile, otp, newPassword)
      setError('رمز عبور با موفقیت تغییر یافت')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'خطا در تغییر رمز عبور')
    } finally {
      setLoading(false)
    }
  }

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
              <Lock className="text-white" size={40} />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              بازیابی رمز عبور
            </h1>
            <p className="text-gray-600">
              رمز عبور خود را با کد یکبار مصرف بازیابی کنید
            </p>
          </div>

          {/* Back button */}
          <Link
            to="/login"
            className="flex items-center gap-2 text-[#667eea] hover:text-[#764ba2] transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            بازگشت به ورود
          </Link>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-4 p-4 rounded-xl flex items-start gap-3 ${
                  error.includes('کد تایید:') ||
                  error.includes('صحیح') ||
                  error.includes('موفقیت')
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <AlertCircle
                  className={
                    error.includes('کد تایید:') ||
                    error.includes('صحیح') ||
                    error.includes('موفقیت')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                  size={20}
                />
                <p
                  className={`text-sm ${
                    error.includes('کد تایید:') ||
                    error.includes('صحیح') ||
                    error.includes('موفقیت')
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}
                >
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="min-h-[300px]">
            {/* Step 1: Send OTP */}
            {!otpSent && (
              <motion.form
                key="send-otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSendOTP}
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
                      onChange={e => setMobile(e.target.value)}
                      placeholder="09123456789"
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all"
                      required
                    />
                    <Phone
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
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
              </motion.form>
            )}

            {/* Step 2: Verify OTP */}
            {otpSent && !otpVerified && (
              <motion.form
                key="verify-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleVerifyOTP}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    کد تایید
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="کد ۴ رقمی را وارد کنید"
                      maxLength={4}
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all text-center text-2xl tracking-widest"
                      required
                    />
                    <Shield
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                >
                  {loading ? 'در حال تایید...' : 'تایید کد'}
                </motion.button>

                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-center text-gray-600 hover:text-[#667eea] text-sm font-medium"
                >
                  ویرایش شماره موبایل
                </button>
              </motion.form>
            )}

            {/* Step 3: Reset Password */}
            {otpVerified && (
              <motion.form
                key="reset-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رمز عبور جدید
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="رمز عبور جدید را وارد کنید"
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all"
                      required
                      minLength={6}
                    />
                    <Lock
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تأیید رمز عبور جدید
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="رمز عبور جدید را مجدداً وارد کنید"
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all"
                      required
                      minLength={6}
                    />
                    <Lock
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                >
                  {loading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                </motion.button>
              </motion.form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
