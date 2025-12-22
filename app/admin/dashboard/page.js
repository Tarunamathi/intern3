"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch admin data and stats
    async function loadData() {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          router.push('/login');
          return;
        }

        const user = JSON.parse(storedUser);

        const [adminRes, statsRes] = await Promise.all([
          fetch('/api/admin/me', { headers: { 'x-user-email': user.email } }),
          fetch('/api/admin/stats')
        ]);

        if (adminRes.ok) {
          const adminData = await adminRes.json();
          setAdmin(adminData);
        } else {
          let errBody = null;
          try {
            errBody = await adminRes.json();
          } catch (e) {
            // ignore
          }
          console.error('Failed to fetch admin data', adminRes.status, errBody);
          if (adminRes.status === 401 || adminRes.status === 403 || adminRes.status === 404) {
            router.push('/login');
            return;
          }
          throw new Error(errBody?.error || 'Failed to fetch admin data');
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push("/login");
  };

  const handleNavigate = (page) => {
    if (page === "dashboard") {
      router.push("/admin");
    } else {
      router.push(`/admin/${page}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Unable to load admin data</p>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/rice-field.png')" }}
    >
      {/* Sidebar */}
      <div className="backdrop-blur-xl border-r border-white border-opacity-5 transition-all duration-300 flex flex-col w-64 relative z-40 p-0 left-0">
        <div className="flex items-center justify-between p-2">
          <h2 className="text-xl font-bold text-white text-opacity-60">ADMIN</h2>
        </div>
        <ul className="space-y-2 mt-2">
          <li
            className="text-white hover:backdrop-blur-xl hover:bg-green-500 hover:bg-opacity-5 p-2 rounded cursor-pointer transition-all duration-200"
            onClick={() => handleNavigate("side-dashboard")}
          >
            Dashboard
          </li>
          <li
            className="text-white hover:backdrop-blur-xl hover:bg-green-500 hover:bg-opacity-5 p-2 rounded cursor-pointer transition-all duration-200"
            onClick={() => handleNavigate("user-statistics")}
          >
            User Statistics
          </li>
          <li
            className="text-white hover:backdrop-blur-xl hover:bg-green-500 hover:bg-opacity-5 p-2 rounded cursor-pointer transition-all duration-200"
            onClick={() => handleNavigate("courses")}
          >
            Courses
          </li>
          <li
            className="hover:bg-green-700 p-2 rounded cursor-pointer"
            onClick={() => handleNavigate("institution")}
          >
            My Institution
          </li>
          <li
            className="hover:bg-green-700 p-2 rounded cursor-pointer"
            onClick={() => handleNavigate("co-ordinator")}
          >
            Coordinators
          </li>
          <li
            className="hover:bg-green-700 p-2 rounded cursor-pointer"
            onClick={() => handleNavigate("trainers")}
          >
            Trainers
          </li>
          <li
            className="hover:bg-green-700 p-2 rounded cursor-pointer"
            onClick={() => handleNavigate("trainees")}
          >
            Trainees
          </li>
          <li
            className="hover:bg-green-700 p-2 rounded cursor-pointer"
            onClick={() => handleNavigate("management")}
          >
            Admin Management
          </li>
          <li
            className="hover:bg-green-700 p-2 rounded cursor-pointer"
            onClick={() => handleNavigate("batch")}
          >
            Batch
          </li>
          <li
            className="hover:bg-green-700 p-2 rounded cursor-pointer"
            onClick={() => handleNavigate("library")}
          >
            Library
          </li>
          <li
            className="hover:bg-green-700 p-2 rounded cursor-pointer"
            onClick={() => handleNavigate("notice-board")}
          >
            Notice Board
          </li>
          <li
            className="hover:bg-green-700 p-2 rounded cursor-pointer"
            onClick={() => handleNavigate("settings")}
          >
            Settings
          </li>
          <li
            onClick={handleLogout}
            className="text-white hover:backdrop-blur-xl hover:bg-red-500 hover:bg-opacity-5 p-2 rounded cursor-pointer mt-5 transition-all duration-200"
          >
            Logout
          </li>
        </ul>
      </div>
 
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="backdrop-blur-xl border-b border-white border-opacity-5 px-0 py-0 flex items-center justify-between relative z-30">
          <div>
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">Dashboard</h2>
            <p className="text-white text-opacity-80 drop-shadow-md">Welcome back, {admin.name}</p>
          </div>

          {/* removed Normalize Uploads button per request */}
        </div>

        <div className="flex-1 overflow-y-auto relative z-20 p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="backdrop-blur-xl border border-white border-opacity-5 rounded-2xl p-6 text-white shadow-2xl">
              <div className="text-sm text-white text-opacity-80">Total Users</div>
              <div className="text-3xl font-bold mt-2 drop-shadow-lg">{stats?.users?.total || 0}</div>
              <div className="mt-4 text-sm text-white text-opacity-80">
                Trainers: {stats?.users?.trainers || 0} • Trainees: {stats?.users?.trainees || 0}
              </div>
            </div>

            <div className="backdrop-blur-xl border border-white border-opacity-5 rounded-2xl p-6 text-white shadow-2xl">
              <div className="text-sm text-white text-opacity-80">Total Courses</div>
              <div className="text-3xl font-bold mt-2">{stats?.courses?.total || 0}</div>
            </div>

            <div className="backdrop-blur-xl border border-white border-opacity-5 rounded-2xl p-6 text-white shadow-2xl">
              <div className="text-sm text-white text-opacity-80">Active Batches</div>
              <div className="text-3xl font-bold mt-2">{stats?.batches?.total || 0}</div>
              <div className="mt-4 text-sm text-white text-opacity-80">Total Enrolled: {stats?.batches?.enrolledStudents || 0}</div>
            </div>
          </div>

          <div className="backdrop-blur-xl border border-white border-opacity-5 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Registration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white text-opacity-90">
              <div><div className="text-sm text-white text-opacity-70">Date</div><div className="font-medium">{admin.registeredOn || 'N/A'}</div></div>
              <div><div className="text-sm text-white text-opacity-70">Name</div><div className="font-medium">{admin.name || 'N/A'}</div></div>
              <div><div className="text-sm text-white text-opacity-70">Email</div><div className="font-medium">{admin.email || 'N/A'}</div></div>
              <div><div className="text-sm text-white text-opacity-70">Role</div><div className="font-medium">{admin.role || 'N/A'}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}