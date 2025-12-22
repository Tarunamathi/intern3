'use client';

import { LayoutDashboard, BookOpen, Settings, LogOut, GraduationCap } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const menu = [
    { 
      name: "Dashboard", 
      icon: <LayoutDashboard size={18} />, 
      path: "/trainee/dashboard" 
    },
    { 
      name: "Training Courses", 
      icon: <GraduationCap size={18} />, 
      path: "/trainee/courses" 
    },
    { 
      name: "Enrolled Courses", 
      icon: <BookOpen size={18} />, 
      path: "/trainee/enrolled" 
    },
    { 
      name: "Settings", 
      icon: <Settings size={18} />, 
      path: "/trainee/settings" 
    },
  ];

  return (
    <aside className="w-64 bg-white/5 backdrop-blur-xl rounded-r-lg h-screen sticky top-0 left-0 flex-shrink-0">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white text-opacity-90">Trainee Panel</h2>
      </div>
      <nav className="px-2">
        <ul className="space-y-2">
          {menu.map((item, i) => {
            const isActive = pathname === item.path;
            return (
              <li key={i}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-left ${isActive ? 'bg-green-600 text-white font-medium' : 'text-white hover:bg-white/10'}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 pt-6 border-t border-white/10 px-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-red-500 hover:bg-opacity-10 rounded-md transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
