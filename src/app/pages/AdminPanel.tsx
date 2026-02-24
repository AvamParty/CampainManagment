import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks, Task, TaskType } from '../contexts/TaskContext';
import { useAnnouncements } from '../contexts/AnnouncementContext';
import { useNavigate } from 'react-router';
import {
  Plus,
  Users,
  ListChecks,
  Megaphone,
  BarChart3,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
} from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const { tasks, userTasks, createTask } = useTasks();
  const { announcements, createAnnouncement } = useAnnouncements();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'announcements'>('overview');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    type: 'opinion',
    points: 50,
    deadline: '',
    priority: 'medium',
    requiresCompleteProfile: false,
    createdBy: user?.name || '',
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    author: user?.name || '',
  });

  // For testing: allow any logged-in user. Restore role check for production:
  // if (!user || (user.role !== 'admin' && user.role !== 'manager'))
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">دسترسی محدود - فقط برای مدیران</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            بازگشت به داشبورد
          </button>
        </div>
      </div>
    );
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTask(newTask as Omit<Task, 'id'>);
    setShowCreateTask(false);
    setNewTask({
      title: '',
      description: '',
      type: 'opinion',
      points: 50,
      deadline: '',
      priority: 'medium',
      requiresCompleteProfile: false,
      createdBy: user.name,
    });
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    createAnnouncement(newAnnouncement);
    setShowCreateAnnouncement(false);
    setNewAnnouncement({
      title: '',
      content: '',
      author: user.name,
    });
  };

  // Statistics
  const totalTasks = tasks.length;
  const totalUserTasks = userTasks.length;
  const completedTasks = userTasks.filter(ut => ut.status === 'completed' || ut.status === 'approved').length;
  const inProgressTasks = userTasks.filter(ut => ut.status === 'in-progress').length;
  const completionRate = totalUserTasks > 0 ? Math.round((completedTasks / totalUserTasks) * 100) : 0;

  const stats = [
    { label: 'کل وظایف', value: totalTasks, icon: ListChecks, color: 'bg-blue-500' },
    { label: 'تکمیل شده', value: completedTasks, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'در حال انجام', value: inProgressTasks, icon: Clock, color: 'bg-yellow-500' },
    { label: 'نرخ تکمیل', value: `${completionRate}%`, icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">پنل مدیریت</h1>
          <p className="text-gray-600">مدیریت کمپین و نظارت بر فعالیت‌ها</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 size={20} />
              <span>نمای کلی</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ListChecks size={20} />
              <span>مدیریت وظایف</span>
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'announcements'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Megaphone size={20} />
              <span>اطلاعیه‌ها</span>
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                        <Icon className="text-white" size={20} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">آخرین وظایف</h3>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.points} امتیاز</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority === 'high' ? 'فوری' : task.priority === 'medium' ? 'متوسط' : 'عادی'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">آخرین اطلاعیه‌ها</h3>
                <div className="space-y-3">
                  {announcements.slice(0, 5).map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => navigate('/announcements')}
                    >
                      <p className="font-medium text-gray-900 mb-1">{announcement.title}</p>
                      <p className="text-sm text-gray-600">{announcement.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowCreateTask(!showCreateTask)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                ایجاد وظیفه جدید
              </button>
            </div>

            {showCreateTask && (
              <form onSubmit={handleCreateTask} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">وظیفه جدید</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">عنوان</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع وظیفه</label>
                    <select
                      value={newTask.type}
                      onChange={(e) => setNewTask({ ...newTask, type: e.target.value as TaskType })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="opinion">نظرسنجی</option>
                      <option value="research">تحقیق</option>
                      <option value="database">پایگاه داده</option>
                      <option value="coordination">هماهنگی</option>
                      <option value="event">رویداد</option>
                      <option value="referral">معرفی</option>
                      <option value="creative">طراحی</option>
                      <option value="content">محتوا</option>
                      <option value="distribution">توزیع</option>
                      <option value="communication">ارتباطات</option>
                      <option value="resource">منابع</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">امتیاز</label>
                    <input
                      type="number"
                      value={newTask.points}
                      onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) })}
                      min="10"
                      step="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">مهلت</label>
                    <input
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اولویت</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="low">عادی</option>
                      <option value="medium">متوسط</option>
                      <option value="high">فوری</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newTask.requiresCompleteProfile}
                        onChange={(e) => setNewTask({ ...newTask, requiresCompleteProfile: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">نیاز به تکمیل پروفایل</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ایجاد وظیفه
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateTask(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    لغو
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">لیست وظایف ({tasks.length})</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{task.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-1 rounded ${
                            task.priority === 'high' 
                              ? 'bg-red-100 text-red-700'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {task.priority === 'high' ? 'فوری' : task.priority === 'medium' ? 'متوسط' : 'عادی'}
                          </span>
                          <span className="text-gray-500">{task.points} امتیاز</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowCreateAnnouncement(!showCreateAnnouncement)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                ایجاد اطلاعیه جدید
              </button>
            </div>

            {showCreateAnnouncement && (
              <form onSubmit={handleCreateAnnouncement} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">اطلاعیه جدید</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عنوان</label>
                    <input
                      type="text"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">متن اطلاعیه</label>
                    <textarea
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    انتشار اطلاعیه
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateAnnouncement(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    لغو
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">لیست اطلاعیه‌ها ({announcements.length})</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate('/announcements')}
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{announcement.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{announcement.author}</span>
                      <span>•</span>
                      <span>{new Date(announcement.createdAt).toLocaleDateString('fa-IR')}</span>
                      <span>•</span>
                      <span>{announcement.comments.length} نظر</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
