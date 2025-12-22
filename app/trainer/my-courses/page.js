"use client";

import { useState, useEffect } from 'react';
import { 
  BookOpen, ArrowLeft, Search, Download, Eye, Users, 
  Calendar, Clock, FileText, ChevronDown, ChevronUp, AlertCircle,
  CheckCircle, PlayCircle, Loader, Video, Plus, Trash2, Link as LinkIcon, Copy, X
} from 'lucide-react';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedAttendance, setExpandedAttendance] = useState(null);
  const [showLiveClassModal, setShowLiveClassModal] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [liveClassForm, setLiveClassForm] = useState({
    platform: 'zoom',
    link: '',
    title: '',
    description: '',
    scheduledTime: ''
  });
  const [liveClassLinks, setLiveClassLinks] = useState({});

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const user = JSON.parse(userData);

      const response = await fetch('/api/trainer/my-courses', {
        method: 'GET',
        headers: {
          'x-user-email': user.email
        }
      });
      const data = await response.json();

      if (response.ok) {
        setCourses(data.courses || data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'ongoing';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'upcoming':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ongoing':
        return <PlayCircle className="w-4 h-4" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleDownloadMaterial = (materialId, materialName) => {
    console.log(`Downloading material: ${materialName}`);
  };

  const handleViewMaterial = (materialId, materialName) => {
    console.log(`Viewing material: ${materialName}`);
  };

  const openLiveClassModal = (batchId) => {
    setSelectedBatchId(batchId);
    setShowLiveClassModal(true);
    fetchLiveClassLinks(batchId);
  };

  const closeLiveClassModal = () => {
    setShowLiveClassModal(false);
    setSelectedBatchId(null);
    setLiveClassForm({
      platform: 'zoom',
      link: '',
      title: '',
      description: '',
      scheduledTime: ''
    });
  };

  const fetchLiveClassLinks = async (batchId) => {
    try {
      const res = await fetch(`/api/trainer/live-class?batchId=${batchId}`);
      if (res.ok) {
        const data = await res.json();
        setLiveClassLinks((prev) => ({
          ...prev,
          [batchId]: data.liveClassLinks || []
        }));
      }
    } catch (error) {
      console.error('Error fetching live class links:', error);
    }
  };

  const handleAddLiveClass = async () => {
    if (!liveClassForm.link.trim()) {
      alert('Please enter a valid meeting link');
      return;
    }

    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const res = await fetch('/api/trainer/live-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || ''
        },
        body: JSON.stringify({
          batchId: selectedBatchId,
          ...liveClassForm
        })
      });

      if (res.ok) {
        await fetchLiveClassLinks(selectedBatchId);
        setLiveClassForm({
          platform: 'zoom',
          link: '',
          title: '',
          description: '',
          scheduledTime: ''
        });
        alert('Live class link added successfully!');
      } else {
        alert('Failed to add live class link');
      }
    } catch (error) {
      console.error('Error adding live class:', error);
      alert('Error adding live class link');
    }
  };

  const handleDeleteLiveClass = async (linkId) => {
    if (!confirm('Are you sure you want to remove this class link?')) return;

    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const res = await fetch('/api/trainer/live-class', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || ''
        },
        body: JSON.stringify({
          batchId: selectedBatchId,
          linkId
        })
      });

      if (res.ok) {
        await fetchLiveClassLinks(selectedBatchId);
        alert('Live class link removed successfully!');
      } else {
        alert('Failed to remove live class link');
      }
    } catch (error) {
      console.error('Error deleting live class:', error);
      alert('Error deleting live class link');
    }
  };

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const markAttendance = async (batchId, studentEmail, status) => {
    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      const payload = {
        batchId,
        date: new Date().toISOString().split('T')[0],
        createdBy: user?.email || null,
        records: [
          { studentEmail, status }
        ]
      };

      const res = await fetch('/api/attendance-records/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': user?.email || '' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.inserted && data.inserted > 0) {
          setCourses(prev => prev.map(c => {
            if (c.id === batchId) {
              const updatedTrainees = (c.trainees || []).map(t => {
                if (t.email === studentEmail) {
                  const classesAttended = (t.classesAttended || 0) + (status.toLowerCase() === 'present' ? 1 : 0);
                  const total = t.totalClasses || Math.max(1, classesAttended);
                  const attendancePercentage = Math.round((classesAttended / total) * 100);
                  return { ...t, classesAttended, attendancePercentage };
                }
                return t;
              });
              return { ...c, trainees: updatedTrainees };
            }
            return c;
          }));
        }
      } else {
        console.error('Failed to mark attendance', await res.text());
      }
    } catch (err) {
      console.error('Error marking attendance', err);
    }
  };

  const filteredCourses = courses.filter(course => {
    const status = getStatus(course.startDate, course.endDate);
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto border border-white border-opacity-10 rounded-2xl p-6">
            <div className="flex items-center justify-center h-96">
              <Loader className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4 mb-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
                <p className="text-sm text-gray-600">Manage your assigned courses and materials</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by course name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Courses</option>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="border border-white border-opacity-10 rounded-2xl p-6">
            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No courses found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course) => {
                  const status = getStatus(course.startDate, course.endDate);
                  const isExpanded = expandedCourse === course.id;

                  return (
                    <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Course Header */}
                      <div
                        onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <BookOpen className="w-5 h-5 text-green-600" />
                              <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(status)}`}>
                                {getStatusIcon(status)}
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                            </div>
                            <div className="flex gap-6 mt-3 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>Code: {course.courseCode}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{course.totalTrainees || 0} Trainees</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="border-t bg-gray-50">
                          {/* Course Description */}
                          {course.description && (
                            <div className="p-6 border-b">
                              <h4 className="font-semibold text-gray-800 mb-2">Course Description</h4>
                              <p className="text-gray-600 text-sm">{course.description}</p>
                            </div>
                          )}

                          {/* Live Classes Section */}
                          <div className="p-6 border-b">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Video className="w-5 h-5 text-red-600" />
                                Live Classes
                              </h4>
                              <button
                                onClick={() => openLiveClassModal(course.id)}
                                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                              >
                                <Plus className="w-4 h-4" />
                                Add Class Link
                              </button>
                            </div>
                            {liveClassLinks[course.id] && liveClassLinks[course.id].length > 0 ? (
                              <div className="space-y-3">
                                {liveClassLinks[course.id].map((classLink, idx) => (
                                  <div key={idx} className="flex items-start justify-between p-4 bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors">
                                    <div className="flex items-start gap-3 flex-1">
                                      <Video className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800">{classLink.title}</p>
                                        <p className="text-xs text-gray-600 mt-1">{classLink.platform.toUpperCase()}</p>
                                        {classLink.description && (
                                          <p className="text-xs text-gray-600 mt-1">{classLink.description}</p>
                                        )}
                                        {classLink.scheduledTime && (
                                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            {new Date(classLink.scheduledTime).toLocaleString()}
                                          </div>
                                        )}
                                        <p className="text-xs text-gray-500 mt-2 break-all font-mono">{classLink.link}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                      <button
                                        onClick={() => copyToClipboard(classLink.link)}
                                        title="Copy link"
                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                      >
                                        <Copy className="w-4 h-4 text-red-600" />
                                      </button>
                                      <a
                                        href={classLink.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Open meeting"
                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                      >
                                        <LinkIcon className="w-4 h-4 text-red-600" />
                                      </a>
                                      <button
                                        onClick={() => handleDeleteLiveClass(classLink.id)}
                                        title="Delete link"
                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg border border-red-200">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <p className="text-sm text-red-700">No live classes scheduled yet</p>
                              </div>
                            )}
                          </div>

                          {/* Materials Section */}
                          <div className="p-6 border-b">
                            <h4 className="font-semibold text-gray-800 mb-4">Course Materials</h4>
                            {course.materials && course.materials.length > 0 ? (
                              <div className="space-y-3">
                                {course.materials.map((material, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                                    <div className="flex items-center gap-3 flex-1">
                                      <FileText className="w-5 h-5 text-blue-500" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{material.name}</p>
                                        <p className="text-xs text-gray-500">{material.size || 'Size not specified'}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleViewMaterial(material.id, material.name)}
                                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                        title="View Material"
                                      >
                                        <Eye className="w-4 h-4 text-blue-600" />
                                      </button>
                                      <button
                                        onClick={() => handleDownloadMaterial(material.id, material.name)}
                                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                        title="Download Material"
                                      >
                                        <Download className="w-4 h-4 text-green-600" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                                <p className="text-sm text-yellow-700">No materials uploaded yet</p>
                              </div>
                            )}
                          </div>

                          {/* Attendance Section */}
                          <div className="p-6">
                            <button
                              onClick={() => setExpandedAttendance(expandedAttendance === course.id ? null : course.id)}
                              className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-purple-600" />
                                <span className="font-semibold text-gray-800">Trainee Attendance</span>
                                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                                  {course.totalTrainees || 0} Trainees
                                </span>
                              </div>
                              {expandedAttendance === course.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              )}
                            </button>

                            {expandedAttendance === course.id && (
                              <div className="mt-4 overflow-x-auto">
                                {course.trainees && course.trainees.length > 0 ? (
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b bg-gray-100">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trainee Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Classes Attended</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Attendance %</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {course.trainees.map((trainee, idx) => {
                                        const attendancePercent = trainee.attendancePercentage || 0;
                                        const attendanceStatus = attendancePercent >= 75 ? 'Present' : attendancePercent >= 50 ? 'Average' : 'Poor';
                                        const statusColor = attendancePercent >= 75 ? 'bg-green-100 text-green-700' : attendancePercent >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';

                                        return (
                                          <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-gray-800">{trainee.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{trainee.email}</td>
                                            <td className="px-4 py-3 text-center text-sm text-gray-800 font-medium">
                                              {trainee.classesAttended || 0} / {trainee.totalClasses || 0}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              <div className="flex items-center justify-center gap-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                  <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: `${attendancePercent}%` }}
                                                  />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800 w-12 text-right">{attendancePercent}%</span>
                                              </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              <div className="flex gap-2 justify-center">
                                                <button onClick={() => markAttendance(course.id, trainee.email, 'Present')} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded hover:bg-green-100">Mark Present</button>
                                                <button onClick={() => markAttendance(course.id, trainee.email, 'Absent')} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded hover:bg-red-100">Mark Absent</button>
                                              </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor}`}>
                                                {attendanceStatus}
                                              </span>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                ) : (
                                  <div className="text-center py-8 text-gray-500">
                                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>No trainees enrolled</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Add Live Class Modal */}
        {showLiveClassModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Video className="w-6 h-6 text-red-600" />
                  Add Live Class Link
                </h3>
                <button
                  onClick={closeLiveClassModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <select
                    value={liveClassForm.platform}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, platform: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="zoom">Zoom</option>
                    <option value="google-meet">Google Meet</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="other">Other Platform</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link *</label>
                  <input
                    type="url"
                    placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                    value={liveClassForm.link}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, link: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Agricultural Techniques - Class 1"
                    value={liveClassForm.title}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Add details about this class session..."
                    value={liveClassForm.description}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Time</label>
                  <input
                    type="datetime-local"
                    value={liveClassForm.scheduledTime}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, scheduledTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> All enrolled students in this batch will be able to see and access this live class link.
                  </p>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <button
                    onClick={closeLiveClassModal}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLiveClass}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Class Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 