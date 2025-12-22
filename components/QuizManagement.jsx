import { useState, useEffect } from 'react';
import { Clock, FileText, Award, BarChart3, Users, Plus, X, Trash2, Eye } from 'lucide-react';

export default function QuizManagement({ trainerData, coursesData }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [selectedQuizForAttempts, setSelectedQuizForAttempts] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    course: '',
    duration: '',
    totalMarks: '',
    passingMarks: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }]
  });

  // Fetch quizzes created by this trainer
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!trainerData?.email) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/trainer/quiz/list?createdBy=${trainerData.email}&userRole=trainer`);
        if (response.ok) {
          const data = await response.json();
          setQuizzes(data);
        } else {
          console.error('Failed to fetch quizzes', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [trainerData]);

  // Fetch attempts for a specific quiz
  const fetchQuizAttempts = async (quizId) => {
    try {
      setLoadingAttempts(true);
      const response = await fetch(`/api/trainer/quiz/${quizId}/attempts`);
      if (response.ok) {
        const data = await response.json();
        setQuizAttempts(data);
        setSelectedQuizForAttempts(quizId);
      } else {
        console.error('Failed to fetch quiz attempts');
        setQuizAttempts([]);
      }
    } catch (error) {
      console.error('Error fetching quiz attempts:', error);
      setQuizAttempts([]);
    } finally {
      setLoadingAttempts(false);
    }
  };

  // Quiz handlers
  const handleAddQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]
    });
  };

  const handleRemoveQuestion = (index) => {
    const updated = newQuiz.questions.filter((_, i) => i !== index);
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...newQuiz.questions];
    updated[index][field] = value;
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...newQuiz.questions];
    updated[qIndex].options[optIndex] = value;
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const handleCreateQuiz = async () => {
    const filteredQuestions = newQuiz.questions.filter(q => 
      q.question.trim() !== '' && 
      q.options.every(opt => opt.trim() !== '') && 
      q.correctAnswer.trim() !== ''
    );

    if (!newQuiz.title || !newQuiz.course || !newQuiz.duration || !newQuiz.totalMarks || !newQuiz.passingMarks || filteredQuestions.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch('/api/trainer/quiz/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newQuiz.title,
          course: newQuiz.course,
          duration: newQuiz.duration,
          totalMarks: newQuiz.totalMarks,
          passingMarks: newQuiz.passingMarks,
          questions: filteredQuestions,
          createdBy: trainerData.email
        })
      });

      if (response.ok) {
        const savedQuiz = await response.json();
        setQuizzes([...quizzes, savedQuiz]);
        setShowCreateQuiz(false);
        setNewQuiz({
          title: '',
          course: '',
          duration: '',
          totalMarks: '',
          passingMarks: '',
          questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }]
        });
        alert('Quiz created successfully!');
      } else {
        alert('Failed to create quiz. Please try again.');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz. Please try again.');
    }
  };

  const handleCancelQuiz = () => {
    setShowCreateQuiz(false);
    setNewQuiz({
      title: '',
      course: '',
      duration: '',
      totalMarks: '',
      passingMarks: '',
      questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }]
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Management</h2>
          <p className="text-gray-600">Create and manage quizzes for your courses</p>
        </div>
        <button
          onClick={() => setShowCreateQuiz(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md"
        >
          <Plus className="w-5 h-5" />
          Create Quiz
        </button>
      </div>

      {/* Create Quiz Form */}
      {showCreateQuiz && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-purple-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Quiz</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Quiz Title *</label>
                <input
                  type="text"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Select Course *</label>
                <select
                  value={newQuiz.course}
                  onChange={(e) => setNewQuiz({ ...newQuiz, course: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a course</option>
                  {coursesData?.map((course) => (
                    <option key={course.id} value={course.title}>{course.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Duration *</label>
                <input
                  type="text"
                  value={newQuiz.duration}
                  onChange={(e) => setNewQuiz({ ...newQuiz, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 30 minutes"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Total Marks *</label>
                <input
                  type="number"
                  value={newQuiz.totalMarks}
                  onChange={(e) => setNewQuiz({ ...newQuiz, totalMarks: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Passing Marks *</label>
                <input
                  type="number"
                  value={newQuiz.passingMarks}
                  onChange={(e) => setNewQuiz({ ...newQuiz, passingMarks: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="50"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Questions</h4>
              {newQuiz.questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-semibold text-gray-700">Question {qIndex + 1}</h5>
                    {newQuiz.questions.length > 1 && (
                      <button
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter question"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options.map((opt, optIndex) => (
                        <input
                          key={optIndex}
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder={`Option ${optIndex + 1}`}
                        />
                      ))}
                    </div>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select correct answer</option>
                      {q.options.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt || `Option ${idx + 1}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={handleCancelQuiz}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuiz}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz List */}
      <div className="space-y-6">
        {quizzes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No quizzes created yet</h3>
            <p className="text-gray-500 mb-6">Create your first quiz to get started</p>
            <button
              onClick={() => setShowCreateQuiz(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Create Quiz
            </button>
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Quiz Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                    <p className="text-purple-100 text-sm mb-3">{quiz.course}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{quiz.questions?.length || quiz.totalQuestions || 0} Questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{quiz.totalMarks} Marks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        <span>Pass: {quiz.passingMarks}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => fetchQuizAttempts(quiz.id)}
                    className="ml-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    View Attempts
                  </button>
                </div>
              </div>

              {/* Trainee Attempts */}
              {selectedQuizForAttempts === quiz.id && (
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Trainee Attempts</h4>
                  {loadingAttempts ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="mt-2 text-gray-500 text-sm">Loading attempts...</p>
                    </div>
                  ) : quizAttempts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trainee Name</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Attempt</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Score</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quizAttempts.map((attempt, idx) => {
                            const isPassed = attempt.score >= quiz.passingMarks;
                            return (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-800">{attempt.traineeName || attempt.studentName || 'N/A'}</td>
                                <td className="px-4 py-3 text-center text-sm text-gray-600">{attempt.traineeEmail || attempt.studentEmail}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                                    {attempt.attemptNumber || attempt.attemptCount || 1}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="font-semibold text-gray-800">{attempt.score}/{quiz.totalMarks}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    isPassed 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {isPassed ? 'Passed' : 'Failed'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-gray-600">
                                  {attempt.submittedAt || attempt.attemptedAt ? new Date(attempt.submittedAt || attempt.attemptedAt).toLocaleDateString() : 'N/A'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No attempts yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}