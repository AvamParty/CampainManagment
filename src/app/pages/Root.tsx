import React from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Home, ListTodo, User, Megaphone, Sparkles, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function Root() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const baseNavigation = [
    { name: 'داشبورد', path: '/dashboard', icon: Home },
    { name: 'وظایف', path: '/tasks', icon: ListTodo },
    { name: 'اطلاعیه‌ها', path: '/announcements', icon: Megaphone },
    { name: 'پروفایل', path: '/profile', icon: User },
  ];
  const adminNavItem = { name: 'مدیریت', path: '/admin', icon: Settings };
  const navigation =
    user && (user.role === 'admin' || user.role === 'manager')
      ? [...baseNavigation, adminNavItem]
      : baseNavigation;
  const activeMobileIndex = navigation.findIndex((item) => item.path === location.pathname);

  // Public routes that don't need auth
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Logged-in users must never see login/register — redirect to tasks
  if (isAuthenticated && isPublicRoute) {
    return <Navigate to="/tasks" replace />;
  }

  // Redirect to login if not authenticated and not on public route
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fe] via-[#f0f2ff] to-[#e8ebff]" dir="rtl">
      {isAuthenticated && (
        <>
          {/* Floating Mobile Bottom Navigation */}
          <motion.nav
            initial={false}
            className="lg:hidden fixed bottom-4 left-4 right-4 z-50"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 px-2 py-3">
              <div className={`relative grid gap-1 ${navigation.length === 5 ? 'grid-cols-5' : 'grid-cols-4'}`}>
                {activeMobileIndex >= 0 && (
                  <motion.div
                    initial={false}
                    animate={{ x: `${activeMobileIndex * -100}%` }}
                    style={{ width: `${100 / navigation.length}%` }}
                    className="absolute inset-y-0 right-0 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                  />
                )}
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.button
                      key={item.path}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(item.path)}
                      className={`relative z-10 flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-[10px]">{item.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.nav>

          {/* Desktop Sidebar with Glassmorphism */}
          <motion.aside 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden lg:block fixed right-6 top-6 bottom-6 w-72 bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl z-40"
          >
            {/* Logo & Title */}
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-3 mb-2"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="font-bold text-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                    حزب عوام ایران
                  </h1>
                  <p className="text-xs text-gray-500">سامانه مدیریت کمپین</p>
                </div>
              </motion.div>
            </div>

            {/* User Card */}
            {user && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative mb-6 p-5 rounded-2xl bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white overflow-hidden cursor-pointer"
              >
                <div className="absolute -bottom-10 -right-10 opacity-10">
                  <Sparkles size={150} />
                </div>
                <div className="relative flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white text-xl font-bold border-2 border-white/30">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-white/80">{user.mobile}</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between pt-4 border-t border-white/20">
                  <span className="text-sm text-white/80">امتیاز کل</span>
                  <span className="text-3xl font-bold">{user.points}</span>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <nav className="space-y-2 mb-6">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <motion.button
                    key={item.path}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(item.path)}
                    className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white/50'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute inset-0 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon size={22} className="relative z-10" />
                    <span className="relative z-10 font-medium">{item.name}</span>
                  </motion.button>
                );
              })}
            </nav>

          </motion.aside>
        </>
      )}

      {/* Main Content */}
      <main className={isAuthenticated ? 'lg:mr-80 lg:ml-6 pb-24 lg:pb-6' : ''}>
        <Outlet />
      </main>
    </div>
  );
}
