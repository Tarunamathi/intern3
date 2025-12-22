"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Users,
  FileText,
  Award,
  RefreshCw,
  Menu,
  X,
  Bell,
  LogOut,
  Settings,
  ClipboardList,
  BarChart3,
  Megaphone,
  Download,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  PlayCircle,
  FolderOpen,
} from 'lucide-react';

export default function TrainerDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [trainerData, setTrainerData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainerProfile();
    fetchNotices();
  }, []);

  const fetchTrainerProfile = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(userData);
      const response = await fetch('/api/trainer/profile', {
        method: 'GET',
        headers: { 'x-user-email': user.email },
      });

      const data = await response.json();
      if (response.ok) {
        const firstNameFromName = data.name ? data.name.split(' ')[0] : '';
        const lastNameFromName = data.name
          ? data.name.split(' ').slice(1).join(' ')
          : '';

        const normalized = {
          ...data,
          firstName: data.firstName ?? firstNameFromName,
          lastName:
            data.lastName ??
            (data.lastName === undefined ? lastNameFromName : data.lastName),
        };

        setTrainerData(normalized);
      } else {
        console.error('Failed to fetch trainer profile', data);
        if (
          data.message &&
          data.message.toLowerCase().includes('unauthorized')
        ) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching trainer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotices = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const url = `/api/notices/list?userEmail=${encodeURIComponent(
        user.email
      )}&userRole=trainer`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        if (data.success && data.notices) {
          setNotifications(data.notices);
        } else if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          setNotifications([]);
        }
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotifications([]);
    }
  };

  const refreshTrainerStats = async () => {
    try {
      setLoadingStats(true);
      await fetchTrainerProfile();
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        localStorage.removeItem('user');
        router.replace('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('user');
      router.replace('/login');
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleViewAllNotices = () => {
          router.push('/noticeboard');
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: '/trainer/dashboard',
    },
    {
      id: 'noticeboard',
      label: 'Notice Board',
      icon: Megaphone,
           path: '/noticeboard',
    },
    {
      id: 'training-courses',
      label: 'Training Courses',
      icon: BookOpen,
      path: '/trainer/courses',
    },
    {
      id: 'my-courses',
      label: 'My Courses',
      icon: FileText,
      path: '/trainer/my-courses',
    },
    { id: 'quiz', label: 'Quiz', icon: ClipboardList, path: '/trainer/quiz' },
    {
      id: 'exam-scores',
      label: 'Exam Scores',
      icon: ClipboardList,
      path: '/trainer/exam-scores',
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: Award,
      path: '/trainer/certificates',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/trainer/settings',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading trainer dashboard...</div>
      </div>
    );
  }

  if (!trainerData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-white text-xl">Unable to load trainer data</div>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold backdrop-blur-md bg-opacity-80 transition-all duration-300"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed"
         style={{
           backgroundImage: "url('/images/rice-field.png')",
      }}
    >

        <div
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } backdrop-blur-xl border-r border-white border-opacity-5 transition-all duration-300 flex flex-col relative z-40`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-white border-opacity-5">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-white text-opacity-50 drop-shadow-lg">
                Trainer Portal
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white hover:bg-opacity-5 rounded-lg transition-all duration-200 text-white"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === 'dashboard';

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'backdrop-blur-xl bg-green-500 bg-opacity-15 border border-green-400 border-opacity-20 text-white shadow-lg'
                      : 'text-white hover:backdrop-blur-xl hover:bg-green-500  hover:bg-opacity-5 border border-transparent hover:border-white hover:border-opacity-10'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer - Logout */}
          <div className="p-3 border-t border-white border-opacity-5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:backdrop-blur-xl hover:bg-red-500 hover:bg-opacity-10 border border-transparent hover:border-red-400 hover:border-opacity-20 transition-all duration-200"
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="backdrop-blur-xl border-b border-white border-opacity-5 px-8 py-4 flex items-center justify-between relative z-30">
          <div>
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              Dashboard
            </h2>
            <p className="text-white text-opacity-80 drop-shadow-md">
              Welcome back, {trainerData.firstName} {trainerData.lastName}
            </p>
          </div>

          {/* Right Side - Notifications & Profile */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 backdrop-blur-xl hover:bg-green-500 hover:bg-opacity-5 border border-green-500 border-opacity-5 rounded-full transition-all duration-200 text-white"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-green-500 text-xs rounded-full w-5 h-5 flex items-center justify-center drop-shadow-lg font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 backdrop-blur-xl bg-white bg-opacity-10 border border-white border-opacity-15 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-green-500 border-opacity-10">
                    <h3 className="text-green-500 font-semibold drop-shadow-lg">
                      Notices
                    </h3>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-green-500 text-opacity-70 text-center">
                        No notices available
                      </p>
                    ) : (
                      notifications.slice(0, 5).map((notice, idx) => (
                        <div
                          key={idx}
                          className="p-4 border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors duration-200"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-green-500 font-medium drop-shadow-md flex-1">
                              {notice.title}
                            </h4>
                            {notice.priority && (
                              <span
                                className={`text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap drop-shadow-md ${
                                  notice.priority === 'high'
                                    ? 'bg-red-500 bg-opacity-30 text-red-200'
                                    : 'bg-yellow-500 bg-opacity-30 text-yellow-200'
                                }`}
                              >
                                {notice.priority}
                              </span>
                            )}
                          </div>
                          <p className="text-white text-opacity-70 text-sm mt-1">
                            {notice.description}
                          </p>
                          <p className="text-white text-opacity-50 text-xs mt-2">
                            {notice.time}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-white border-opacity-10">
                    <button
                      onClick={handleViewAllNotices}
                      className="w-full py-2 text-center text-green-500 font-medium hover:bg-green-500 hover:bg-opacity-10 rounded-lg transition-colors duration-200 drop-shadow-md"
                    >
                      View All Notices
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Trainer Profile */}
            <div className="flex items-center gap-3 backdrop-blur-xl border border-white border-opacity-5 rounded-full px-4 py-2">
              <div className="text-right">
                <p className="text-white font-semibold text-sm drop-shadow-md">
                  {trainerData.firstName} {trainerData.lastName}
                </p>
                <p className="text-white text-opacity-70 text-xs drop-shadow-md">
                  {trainerData.role || 'Trainer'}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold drop-shadow-lg">
                {trainerData.firstName?.charAt(0) ||
                  trainerData.name?.charAt(0) ||
                  ''}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto relative z-20">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                  Dashboard Overview
                </h3>
                <p className="text-white text-opacity-80 drop-shadow-md mt-1">
                  Overview of your courses and performance
                </p>
              </div>
              <button
                onClick={refreshTrainerStats}
                disabled={loadingStats}
                className="flex items-center gap-2 px-6 py-3 backdrop-blur-xl bg-green-500 bg-opacity-10 border border-green-400 border-opacity-20 text-white rounded-xl hover:bg-opacity-15 transition-all duration-200 font-semibold disabled:opacity-50 drop-shadow-lg"
              >
                <RefreshCw
                  size={18}
                  className={loadingStats ? 'animate-spin' : ''}
                />
                {loadingStats ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Courses Card */}
              <button
                onClick={() => handleNavigation('/trainer/courses')}
                className="backdrop-blur-xl border border-white border-opacity-5 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:border-opacity-10 group"
              >
                <div className="text-4xl font-bold drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {trainerData.totalCourses || 0}
                </div>
                <div className="text-white text-opacity-90 mt-2 drop-shadow-md font-semibold">
                  Total Courses
                </div>
              </button>

              {/* My Courses Card */}
              <button
                onClick={() => handleNavigation('/trainer/my-courses')}
                className="backdrop-blur-xl border border-white border-opacity-5 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:border-opacity-10 group"
              >
                <div className="text-4xl font-bold drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {trainerData.myCourses || 0}
                </div>
                <div className="text-white text-opacity-90 mt-2 drop-shadow-md font-semibold">
                  My Assigned Courses
                </div>
              </button>

              {/* Total Students Card */}
              <button
                onClick={() => handleNavigation('/trainer/my-courses')}
                className="backdrop-blur-xl border border-white border-opacity-5 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:border-opacity-10 group"
              >
                <div className="text-4xl font-bold drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {trainerData.totalStudents || 0}
                </div>
                <div className="text-white text-opacity-90 mt-2 drop-shadow-md font-semibold">
                  Total Students
                </div>
              </button>

              {/* Completion Rate Card */}
              <button
                onClick={() => handleNavigation('/trainer/certificates')}
                className="backdrop-blur-xl border border-white border-opacity-5 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:border-opacity-10 group"
              >
                <div className="text-4xl font-bold drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {trainerData.completionRate || '0%'}
                </div>
                <div className="text-white text-opacity-90 mt-2 drop-shadow-md font-semibold">
                  Completion Rate
                </div>
              </button>
            </div>

            {/* Additional Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
              {/* Quick Stats */}
              <div className="backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-4 shadow-2xl max-w-4xl w-full mx-auto">
                <h4 className="text-lg font-bold text-white drop-shadow-lg mb-4">
                  Quick Stats
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-lg p-4 flex flex-col items-start justify-center h-20">
                    <span className="text-green-500 text-opacity-90 drop-shadow-md text-sm">
                      Courses Available
                    </span>
                    <span className="text-green-300 font-extrabold text-2xl drop-shadow-lg">
                      {trainerData.totalCourses || 0}
                    </span>
                  </div>
                  <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-lg p-4 flex flex-col items-start justify-center h-20">
                    <span className="text-green-500 text-opacity-90 drop-shadow-md text-sm">
                      My Courses
                    </span>
                    <span className="text-green-300 font-extrabold text-2xl drop-shadow-lg">
                      {trainerData.myCourses || 0}
                    </span>
                  </div>
                  <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-lg p-4 flex flex-col items-start justify-center h-20">
                    <span className="text-green-500 text-opacity-90 drop-shadow-md text-sm">
                      Success Rate
                    </span>
                    <span className="text-green-300 font-extrabold text-2xl drop-shadow-lg">
                      {trainerData.completionRate || '0%'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Notices removed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}