import { useState, useEffect } from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationBell({ userRole, userEmail }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notices/list?userEmail=${encodeURIComponent(userEmail)}&userRole=${userRole}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.notices)) {
            setNotifications(data.notices);
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userEmail) {
      fetchNotifications();
    }
  }, [userEmail, userRole]);

  const handleNoticeboardClick = () => {
    setShowNotifications(false);
    router.push(`/${userRole.toLowerCase()}/noticeboard`);
  };

  return (
    <div className="relative">
      <button 
        className="relative p-2 hover:bg-gray-100 rounded-full"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-[500px] overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              {notifications.length > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                  {notifications.length} new
                </span>
              )}
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No new notifications
              </div>
            ) : (
              notifications.map((notice) => (
                <div key={notice.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      notice.priority === 'high' ? 'bg-red-100' :
                      notice.priority === 'medium' ? 'bg-yellow-100' :
                      'bg-green-100'
                    }`}>
                      <AlertCircle className={`w-5 h-5 ${
                        notice.priority === 'high' ? 'text-red-600' :
                        notice.priority === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800">{notice.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{notice.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                        {notice.validUntil && (
                          <span className="text-xs text-red-500">
                            Expires: {new Date(notice.validUntil).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t">
              <button
                onClick={handleNoticeboardClick}
                className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}