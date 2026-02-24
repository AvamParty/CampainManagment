import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import {
  ArrowRight,
  Calendar,
  Award,
  AlertCircle,
  Upload,
  Send,
  CheckCircle,
  MapPin,
  Link as LinkIcon,
} from 'lucide-react';

export default function TaskDetail() {
  const { taskId } = useParams();
  const { user } = useAuth();
  const { tasks, userTasks, acceptTask, submitTask, getUserTaskStatus } = useTasks();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  if (!user || !taskId) return null;

  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">وظیفه یافت نشد</p>
          <button
            onClick={() => navigate('/tasks')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            بازگشت به لیست وظایف
          </button>
        </div>
      </div>
    );
  }

  const userTask = getUserTaskStatus(taskId, user.id);
  const canAccept = !userTask && (!task.requiresCompleteProfile || user.profile.completionPercentage === 100);

  const handleAccept = () => {
    acceptTask(taskId, user.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    submitTask(taskId, user.id, submission);
    setSubmitting(false);
    navigate('/tasks');
  };

  const renderSubmissionForm = () => {
    switch (task.type) {
      case 'opinion':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نظر شما
              </label>
              <textarea
                value={submission.opinion || ''}
                onChange={(e) => setSubmission({ ...submission, opinion: e.target.value })}
                placeholder="نظر خود را بنویسید..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        );

      case 'research':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                خلاصه تحقیق
              </label>
              <textarea
                value={submission.summary || ''}
                onChange={(e) => setSubmission({ ...submission, summary: e.target.value })}
                placeholder="خلاصه‌ای از یافته‌های تحقیق خود ارائه دهید..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                آپلود فایل تحقیق
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">فایل خود را بکشید یا کلیک کنید</p>
                <input type="file" className="hidden" />
              </div>
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام مسجد
              </label>
              <input
                type="text"
                value={submission.mosqueName || ''}
                onChange={(e) => setSubmission({ ...submission, mosqueName: e.target.value })}
                placeholder="نام مسجد را وارد کنید"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                آدرس
              </label>
              <textarea
                value={submission.address || ''}
                onChange={(e) => setSubmission({ ...submission, address: e.target.value })}
                placeholder="آدرس کامل"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شماره تماس
              </label>
              <input
                type="tel"
                value={submission.phone || ''}
                onChange={(e) => setSubmission({ ...submission, phone: e.target.value })}
                placeholder="شماره تماس"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        );

      case 'coordination':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام مکان/سازمان
              </label>
              <input
                type="text"
                value={submission.placeName || ''}
                onChange={(e) => setSubmission({ ...submission, placeName: e.target.value })}
                placeholder="نام مکان را وارد کنید"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شخص رابط
              </label>
              <input
                type="text"
                value={submission.contactPerson || ''}
                onChange={(e) => setSubmission({ ...submission, contactPerson: e.target.value })}
                placeholder="نام شخص رابط"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شماره تماس
              </label>
              <input
                type="tel"
                value={submission.contactPhone || ''}
                onChange={(e) => setSubmission({ ...submission, contactPhone: e.target.value })}
                placeholder="شماره تماس"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وضعیت هماهنگی
              </label>
              <textarea
                value={submission.status || ''}
                onChange={(e) => setSubmission({ ...submission, status: e.target.value })}
                placeholder="توضیحات هماهنگی انجام شده"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        );

      case 'event':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <MapPin className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">
                  تایید موقعیت مکانی
                </p>
                <p className="text-xs text-blue-800">
                  برای تایید حضور، موقعیت مکانی شما باید در محدوده رویداد باشد
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                // Mock location verification
                setSubmission({ 
                  ...submission, 
                  locationVerified: true,
                  timestamp: new Date().toISOString() 
                });
              }}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                submission.locationVerified
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {submission.locationVerified ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle size={20} />
                  موقعیت مکانی تایید شد
                </span>
              ) : (
                'تایید حضور در رویداد'
              )}
            </button>
          </div>
        );

      case 'referral':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                value={submission.referralName || ''}
                onChange={(e) => setSubmission({ ...submission, referralName: e.target.value })}
                placeholder="نام فرد معرفی شده"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شماره موبایل
              </label>
              <input
                type="tel"
                value={submission.referralPhone || ''}
                onChange={(e) => setSubmission({ ...submission, referralPhone: e.target.value })}
                placeholder="شماره موبایل"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات (اختیاری)
              </label>
              <textarea
                value={submission.referralNotes || ''}
                onChange={(e) => setSubmission({ ...submission, referralNotes: e.target.value })}
                placeholder="اطلاعات بیشتر درباره فرد معرفی شده"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'creative':
      case 'content':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات
              </label>
              <textarea
                value={submission.description || ''}
                onChange={(e) => setSubmission({ ...submission, description: e.target.value })}
                placeholder="توضیحات کار انجام شده"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                آپلود فایل
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">فایل خود را آپلود کنید</p>
                <p className="text-xs text-gray-500 mt-1">
                  {task.type === 'creative' ? 'فرمت‌های مجاز: PNG, JPG, PDF, AI' : 'فرمت‌های مجاز: TXT, DOC, PDF'}
                </p>
                <input type="file" className="hidden" />
              </div>
            </div>
          </div>
        );

      case 'distribution':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                لینک پست اشتراک‌گذاری شده
              </label>
              <input
                type="url"
                value={submission.shareLink || ''}
                onChange={(e) => setSubmission({ ...submission, shareLink: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                پلتفرم
              </label>
              <select
                value={submission.platform || ''}
                onChange={(e) => setSubmission({ ...submission, platform: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">انتخاب کنید</option>
                <option value="telegram">تلگرام</option>
                <option value="instagram">اینستاگرام</option>
                <option value="twitter">توییتر</option>
                <option value="other">سایر</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسکرین‌شات (اختیاری)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">آپلود اسکرین‌شات</p>
                <input type="file" accept="image/*" className="hidden" />
              </div>
            </div>
          </div>
        );

      case 'communication':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تعداد تماس‌های موفق
              </label>
              <input
                type="number"
                value={submission.callCount || ''}
                onChange={(e) => setSubmission({ ...submission, callCount: e.target.value })}
                placeholder="تعداد"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                خلاصه مکالمات
              </label>
              <textarea
                value={submission.callSummary || ''}
                onChange={(e) => setSubmission({ ...submission, callSummary: e.target.value })}
                placeholder="خلاصه‌ای از مکالمات و بازخوردها"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        );

      case 'resource':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع منبع
              </label>
              <input
                type="text"
                value={submission.resourceType || ''}
                onChange={(e) => setSubmission({ ...submission, resourceType: e.target.value })}
                placeholder="مثلا: ویدئو پروژکتور، سالن، وسیله نقلیه"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                دوره زمانی در دسترس
              </label>
              <input
                type="text"
                value={submission.availability || ''}
                onChange={(e) => setSubmission({ ...submission, availability: e.target.value })}
                placeholder="مثلا: هفته آینده، روزهای فرد"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات تکمیلی
              </label>
              <textarea
                value={submission.resourceNotes || ''}
                onChange={(e) => setSubmission({ ...submission, resourceNotes: e.target.value })}
                placeholder="توضیحات بیشتر"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowRight size={20} />
          <span>بازگشت به وظایف</span>
        </button>

        {/* Task Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {task.title}
              </h1>
              <p className="text-gray-600">{task.description}</p>
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Award className="text-blue-600" size={24} />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{task.points}</p>
                  <p className="text-xs text-gray-600">امتیاز</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} />
              <div>
                <p className="text-xs text-gray-500">مهلت انجام</p>
                <p className="text-sm font-medium">{new Date(task.deadline).toLocaleDateString('fa-IR')}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">اولویت</p>
              <span className={`inline-block px-3 py-1 rounded text-sm ${
                task.priority === 'high' 
                  ? 'bg-red-100 text-red-700'
                  : task.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {task.priority === 'high' ? 'فوری' : task.priority === 'medium' ? 'متوسط' : 'عادی'}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">ایجاد شده توسط</p>
              <p className="text-sm font-medium">{task.createdBy}</p>
            </div>
          </div>
        </div>

        {/* Profile Requirement Warning */}
        {task.requiresCompleteProfile && user.profile.completionPercentage < 100 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">
                نیاز به تکمیل پروفایل
              </h3>
              <p className="text-sm text-amber-800 mb-2">
                برای قبول این وظیفه، باید پروفایل خود را تکمیل کنید
              </p>
              <button
                onClick={() => navigate('/profile')}
                className="text-sm font-medium text-amber-900 hover:text-amber-700"
              >
                تکمیل پروفایل ←
              </button>
            </div>
          </div>
        )}

        {/* Task Actions */}
        {!userTask && canAccept && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <button
              onClick={handleAccept}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              قبول وظیفه
            </button>
          </div>
        )}

        {userTask && userTask.status === 'in-progress' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">ارسال پاسخ</h2>
            <form onSubmit={handleSubmit}>
              {renderSubmissionForm()}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  'در حال ارسال...'
                ) : (
                  <>
                    <Send size={20} />
                    <span>ارسال و تکمیل وظیفه</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {userTask && userTask.status !== 'in-progress' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className={`flex items-center gap-3 p-4 rounded-lg ${
              userTask.status === 'completed' || userTask.status === 'approved'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              <CheckCircle size={24} />
              <div>
                <p className="font-semibold">
                  {userTask.status === 'completed' && 'وظیفه ارسال شده - در انتظار بررسی'}
                  {userTask.status === 'approved' && 'وظیفه تایید شد'}
                  {userTask.status === 'rejected' && 'وظیفه رد شد'}
                </p>
                <p className="text-sm">
                  {userTask.completedAt && `تاریخ ارسال: ${new Date(userTask.completedAt).toLocaleDateString('fa-IR')}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
