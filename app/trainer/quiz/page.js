'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Edit, Trash2, Eye, Users, Clock, 
  BookOpen, Award, CheckCircle, XCircle, FileText,
  ChevronDown, ChevronUp, Search, Filter
} from 'lucide-react';

export default function TrainerQuizPage() {
  const router = useRouter();
  
  // State
  const [trainerData, setTrainerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  
  // Quiz Form State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [courseInputMode, setCourseInputMode] = useState('select');
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    courseId: '',
    courseName: '',
    batchId: '',
    duration: 30,
    totalMarks: 100,
    passingMarks: 40,
    startDate: '',
    endDate: '',
    instructions: '',
    questions: [
      {
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        marks: 10
      }
    ]
  });

  // State for course dropdown
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState('');

  // Fetch trainer profile
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          router.push('/login');
          return;
        }
        const user = JSON.parse(userData);
        const res = await fetch('/api/trainer/profile', {
          method: 'GET',
          headers: { 'x-user-email': user.email }
        });
        const data = await res.json();
        if (res.ok) setTrainerData(data);
        else router.push('/login');
      } catch (error) {
        console.error('Error fetching trainer data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchTrainerData();
  }, [router]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses/list');
        if (response.ok) {
          const data = await response.json();
          const list = Array.isArray(data) ? data : (data?.courses || []);
          setCoursesData(list);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    
    if (trainerData) fetchCourses();
  }, [trainerData]);

  // Fetch assigned batches
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await fetch(`/api/batches/list?trainerEmail=${trainerData.email}`);
        if (res.ok) {
          const batches = await res.json();
          setMyCourses(batches);
        }
      } catch (err) {
        console.error('Error fetching batches', err);
      }
    };

    if (trainerData?.email) fetchMyCourses();
  }, [trainerData]);

  // Fetch quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`/api/quiz/list?createdBy=${trainerData.email}&userRole=trainer`);
        if (response.ok) {
          const quizzes = await response.json();
          setQuizzes(quizzes);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
    
    if (trainerData) fetchQuizzes();
  }, [trainerData]);

  // Quiz Form Handlers
  const handleQuizFormChange = (field, value) => {
    setQuizForm({ ...quizForm, [field]: value });
  };

  const handleCourseSelect = (course) => {
    setQuizForm(prev => ({
      ...prev,
      courseId: course.id,
      courseName: course.name || course.title
    }));
    setCourseSearchTerm(quizForm.courseName);
    setShowCourseDropdown(false);
  };

  const handleCourseNameChange = (value) => {
    setQuizForm(prev => ({
      ...prev,
      courseName: value,
      courseId: ''
    }));
    setCourseSearchTerm(value);
    setShowCourseDropdown(true);
  };

  const filteredCourses = coursesData.filter(course =>
    (course.name || course.title).toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  const handleAddQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [
        ...quizForm.questions,
        {
          question: '',
          type: 'multiple-choice',
          options: ['', '', '', ''],
          correctAnswer: '',
          marks: 10
        }
      ]
    });
  };

  const handleRemoveQuestion = (index) => {
    const updated = quizForm.questions.filter((_, i) => i !== index);
    setQuizForm({ ...quizForm, questions: updated });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quizForm.questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuizForm({ ...quizForm, questions: updated });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updated = [...quizForm.questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuizForm({ ...quizForm, questions: updated });
  };

  const handleAddOption = (questionIndex) => {
    const updated = [...quizForm.questions];
    updated[questionIndex].options.push('');
    setQuizForm({ ...quizForm, questions: updated });
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updated = [...quizForm.questions];
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuizForm({ ...quizForm, questions: updated });
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      if (!quizForm.title || (!quizForm.courseId && !quizForm.courseName) || !quizForm.batchId) {
        alert('Please fill in all required fields');
        return;
      }

      if (quizForm.questions.length === 0) {
        alert('Please add at least one question');
        return;
      }

      for (let i = 0; i < quizForm.questions.length; i++) {
        const q = quizForm.questions[i];
        if (!q.question.trim()) {
          alert(`Question ${i + 1} is empty`);
          return;
        }
        if (q.type === 'multiple-choice') {
          const validOptions = q.options.filter(opt => opt.trim());
          if (validOptions.length < 2) {
            alert(`Question ${i + 1} needs at least 2 options`);
            return;
          }
          if (!q.correctAnswer) {
            alert(`Question ${i + 1} needs a correct answer`);
            return;
          }
        }
      }

      // normalize payload to what the server expects
      const courseTitle = quizForm.courseName || (coursesData.find(c => c.id === Number(quizForm.courseId))?.name || coursesData.find(c => c.id === Number(quizForm.courseId))?.title);

      const payload = {
        title: quizForm.title,
        description: quizForm.description,
        course: courseTitle || 'Untitled Course',
        courseId: quizForm.courseId ? Number(quizForm.courseId) : null,
        batchId: quizForm.batchId ? Number(quizForm.batchId) : null,
        duration: Number(quizForm.duration) || 0,
        totalMarks: Number(quizForm.totalMarks) || 0,
        passingMarks: Number(quizForm.passingMarks) || 0,
        startDate: quizForm.startDate || null,
        endDate: quizForm.endDate || null,
        instructions: quizForm.instructions || '',
        questions: quizForm.questions.map(q => ({
          ...q,
          marks: Number(q.marks) || 0
        })),
        createdBy: trainerData.email,
        status: 'Active'
      };

      const response = await fetch('/api/quiz/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': trainerData.email },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedQuiz = await response.json();
        setQuizzes([...quizzes, savedQuiz]);
        setShowQuizModal(false);
        resetQuizForm();
        alert('Quiz created successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || 'Failed to create quiz');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz. Please try again.');
    }
  };

  const resetQuizForm = () => {
    setQuizForm({
      title: '',
      description: '',
      courseId: '',
      courseName: '',
      batchId: '',
      duration: 30,
      totalMarks: 100,
      passingMarks: 40,
      startDate: '',
      endDate: '',
      instructions: '',
      questions: [
        {
          question: '',
          type: 'multiple-choice',
          options: ['', '', '', ''],
          correctAnswer: '',
          marks: 10
        }
      ]
    });
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    
    try {
      const response = await fetch(`/api/quiz/delete?id=${quizId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setQuizzes(quizzes.filter(q => q.id !== quizId));
        alert('Quiz deleted successfully');
      } else {
        alert('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Error deleting quiz');
    }
  };

  const handleViewResults = (quiz) => {
    router.push(`/trainer/quiz/${quiz.id}/results`);
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || quiz.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto border border-white border-opacity-10 rounded-2xl p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto border border-white border-opacity-10 rounded-2xl p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Quiz Management</h1>
              <p className="text-gray-600 mt-1">Create and manage quizzes for your courses</p>
            </div>
            <button
              onClick={() => setShowQuizModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Quiz
            </button>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search quizzes..."
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
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuizzes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No quizzes found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== 'All' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first quiz to get started'}
              </p>
              {!searchTerm && filterStatus === 'All' && (
                <button
                  onClick={() => setShowQuizModal(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create Quiz
                </button>
              )}
            </div>
          ) : (
            filteredQuizzes.map((quiz) => {
              const course = coursesData.find(c => c.id === quiz.courseId);
              const batch = myCourses.find(b => b.id === quiz.batchId);
              const isExpanded = expandedQuiz === quiz.id;

              return (
                <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            quiz.status === 'Active' ? 'bg-green-500/30' :
                            quiz.status === 'Draft' ? 'bg-yellow-500/30' :
                            'bg-gray-500/30'
                          }`}>
                            {quiz.status}
                          </span>
                          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                            {quiz.questions?.length || 0} Questions
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{quiz.title}</h3>
                        {quiz.description && (
                          <p className="text-white/90 text-sm mb-3">{quiz.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{course?.name || course?.title || 'Course'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{quiz.duration} minutes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            <span>{quiz.totalMarks} marks</span>
                          </div>
                        </div>
                      </div>
                      <FileText className="w-12 h-12 opacity-20" />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">{quiz.totalMarks}</div>
                        <div className="text-sm text-gray-600">Total Marks</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">{quiz.passingMarks}</div>
                        <div className="text-sm text-gray-600">Passing Marks</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">{quiz.duration}</div>
                        <div className="text-sm text-gray-600">Duration (min)</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-600 w-24">Batch:</span>
                        <span className="text-gray-800">{batch?.batchCode || 'N/A'} - {batch?.batchName || ''}</span>
                      </div>
                      {quiz.startDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-600 w-24">Start Date:</span>
                          <span className="text-gray-800">{new Date(quiz.startDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {quiz.endDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-600 w-24">End Date:</span>
                          <span className="text-gray-800">{new Date(quiz.endDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedQuiz(isExpanded ? null : quiz.id)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-4"
                    >
                      <span className="font-medium text-gray-700">
                        View Questions ({quiz.questions?.length || 0})
                      </span>
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {isExpanded && quiz.questions && (
                      <div className="space-y-3 mb-4 pl-4 border-l-2 border-blue-200">
                        {quiz.questions.map((q, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-start gap-2 mb-2">
                              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 mb-2">{q.question}</p>
                                {q.type === 'multiple-choice' && q.options && (
                                  <div className="space-y-1">
                                    {q.options.map((opt, optIdx) => (
                                      <div key={optIdx} className="flex items-center gap-2 text-sm">
                                        {opt === q.correctAnswer ? (
                                          <CheckCircle className="w-4 h-4 text-green-600" />
                                        ) : (
                                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                        )}
                                        <span className={opt === q.correctAnswer ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                          {opt}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="mt-2 text-xs text-gray-500">Marks: {q.marks}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => handleViewResults(quiz)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Results
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {showQuizModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-4xl w-full my-8">
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="text-2xl font-bold text-gray-800">Create New Quiz</h3>
                <button
                  onClick={() => {
                    setShowQuizModal(false);
                    resetQuizForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateQuiz} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Basic Information</h4>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Quiz Title *</label>
                    <input
                      type="text"
                      required
                      value={quizForm.title}
                      onChange={(e) => handleQuizFormChange('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter quiz title"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      value={quizForm.description}
                      onChange={(e) => handleQuizFormChange('description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter quiz description"
                      rows="3"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Course Name *</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={quizForm.courseName}
                          onChange={(e) => handleCourseNameChange(e.target.value)}
                          onFocus={() => setShowCourseDropdown(true)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Type or select course name"
                          autoComplete="off"
                        />
                        
                        {showCourseDropdown && courseSearchTerm && filteredCourses.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                            {filteredCourses.map((course) => (
                              <button
                                key={course.id}
                                type="button"
                                onClick={() => handleCourseSelect(course)}
                                className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-200 last:border-b-0 transition-colors"
                              >
                                <div className="font-medium text-gray-800">{course.name || course.title}</div>
                                {course.description && (
                                  <div className="text-sm text-gray-500">{course.description}</div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Batch *</label>
                    <select
                      required
                      value={quizForm.batchId}
                      onChange={(e) => handleQuizFormChange('batchId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select batch</option>
                      {myCourses.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                          {batch.batchCode} - {batch.batchName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Duration (minutes) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={quizForm.duration ?? ''}
                        onChange={(e) => handleQuizFormChange('duration', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Total Marks *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={quizForm.totalMarks ?? ''}
                        onChange={(e) => handleQuizFormChange('totalMarks', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Passing Marks *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={quizForm.passingMarks ?? ''}
                        onChange={(e) => handleQuizFormChange('passingMarks', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                      <input
                        type="date"
                        value={quizForm.startDate}
                        onChange={(e) => handleQuizFormChange('startDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">End Date</label>
                      <input
                        type="date"
                        value={quizForm.endDate}
                        onChange={(e) => handleQuizFormChange('endDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Instructions</label>
                    <textarea
                      value={quizForm.instructions}
                      onChange={(e) => handleQuizFormChange('instructions', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter quiz instructions"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-800">Questions</h4>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>

                  {quizForm.questions.map((question, qIdx) => (
                    <div key={qIdx} className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-700">Question {qIdx + 1}</span>
                        {quizForm.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIdx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Question Text *</label>
                          <textarea
                            required
                            value={question.question}
                            onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter question"
                            rows="2"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">Question Type</label>
                            <select
                              value={question.type}
                              onChange={(e) => handleQuestionChange(qIdx, 'type', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="multiple-choice">Multiple Choice</option>
                              <option value="true-false">True/False</option>
                              <option value="short-answer">Short Answer</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-gray-700 font-medium mb-2">Marks *</label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={question.marks ?? ''}
                              onChange={(e) => handleQuestionChange(qIdx, 'marks', e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {question.type === 'multiple-choice' && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-gray-700 font-medium">Options *</label>
                              <button
                                type="button"
                                onClick={() => handleAddOption(qIdx)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                + Add Option
                              </button>
                            </div>
                            {question.options.map((option, optIdx) => (
                              <div key={optIdx} className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  required
                                  value={option}
                                  onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder={`Option ${optIdx + 1}`}
                                />
                                {question.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveOption(qIdx, optIdx)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            
                            <div className="mt-3">
                              <label className="block text-gray-700 font-medium mb-2">Correct Answer *</label>
                              <select
                                required
                                value={question.correctAnswer}
                                onChange={(e) => handleQuestionChange(qIdx, 'correctAnswer', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select correct answer</option>
                                {question.options.filter(opt => opt.trim()).map((option, idx) => (
                                  <option key={idx} value={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {question.type === 'true-false' && (
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">Correct Answer *</label>
                            <select
                              required
                              value={question.correctAnswer}
                              onChange={(e) => handleQuestionChange(qIdx, 'correctAnswer', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select correct answer</option>
                              <option value="True">True</option>
                              <option value="False">False</option>
                            </select>
                          </div>
                        )}

                        {question.type === 'short-answer' && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-700">
                              <strong>Note:</strong> Short answer questions will require manual grading by the trainer.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuizModal(false);
                      resetQuizForm();
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Create Quiz
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}