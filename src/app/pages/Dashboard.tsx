import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { useAnnouncements } from '../contexts/AnnouncementContext';
import { useNavigate } from 'react-router';
import { 
  Trophy, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  Award,
  ArrowLeft,
  Zap,
  Target,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, userTasks } = useTasks();
  const { announcements } = useAnnouncements();
  const navigate = useNavigate();

  if (!user) return null;

  const myTasks = userTasks.filter(ut => ut.userId === user.id);
  const completedTasks = myTasks.filter(ut => ut.status === 'completed' || ut.status === 'approved');
  const inProgressTasks = myTasks.filter(ut => ut.status === 'in-progress');
  const pendingTasks = myTasks.filter(ut => ut.status === 'pending');

  const availableTasks = tasks.filter(
    task => !myTasks.some(ut => ut.taskId === task.id)
  ).slice(0, 5);

  const recentAnnouncements = announcements.slice(0, 3);

  const stats = [
    {
      label: 'امتیاز کل',
      value: user.points,
      icon: Trophy,
      gradient: 'from-yellow-400 to-orange-500',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    },
    {
      label: 'تکمیل شده',
      value: completedTasks.length,
      icon: CheckCircle,
      gradient: 'from-green-400 to-emerald-500',
      iconBg: 'bg-gradient-to-br from-green-400 to-emerald-500',
    },
    {
      label: 'در حال انجام',
      value: inProgressTasks.length,
      icon: Clock,
      gradient: 'from-blue-400 to-cyan-500',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    },
    {
      label: 'تکمیل پروفایل',
      value: `${user.profile.completionPercentage}%`,
      icon: TrendingUp,
      gradient: 'from-purple-400 to-pink-500',
      iconBg: 'bg-gradient-to-br from-purple-400 to-pink-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 lg:pt-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="text-yellow-500" fill="currentColor" size={28} />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              سلام، {user.name}!
            </h1>
          </div>
          <p className="text-gray-600 text-lg">آماده‌اید برای یک روز پرانرژی؟ 🚀</p>
        </motion.div>

        {/* Profile Completion Alert */}
        {user.profile.completionPercentage < 100 && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-amber-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-1 text-lg">
                  پروفایل خود را تکمیل کنید
                </h3>
                <p className="text-sm text-amber-800 mb-3">
                  برخی وظایف نیاز به تکمیل پروفایل دارند. درصد تکمیل فعلی: {user.profile.completionPercentage}%
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/profile')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  تکمیل پروفایل
                  <ArrowLeft size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-5 md:p-6 shadow-lg border border-white/20 overflow-hidden group cursor-pointer"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`${stat.iconBg} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="text-white" size={24} />
                    </motion.div>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Available Tasks */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Target className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  وظایف جدید
                </h2>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {availableTasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Award size={56} className="mx-auto mb-3 text-gray-300" />
                  </motion.div>
                  <p className="font-medium">همه وظایف را قبول کرده‌اید!</p>
                </div>
              ) : (
                availableTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="p-4 hover:bg-gradient-to-l hover:from-blue-50 cursor-pointer transition-all"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{task.title}</h3>
                      <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex-shrink-0">
                        <Zap size={14} fill="currentColor" />
                        <span className="text-sm font-bold">{task.points}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2.5 py-1 rounded-full font-medium ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority === 'high' ? 'فوری' : task.priority === 'medium' ? 'متوسط' : 'عادی'}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(task.deadline).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/tasks')}
                className="w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                مشاهده همه وظایف
              </motion.button>
            </div>
          </motion.div>

          {/* My Tasks & Recent Announcements */}
          <div className="space-y-6">
            {/* My Tasks */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    وظایف من
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {myTasks.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <Clock size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>هنوز وظیفه‌ای قبول نکرده‌اید</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                          <CheckCircle className="text-white" size={20} />
                        </div>
                        <span className="font-bold text-gray-900">تکمیل شده</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{completedTasks.length}</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                          <Clock className="text-white" size={20} />
                        </div>
                        <span className="font-bold text-gray-900">در حال انجام</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</span>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/tasks')}
                      className="w-full text-center bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow mt-4"
                    >
                      مشاهده جزئیات
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Announcements */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    آخرین اطلاعیه‌ها
                  </h2>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentAnnouncements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: -5 }}
                    className="p-4 hover:bg-gradient-to-r hover:from-orange-50 cursor-pointer transition-all"
                    onClick={() => navigate('/announcements')}
                  >
                    <h3 className="font-bold text-gray-900 mb-1">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {announcement.author} • {new Date(announcement.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/announcements')}
                  className="w-full text-center bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  مشاهده همه اطلاعیه‌ها
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
