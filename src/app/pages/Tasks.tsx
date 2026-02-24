import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { useNavigate } from 'react-router';
import {
  Search,
  Filter,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  FileText,
  Database,
  MapPin,
  Users,
  UserPlus,
  Palette,
  Share2,
  Phone,
  Briefcase,
  Zap,
  Target,
} from 'lucide-react';
import { motion } from 'motion/react';

const taskTypeIcons = {
  opinion: MessageSquare,
  research: FileText,
  database: Database,
  coordination: MapPin,
  event: Calendar,
  referral: UserPlus,
  creative: Palette,
  content: FileText,
  distribution: Share2,
  communication: Phone,
  resource: Briefcase,
};

const taskTypeLabels = {
  opinion: 'نظرسنجی',
  research: 'تحقیق',
  database: 'پایگاه داده',
  coordination: 'هماهنگی',
  event: 'رویداد',
  referral: 'معرفی',
  creative: 'طراحی',
  content: 'محتوا',
  distribution: 'توزیع',
  communication: 'ارتباطات',
  resource: 'منابع',
};

const taskTypeColors = {
  opinion: 'from-blue-500 to-cyan-500',
  research: 'from-purple-500 to-pink-500',
  database: 'from-green-500 to-teal-500',
  coordination: 'from-orange-500 to-red-500',
  event: 'from-yellow-500 to-orange-500',
  referral: 'from-indigo-500 to-purple-500',
  creative: 'from-pink-500 to-rose-500',
  content: 'from-teal-500 to-cyan-500',
  distribution: 'from-violet-500 to-purple-500',
  communication: 'from-blue-500 to-indigo-500',
  resource: 'from-emerald-500 to-green-500',
};

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, userTasks } = useTasks();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'available' | 'my-tasks'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  if (!user) return null;

  const myTaskIds = userTasks.filter(ut => ut.userId === user.id).map(ut => ut.taskId);

  let filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchQuery && !task.title.includes(searchQuery) && !task.description.includes(searchQuery)) {
      return false;
    }

    // Type filter
    if (filterType === 'available' && myTaskIds.includes(task.id)) {
      return false;
    }
    if (filterType === 'my-tasks' && !myTaskIds.includes(task.id)) {
      return false;
    }

    // Status filter
    if (filterStatus !== 'all') {
      const userTask = userTasks.find(ut => ut.taskId === task.id && ut.userId === user.id);
      if (!userTask || userTask.status !== filterStatus) {
        return false;
      }
    }

    // Priority filter
    if (filterPriority !== 'all' && task.priority !== filterPriority) {
      return false;
    }

    return true;
  });

  const getTaskStatus = (taskId: string) => {
    const userTask = userTasks.find(ut => ut.taskId === taskId && ut.userId === user.id);
    return userTask?.status;
  };

  const statusIcons = {
    'in-progress': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', gradient: 'from-blue-500 to-cyan-500', label: 'در حال انجام' },
    completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', gradient: 'from-green-500 to-emerald-500', label: 'تکمیل شده' },
    approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', gradient: 'from-green-500 to-emerald-500', label: 'تایید شده' },
    rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', gradient: 'from-red-500 to-pink-500', label: 'رد شده' },
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 lg:pt-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                وظایف
              </h1>
              <p className="text-gray-600">مدیریت و پیگیری وظایف کمپین</p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-5 mb-6"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو در وظایف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent font-medium"
            >
              <option value="all">همه وظایف</option>
              <option value="available">وظایف جدید</option>
              <option value="my-tasks">وظایف من</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent font-medium"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="in-progress">در حال انجام</option>
              <option value="completed">تکمیل شده</option>
              <option value="approved">تایید شده</option>
              <option value="rejected">رد شده</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent font-medium"
            >
              <option value="all">همه اولویت‌ها</option>
              <option value="high">فوری</option>
              <option value="medium">متوسط</option>
              <option value="low">عادی</option>
            </select>
          </div>
        </motion.div>

        {/* Tasks Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="col-span-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-16 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Award size={64} className="mx-auto mb-4 text-gray-300" />
              </motion.div>
              <p className="text-gray-500 text-lg font-medium">وظیفه‌ای یافت نشد</p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => {
              const status = getTaskStatus(task.id);
              const StatusIcon = status ? statusIcons[status]?.icon : null;
              const TypeIcon = taskTypeIcons[task.type];
              const typeGradient = taskTypeColors[task.type];

              return (
                <motion.div
                  key={task.id}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="group bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${typeGradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`w-12 h-12 bg-gradient-to-br ${typeGradient} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <TypeIcon className="text-white" size={22} />
                        </motion.div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">{taskTypeLabels[task.type]}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-lg">
                        <Zap size={14} fill="currentColor" />
                        <span className="text-sm font-bold">{task.points}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>

                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : task.priority === 'medium'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {task.priority === 'high' ? 'فوری' : task.priority === 'medium' ? 'متوسط' : 'عادی'}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                        <Calendar size={12} />
                        {new Date(task.deadline).toLocaleDateString('fa-IR')}
                      </span>
                    </div>

                    {status && StatusIcon && (
                      <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${statusIcons[status].gradient}`}
                      >
                        <StatusIcon className="text-white" size={18} />
                        <span className="text-sm font-bold text-white">
                          {statusIcons[status].label}
                        </span>
                      </motion.div>
                    )}

                    {!status && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3 rounded-xl text-sm font-bold hover:shadow-xl transition-all"
                      >
                        مشاهده و قبول وظیفه
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
