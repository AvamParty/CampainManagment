import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { MapPin, GraduationCap, Briefcase, Star, Tag, Save, Edit, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    neighborhood: user?.profile.neighborhood || '',
    education: user?.profile.education || '',
    educationField: user?.profile.educationField || '',
    experience: user?.profile.experience || '',
    skills: user?.profile.skills?.join(', ') || '',
    interests: user?.profile.interests?.join(', ') || '',
  });

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
    };
    
    await updateProfile(profileData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">پروفایل کاربری</h1>
            <p className="text-gray-600">مدیریت اطلاعات شخصی</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={18} />
              <span className="hidden md:inline">{isEditing ? 'لغو' : 'ویرایش'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">خروج</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-600 mb-2">{user.mobile}</p>
              {user.email && <p className="text-gray-600 mb-2">{user.email}</p>}
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {user.role === 'admin' ? 'مدیر' : user.role === 'manager' ? 'سرپرست' : 'کاربر'}
                </div>
                <div className="text-sm text-gray-600">
                  کد معرف: <span className="font-mono font-bold">{user.referralCode}</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-50 px-6 py-4 rounded-xl">
                <p className="text-3xl font-bold text-yellow-600 mb-1">{user.points}</p>
                <p className="text-sm text-gray-600">امتیاز کل</p>
              </div>
            </div>
          </div>

          {/* Completion Bar */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">تکمیل پروفایل</span>
              <span className="text-sm font-bold text-blue-600">{user.profile.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${user.profile.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">اطلاعات تکمیلی</h3>
            
            <div className="space-y-6">
              {/* Neighborhood */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} />
                  محله / منطقه سکونت
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="مثلا: تهران، سعادت‌آباد"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">
                    {user.profile.neighborhood || 'وارد نشده'}
                  </p>
                )}
              </div>

              {/* Education */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap size={16} />
                    مقطع تحصیلی
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="دیپلم">دیپلم</option>
                      <option value="کاردانی">کاردانی</option>
                      <option value="کارشناسی">کارشناسی</option>
                      <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                      <option value="دکتری">دکتری</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">
                      {user.profile.education || 'وارد نشده'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap size={16} />
                    رشته تحصیلی
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.educationField}
                      onChange={(e) => setFormData({ ...formData, educationField: e.target.value })}
                      placeholder="مثلا: علوم سیاسی"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">
                      {user.profile.educationField || 'وارد نشده'}
                    </p>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Briefcase size={16} />
                  تجربه و سوابق
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="تجربیات و سوابق کاری/فعالیتی خود را بنویسید"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
                    {user.profile.experience || 'وارد نشده'}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Star size={16} />
                  مهارت‌ها
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="مهارت‌های خود را با کاما جدا کنید (مثلا: طراحی، برنامه‌نویسی، سخنرانی)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">مهارت‌ها را با کاما (,) از هم جدا کنید</p>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills && user.profile.skills.length > 0 ? (
                      user.profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 px-4 py-3">وارد نشده</p>
                    )}
                  </div>
                )}
              </div>

              {/* Interests */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag size={16} />
                  علاقه‌مندی‌های همکاری
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                      placeholder="حوزه‌های مورد علاقه برای مشارکت (مثلا: تحقیق، هماهنگی، طراحی)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">علاقه‌مندی‌ها را با کاما (,) از هم جدا کنید</p>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.profile.interests && user.profile.interests.length > 0 ? (
                      user.profile.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 px-4 py-3">وارد نشده</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <button
                type="submit"
                className="mt-6 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={20} />
                ذخیره تغییرات
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
