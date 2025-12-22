'use client';
import { useState, useEffect } from 'react';
import { Video, ArrowLeft, Loader, AlertCircle, Copy, Link as LinkIcon, Calendar, Clock, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TraineeLiveClassesPage() {
  const router = useRouter();
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }
      const user = JSON.parse(userData);

      const response = await fetch('/api/trainee/live-classes', {
        method: 'GET',
        headers: {
          'x-user-email': user.email
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLiveClasses(data.liveClasses || []);
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching live classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (link, linkId) => {
    navigator.clipboard.writeText(link);
    setCopiedLinkId(linkId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const isUpcoming = (scheduledTime) => {
    if (!scheduledTime) return false;
    return new Date(scheduledTime) > new Date();
  };

  const isPast = (scheduledTime) => {
    if (!scheduledTime) return false;
    return new Date(scheduledTime) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading live classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/trainee/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Video className="w-6 h-6 text-red-600" />
                Live Classes
              </h1>
              <p className="text-sm text-gray-600">Join live training sessions with your trainers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {liveClasses.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2 text-lg font-medium">No live classes scheduled</p>
            <p className="text-sm text-gray-400">Check back soon for upcoming live training sessions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Categorize by status */}
            {liveClasses.filter((c) => isUpcoming(c.scheduledTime)).length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Upcoming Classes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveClasses
                    .filter((c) => isUpcoming(c.scheduledTime))
                    .map((classItem, idx) => (
                      <ClassCard
                        key={idx}
                        classItem={classItem}
                        onCopy={copyToClipboard}
                        isCopied={copiedLinkId === classItem.id}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Current/Active Classes */}
            {liveClasses.filter((c) => c.scheduledTime && !isUpcoming(c.scheduledTime) && !isPast(c.scheduledTime)).length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-600" />
                  Live Now
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveClasses
                    .filter((c) => c.scheduledTime && !isUpcoming(c.scheduledTime) && !isPast(c.scheduledTime))
                    .map((classItem, idx) => (
                      <ClassCard
                        key={idx}
                        classItem={classItem}
                        onCopy={copyToClipboard}
                        isCopied={copiedLinkId === classItem.id}
                        isLive={true}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Past Classes */}
            {liveClasses.filter((c) => isPast(c.scheduledTime)).length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  Past Classes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveClasses
                    .filter((c) => isPast(c.scheduledTime))
                    .map((classItem, idx) => (
                      <ClassCard
                        key={idx}
                        classItem={classItem}
                        onCopy={copyToClipboard}
                        isCopied={copiedLinkId === classItem.id}
                        isPast={true}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Unscheduled Classes (no specific time) */}
            {liveClasses.filter((c) => !c.scheduledTime).length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  On Demand
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveClasses
                    .filter((c) => !c.scheduledTime)
                    .map((classItem, idx) => (
                      <ClassCard
                        key={idx}
                        classItem={classItem}
                        onCopy={copyToClipboard}
                        isCopied={copiedLinkId === classItem.id}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ClassCard({ classItem, onCopy, isCopied, isLive, isPast }) {
  return (
    <div className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border-l-4 ${
      isLive ? 'border-l-red-500 bg-red-50' : isPast ? 'border-l-gray-400 bg-gray-50' : 'border-l-blue-500 bg-white'
    }`}>
      {isLive && (
        <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-bold flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          LIVE NOW
        </div>
      )}

      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{classItem.title || 'Live Class'}</h3>

        {/* Platform Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            classItem.platform === 'zoom' ? 'bg-blue-100 text-blue-700' :
            classItem.platform === 'google-meet' ? 'bg-red-100 text-red-700' :
            classItem.platform === 'teams' ? 'bg-purple-100 text-purple-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {classItem.platform.toUpperCase().replace('-', ' ')}
          </span>
        </div>

        {/* Course & Batch Info */}
        <p className="text-xs text-gray-600 mb-2">
          <span className="font-medium text-gray-700">{classItem.courseName}</span>
          <br />
          <span className="text-gray-500">{classItem.batchName}</span>
        </p>

        {/* Description */}
        {classItem.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{classItem.description}</p>
        )}

        {/* Scheduled Time */}
        {classItem.scheduledTime && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <Calendar className="w-3 h-3" />
            {new Date(classItem.scheduledTime).toLocaleString()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <a
            href={classItem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <LinkIcon className="w-4 h-4" />
            Join
          </a>
          <button
            onClick={() => onCopy(classItem.link, classItem.id)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            title="Copy link"
          >
            <Copy className="w-4 h-4" />
            {isCopied && <span className="ml-1 text-xs">Copied!</span>}
          </button>
        </div>

        {isPast && (
          <p className="text-xs text-gray-500 text-center mt-2">Recording may be available from trainer</p>
        )}
      </div>
    </div>
  );
}
