'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Calendar, FileText, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function NoticeBoardPage() {
  const router = useRouter();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          router.push('/login');
          return;
        }
        const user = JSON.parse(userData);
        const res = await fetch(`/api/notices/list?userEmail=${encodeURIComponent(user.email)}&userRole=trainee`);
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          // API returns { success: true, notices: [...] }
          const resultNotices = Array.isArray(data) ? data : (Array.isArray(data?.notices) ? data.notices : []);
          setNotices(resultNotices);
        } else {
          // try to read json error body for logging/debug
          const err = await res.json().catch(() => ({}));
          console.warn('Failed to fetch notices:', err);
          setNotices([]);
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [router]);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Notice Board</h1>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading notices...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notices available yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div key={notice.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className={`p-4 border-l-4 ${
                    notice.priority === 'high' ? 'border-red-500' : 
                    notice.priority === 'medium' ? 'border-yellow-500' : 
                    'border-green-500'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{notice.title}</h3>
                        <p className="text-sm text-gray-500">
                          Posted by {notice.createdBy} on {new Date(notice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getPriorityColor(notice.priority)}`}>
                        {notice.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{notice.description}</p>
                    
                    {notice.timeLimit && (
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Valid until: {new Date(notice.timeLimit).toLocaleDateString()}</span>
                      </div>
                    )}

                    {notice.attachments && notice.attachments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Attachments:</p>
                        <div className="space-y-2">
                          {notice.attachments.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                <span>{file.name}</span>
                              </div>
                              {file.url && (
                                <div className="flex gap-2">
                                  <a 
                                    href={file.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                  >
                                    View
                                  </a>
                                  <a 
                                    href={file.url} 
                                    download={file.name || 'file'}
                                    className="text-green-600 hover:text-green-800 text-sm"
                                  >
                                    Download
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}