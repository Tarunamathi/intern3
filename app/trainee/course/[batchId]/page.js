'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft, Download, FileText, BookOpen, CheckCircle, Clock,
  AlertCircle, Play, FileIcon, Lock, Unlock
} from 'lucide-react';

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const batchId = params.batchId;

  const [batch, setBatch] = useState(null);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);
  const [traineeEmail, setTraineeEmail] = useState(null);
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' or 'quizzes'

  // Get trainee email from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setTraineeEmail(user.email);
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }, []);

  // Fetch batch and course details
  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const headers = traineeEmail ? { 'x-user-email': traineeEmail } : {};
        
        // Get enrollments to find the batch details
        const res = await fetch('/api/trainee/enrollments', { headers });
        if (res.ok) {
          const enrollments = await res.json();
          const enrollment = enrollments.find(e => e.batch?.id === parseInt(batchId));
          
          if (enrollment) {
            setBatch(enrollment.batch);
            
            // Get course details with modules
            if (enrollment.batch.courseId) {
              const courseRes = await fetch(`/api/courses/${enrollment.batch.courseId}`);
              if (courseRes.ok) {
                const courseData = await courseRes.json();
                setCourse(courseData);
                setModules(courseData.modules || []);
              }
            }
          } else {
            alert('Batch not found');
            router.back();
          }
        }
      } catch (error) {
        console.error('Error fetching batch details:', error);
      }
    };

    if (batchId && traineeEmail) {
      fetchBatchDetails();
    }
  }, [batchId, traineeEmail, router]);

  // Fetch quizzes for this batch
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch('/api/quiz/list');
        if (res.ok) {
          const allQuizzes = await res.json();
          const batchQuizzes = allQuizzes.filter(q => q.batchId === parseInt(batchId));
          setQuizzes(batchQuizzes);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (batchId) {
      fetchQuizzes();
    }
  }, [batchId]);

  const handleStartQuiz = (quizId) => {
    router.push(`/trainee/quiz/${quizId}`);
  };

  const getMimeTypeIcon = (mimeType) => {
    if (!mimeType) return <FileIcon className="w-5 h-5" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5" />;
    if (mimeType.includes('video')) return <Play className="w-5 h-5" />;
    if (mimeType.includes('image')) return <FileIcon className="w-5 h-5" />;
    return <FileIcon className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!batch || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Course details not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Enrolled Courses
          </button>
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 flex items-start gap-4">
              {course.image && (
                <img
                  src={course.image && (course.image.startsWith('http') || course.image.startsWith('/') ? course.image : '/' + course.image)}
                  alt={course.name}
                  className="w-36 h-20 object-cover rounded"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.name}</h1>
                {course.beneficiaries && course.beneficiaries.length > 0 && (
                  <p className="text-gray-600 mb-2">Beneficiaries: {course.beneficiaries.join(', ')}</p>
                )}
                <p className="text-gray-600 max-w-3xl">{course.description}</p>
              </div>
            </div>
          </div>

          {/* Course Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Batch</p>
              <p className="text-lg font-bold text-blue-700">{batch.batchCode}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">Trainer</p>
              <p className="text-lg font-bold text-purple-700">
                {batch.trainer 
                  ? `${batch.trainer.firstName} ${batch.trainer.lastName}`.trim()
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-bold text-green-700 capitalize">{batch.status}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="text-lg font-bold text-yellow-700">
                {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('modules')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'modules'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Materials ({modules.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'quizzes'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Quizzes ({quizzes.length})
            </div>
          </button>
        </div>

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            {modules.length > 0 ? (
              modules.map((module, moduleIdx) => (
                <div key={moduleIdx} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Module Header */}
                  <button
                    onClick={() => setExpandedModule(expandedModule === moduleIdx ? null : moduleIdx)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1 text-left">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <BookOpen className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Module {moduleIdx + 1}: {module.title}
                        </h3>
                        {module.description && (
                          <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-400">
                      {expandedModule === moduleIdx ? '▼' : '▶'}
                    </span>
                  </button>

                  {/* Module Materials */}
                  {expandedModule === moduleIdx && (
                    <div className="border-t bg-gray-50 p-6">
                      {module.materials && module.materials.length > 0 ? (
                        <div className="space-y-3">
                          {module.materials.map((material, matIdx) => (
                            <div
                              key={matIdx}
                              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0">
                                  {getMimeTypeIcon(material.mimeType)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-gray-800 truncate">
                                    {material.title}
                                  </p>
                                  {material.mimeType && (
                                    <p className="text-xs text-gray-500">
                                      {material.mimeType}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {/* View and Download Buttons */}
                              {material.fileUrl && (
                                <div className="ml-3 flex gap-2">
                                  <a
                                    href={material.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm flex items-center gap-1 flex-shrink-0"
                                  >
                                    <FileText className="w-4 h-4" />
                                    View
                                  </a>
                                  <a
                                    href={material.fileUrl}
                                    download={material.fileName || 'material'}
                                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm flex items-center gap-1 flex-shrink-0"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          No materials attached to this module
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No modules available yet</p>
              </div>
            )}
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Quiz Header */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{quiz.title}</h3>
                        {quiz.description && (
                          <p className="text-green-100 text-sm">{quiz.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quiz Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Questions</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {quiz.totalQuestions || (quiz.questions?.length || 0)}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Duration</p>
                        <p className="text-2xl font-bold text-gray-800">{quiz.duration} min</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Total Marks</p>
                        <p className="text-2xl font-bold text-gray-800">{quiz.totalMarks}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Pass Score</p>
                        <p className="text-2xl font-bold text-gray-800">{quiz.passingMarks}</p>
                      </div>
                    </div>

                    {/* Instructions */}
                    {quiz.instructions && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-900">
                          <strong>Instructions:</strong> {quiz.instructions}
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => handleStartQuiz(quiz.id)}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No quizzes available yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
