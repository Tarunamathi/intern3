'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

// enrolledCourses will be fetched from /api/trainee/enrollments

const categories = [
  "All Categories",
  "Post-harvest Management",
  "Cold Chain Operations",
  "Government Support",
  "Agri Logistics"
];

const statusFilters = [
  { value: "all", label: "All Courses" },
  { value: "upcoming", label: "Upcoming" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" }
];

export default function EnrolledCoursesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchDebounceRef = useRef(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [trainerQuery, setTrainerQuery] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [trainerSuggestions, setTrainerSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batchQuizzes, setBatchQuizzes] = useState({});
  const [sessionTimeData, setSessionTimeData] = useState({});  // batchId -> { required, spent, status, trainer }

  // Fetch session time for today
  const fetchSessionTime = async (batchId, email) => {
    try {
      const res = await fetch(`/api/trainee/session-time?batchId=${batchId}`, {
        headers: { 'x-user-email': email }
      });
      if (res.ok) {
        const data = await res.json();
        setSessionTimeData(prev => ({ ...prev, [batchId]: data }));
      }
    } catch (err) {
      console.error('Error fetching session time:', err);
    }
  };

  // Fetch quizzes for a specific batch
  const fetchBatchQuizzes = async (batchId) => {
    try {
      const res = await fetch(`/api/quiz/list`);
      if (res.ok) {
        const allQuizzes = await res.json();
        const filtered = allQuizzes.filter(q => q.batchId === batchId);
        setBatchQuizzes(prev => ({ ...prev, [batchId]: filtered }));
      }
    } catch (error) {
      console.error('Error fetching quizzes for batch:', error);
    }
  };

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        let email = null;
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('user');
          if (stored) {
            try { email = JSON.parse(stored).email; } catch(e) { /* ignore */ }
          }
        }

        const headers = email ? { 'x-user-email': email } : {};
        const res = await fetch('/api/trainee/enrollments', { headers });
        if (res.ok) {
          const data = await res.json();
          const mapped = (Array.isArray(data) ? data : []).map(e => {
            const batch = e.batch || {};
            const trainerName = batch.trainer ? `${batch.trainer.firstName} ${batch.trainer.lastName}` : (batch.trainerEmail || '');
            return {
              id: e.id,
              batchId: batch.id || e.batchId,
              courseId: batch.courseId || null,
              title: batch.courseName || 'Untitled Course',
              category: batch.courseName || 'General',
              enrolledDate: e.enrolledDate,
              startDate: batch.startDate,
              endDate: batch.endDate,
              status: (batch.status || e.status || 'upcoming').toLowerCase(),
              progress: batch.progress || 0,
              duration: '',
              instructor: trainerName,
              batchName: batch.batchName || '',
              batchCode: batch.batchCode || '',
            };
          });
          setEnrolledCourses(mapped);
          // populate trainer suggestions initially
          const trainers = Array.from(new Set(mapped.map(m => m.instructor).filter(Boolean)));
          setTrainerSuggestions(trainers.slice(0, 10));
          // Fetch quizzes for each batch
          mapped.forEach(course => {
            if (course.batchId) {
              fetchBatchQuizzes(course.batchId);
              // Fetch session time for each batch
              if (email) fetchSessionTime(course.batchId, email);
            }
          });
        } else {
          console.error('Failed to fetch enrollments', await res.text());
        }
      } catch (err) {
        console.error('Error fetching enrollments', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Fetch available courses (for suggestions)
  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          // endpoint returns { courses: [...] } or array in some places — normalize
          const list = Array.isArray(data) ? data : (Array.isArray(data?.courses) ? data.courses : []);
          setAvailableCourses(list);
        }
      } catch (err) {
        console.error('Error fetching available courses for suggestions', err);
      }
    };
    fetchAvailable();
  }, []);

  // Debounce search query and compute suggestions
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      
      // Generate search suggestions
      if (searchQuery.trim().length > 0) {
        const lowerQuery = searchQuery.toLowerCase().trim();
        const seen = new Set();
        const suggestionObjs = [];

        // Enrolled course matches
        enrolledCourses.forEach(c => {
          try {
            const title = (c.title || '').toString();
            if (!title) return;
            const lc = title.toLowerCase();
            if ((lc.includes(lowerQuery) || (c.instructor || '').toLowerCase().includes(lowerQuery) || (c.batchName || '').toLowerCase().includes(lowerQuery)) && !seen.has(title)) {
              seen.add(title);
              suggestionObjs.push({ label: title, source: 'enrolled', batchId: c.batchId, courseId: c.courseId });
            }
          } catch (e) { /* ignore malformed */ }
        });

        // Available course matches (include titles not already returned)
        availableCourses.forEach(ac => {
          try {
            const title = (ac.title || ac.name || '').toString();
            if (!title) return;
            const lc = title.toLowerCase();
            if (lc.includes(lowerQuery) && !seen.has(title)) {
              seen.add(title);
              suggestionObjs.push({ label: title, source: 'available', courseId: ac.id });
            }
          } catch (e) { /* ignore */ }
        });

        const trimmed = suggestionObjs.slice(0, 12);
        setSearchSuggestions(trimmed);
        setShowSearchSuggestions(trimmed.length > 0);
      } else {
        setSearchSuggestions([]);
        setShowSearchSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery, enrolledCourses]);

  // Filter courses (use immediate searchQuery so filtering updates as user types)
  const filteredCourses = enrolledCourses.filter(course => {
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      course.title.toLowerCase().includes(searchLower) ||
      course.batchName.toLowerCase().includes(searchLower) ||
      course.instructor.toLowerCase().includes(searchLower);
    const matchesCategory = selectedCategory === 'All Categories' || course.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
    const matchesTrainer = !selectedTrainer || course.instructor === selectedTrainer || course.instructor.toLowerCase().includes(trainerQuery.toLowerCase().trim());
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTrainer;
  });

  const getDaysLeft = (startDate) => {
    if (!startDate) return null;
    try {
      const start = new Date(startDate);
      const now = new Date();
      // calculate difference in days (round up)
      const diff = Math.ceil((start.setHours(0,0,0,0) - new Date(now.setHours(0,0,0,0))) / (1000 * 60 * 60 * 24));
      return diff;
    } catch (e) {
      return null;
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // Status badge styling
  const getStatusBadge = (status) => {
    const normalizedStatus = (status || '').toLowerCase();
    const styles = {
      upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
      active: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    
    const icons = {
      upcoming: <Clock size={14} />,
      active: <Calendar size={14} />,
      completed: <CheckCircle size={14} />
    };

    const styleClass = styles[normalizedStatus] || styles['upcoming'];
    const icon = icons[normalizedStatus] || icons['upcoming'];

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styleClass}`}>
        {icon}
        {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
      </span>
    );
  };

  // Session timer state
  const [sessionOpen, setSessionOpen] = useState(false);
  const [sessionCourse, setSessionCourse] = useState(null);
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(0);
  const [sessionRunning, setSessionRunning] = useState(false);
  const [sessionMinutesRequired, setSessionMinutesRequired] = useState(0);
  const [sessionMinutesSpent, setSessionMinutesSpent] = useState(0);

  // Start session for a course (UI) - auto-calculate required time from batch schedule
  const openSession = (course) => {
    setSessionCourse(course);
    // Fetch required minutes from the session-time API
    const timeData = sessionTimeData[course.batchId];
    if (timeData) {
      setSessionMinutesRequired(timeData.requiredMinutes || 60);
      setSessionMinutesSpent(timeData.dailyMinutesSpent || 0);
    } else {
      setSessionMinutesRequired(60); // default 1 hour
      setSessionMinutesSpent(0);
    }
    setSessionSecondsLeft((sessionMinutesRequired - sessionMinutesSpent) * 60);
    setSessionOpen(true);
    setSessionRunning(false);
  };

  useEffect(() => {
    if (!sessionRunning) return;
    if (sessionSecondsLeft <= 0) return;
    const t = setInterval(() => {
      setSessionSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(t);
          setSessionRunning(false);
          // when finished, record time and auto-mark attendance via API
          finishSession();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [sessionRunning, sessionSecondsLeft]);

  const finishSession = async () => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const email = stored ? JSON.parse(stored).email : null;
      if (!email || !sessionCourse) {
        setSessionOpen(false);
        return;
      }

      // Calculate minutes spent in this session
      const minutesDuring = Math.round((sessionMinutesRequired - sessionSecondsLeft / 60) / 60 * 60);
      const totalMinutesSpent = sessionMinutesSpent + minutesDuring;

      // Record session time
      const res = await fetch('/api/trainee/session-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': email },
        body: JSON.stringify({ batchId: sessionCourse.batchId, minutesSpent: minutesDuring })
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Session recorded:', data);
        // Refresh session time data
        if (sessionCourse.batchId) {
          fetchSessionTime(sessionCourse.batchId, email);
        }
      }
    } catch (err) {
      console.error('Error finishing session', err);
    } finally {
      setSessionOpen(false);
      setSessionRunning(false);
      setSessionCourse(null);
      setSessionSecondsLeft(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-800">My Enrolled Courses</h1>
          <p className="text-gray-600 mt-1">Track your learning progress and manage your courses</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading enrollments...</p>
          </div>
        ) : (
          <>
            {/* Filters Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow-sm p-6 mb-6">
          {/* Search Bar with Suggestions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Courses</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by course name or instructor..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => searchQuery && setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-3 border border-white/20 bg-white/5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 top-full mt-1 bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg max-h-56 overflow-auto z-50">
                  {searchSuggestions.map((sugg, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          // fill search box and then navigate if it's an enrolled course
                          setSearchQuery(sugg.label);
                          setDebouncedSearchQuery(sugg.label);
                          setShowSearchSuggestions(false);
                          setCurrentPage(1);
                          if (sugg.source === 'enrolled' && sugg.batchId) {
                            // navigate to enrolled course batch page
                            router.push(`/trainee/course/${sugg.batchId}`);
                          } else if (sugg.source === 'available' && sugg.courseId) {
                            // go to courses listing and prefill search (route to courses page)
                            router.push(`/trainee/courses`);
                          }
                        }}
                        className="px-4 py-2 hover:bg-green-50 cursor-pointer text-gray-700 flex items-center justify-between gap-2"
                      >
                      <div className="flex items-center gap-2">
                        <Search size={16} className="text-gray-400" />
                        <span>{sugg.label}</span>
                      </div>
                      {sugg.source === 'available' && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Available</span>
                      )}
                      {sugg.source === 'enrolled' && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Enrolled</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              { /* build category options from enrolledCourses to ensure relevant filtering */ }
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              >
                {[ 'All Categories', ...Array.from(new Set(enrolledCourses.map(c => c.category).filter(Boolean)))].map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              >
                {statusFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Trainer</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type trainer name..."
                value={trainerQuery}
                onChange={(e) => {
                  const q = e.target.value;
                  setTrainerQuery(q);
                  setSelectedTrainer('');
                  // compute suggestions from enrolledCourses
                  const suggestions = Array.from(new Set(enrolledCourses.map(c => c.instructor).filter(Boolean)))
                    .filter(name => name.toLowerCase().includes(q.toLowerCase()))
                    .slice(0, 8);
                  setTrainerSuggestions(suggestions);
                }}
                className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {trainerQuery && trainerSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white/5 backdrop-blur-xl border border-gray-200 rounded mt-1 max-h-40 overflow-auto z-40">
                  {trainerSuggestions.map((name) => (
                    <li key={name} onClick={() => { setSelectedTrainer(name); setTrainerQuery(name); setTrainerSuggestions([]); setCurrentPage(1); }} className="px-3 py-2 hover:bg-white/5 cursor-pointer">{name}</li>
                  ))}
                </ul>
              )}
              {selectedTrainer && (
                <button onClick={() => { setSelectedTrainer(''); setTrainerQuery(''); }} className="absolute right-2 top-2 text-sm text-gray-600">Clear</button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {currentCourses.length} of {filteredCourses.length} courses
          </div>
        </div>

        {/* Courses List */}
          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {currentCourses.length} of {filteredCourses.length} courses
          </div>

            {currentCourses.length > 0 ? (
          <div className="space-y-4">
            {currentCourses.map((course) => (
              <div key={course.id} className="bg-white/5 backdrop-blur-xl rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                        {getStatusBadge(course.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Category:</span> {course.category}
                      </p>
                      {/* Instructor intentionally not shown; searchable by trainer name */}
                      {course.batchName && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Batch:</span> {course.batchName}
                        </p>
                      )}
                      {course.batchCode && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Batch Code:</span> {course.batchCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="text-gray-400" size={16} />
                      <div>
                        <p className="text-gray-500">Enrolled Date</p>
                        <p className="font-medium text-gray-800">
                          {course.enrolledDate ? new Date(course.enrolledDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="text-green-500" size={16} />
                      <div>
                        <p className="text-gray-500">Start Date</p>
                        <p className="font-medium text-gray-800">
                          {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A'}
                        </p>
                        {course.startDate && (() => {
                          const daysLeft = getDaysLeft(course.startDate);
                          if (daysLeft != null && daysLeft > 0 && daysLeft <= 7) {
                            return (
                              <p className="text-xs text-yellow-700 mt-1">{daysLeft <= 3 ? `Starts in ${daysLeft} day${daysLeft>1?'s':''}` : `Starts in ${daysLeft} days`}</p>
                            );
                          }
                          if (daysLeft === 0) {
                            return <p className="text-xs text-green-700 mt-1">Starts today</p>;
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="text-red-500" size={16} />
                      <div>
                        <p className="text-gray-500">End Date</p>
                        <p className="font-medium text-gray-800">
                          {course.endDate ? new Date(course.endDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-semibold text-green-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Session Time Display for Trainer */}
                  {sessionTimeData[course.batchId] && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-xs text-gray-700 mb-1">
                        <span className="font-medium">Trainer:</span> {sessionTimeData[course.batchId].trainer}
                      </p>
                      <p className="text-xs text-gray-700 mb-2">
                        <span className="font-medium">Daily Required Time:</span> {sessionTimeData[course.batchId].requiredMinutes} min
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Time spent today:</span>
                        <span className={`text-xs font-bold ${sessionTimeData[course.batchId].status === 'present' ? 'text-green-700' : 'text-yellow-700'}`}>
                          {sessionTimeData[course.batchId].dailyMinutesSpent} / {sessionTimeData[course.batchId].requiredMinutes} min ({sessionTimeData[course.batchId].status.toUpperCase()})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        router.push(`/trainee/course/${course.batchId}`);
                      }}
                      className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      {course.status === 'completed' ? 'View Certificate' : course.status === 'active' ? 'Continue Learning' : 'View Details'}
                    </button>
                    <button
                      onClick={() => openSession(course)}
                      className="px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      Start Session
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow-sm p-12 text-center">
              <XCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setSelectedStatus('all');
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Clear Filters
              </button>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {filteredCourses.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between bg-white/5 backdrop-blur-xl rounded-lg shadow-sm p-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
              </span>
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {/* Session Modal */}
      {sessionOpen && sessionCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/5 backdrop-blur-xl rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{sessionCourse.title}</h3>
                {sessionTimeData[sessionCourse.batchId] && (
                  <p className="text-sm text-gray-600 mt-1">Trainer: {sessionTimeData[sessionCourse.batchId].trainer}</p>
                )}
              </div>
              <button onClick={() => { setSessionOpen(false); setSessionRunning(false); }} className="text-gray-600">Close</button>
            </div>

            {/* Time requirement display */}
            {sessionTimeData[sessionCourse.batchId] && (
              <div className="bg-blue-50 p-3 rounded mb-4 border border-blue-200">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Daily Requirement:</span> {sessionTimeData[sessionCourse.batchId].requiredMinutes} minutes
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Already spent today:</span> {sessionTimeData[sessionCourse.batchId].dailyMinutesSpent} minutes
                </p>
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium">Progress</span>
                    <span className="text-xs font-medium">{Math.round((sessionTimeData[sessionCourse.batchId].dailyMinutesSpent / sessionTimeData[sessionCourse.batchId].requiredMinutes) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (sessionTimeData[sessionCourse.batchId].dailyMinutesSpent / sessionTimeData[sessionCourse.batchId].requiredMinutes) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <p className={`text-sm mt-2 font-medium ${sessionTimeData[sessionCourse.batchId].status === 'present' ? 'text-green-700' : 'text-yellow-700'}`}>
                  Status: <span className="uppercase">{sessionTimeData[sessionCourse.batchId].status}</span>
                </p>
              </div>
            )}

            {/* Timer display */}
            <div className="mb-4 text-center">
              <div className="text-4xl font-mono font-bold">{Math.floor(sessionSecondsLeft/60).toString().padStart(2,'0')}:{(sessionSecondsLeft%60).toString().padStart(2,'0')}</div>
              <div className="text-sm text-gray-500 mt-2">Time needed in this session</div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {!sessionRunning ? (
                <button onClick={() => setSessionRunning(true)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700">Start</button>
              ) : (
                <button onClick={() => setSessionRunning(false)} className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded font-medium hover:bg-yellow-600">Pause</button>
              )}
              <button onClick={() => { setSessionOpen(false); setSessionRunning(false); setSessionSecondsLeft(0); }} className="px-4 py-2 bg-gray-200 rounded font-medium hover:bg-gray-300">Close</button>
            </div>
            
            <p className="text-xs text-gray-500 mt-3 text-center">When timer completes, your attendance will be marked based on required time.</p>
          </div>
        </div>
      )}
    </div>
  );
}