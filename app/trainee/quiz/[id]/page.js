'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Clock, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';

export default function TakeQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id;

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [traineeData, setTraineeData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Fetch trainee data from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setTraineeData(JSON.parse(userData));
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }, []);

  // Fetch quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        if (res.ok) {
          const data = await res.json();
          setQuiz(data);
          // Initialize answers object
          const initialAnswers = {};
          if (Array.isArray(data.questions)) {
            data.questions.forEach((_, idx) => {
              initialAnswers[idx] = '';
            });
          }
          setAnswers(initialAnswers);
        } else {
          alert('Failed to load quiz');
          router.back();
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        alert('Error loading quiz');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId, router]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted || !quiz || submitted) return;

    if (timeRemaining === null) {
      const durationMinutes = parseInt(quiz.duration, 10) || 30;
      setTimeRemaining(durationMinutes * 60);
      return;
    }

    if (timeRemaining <= 0) {
      // Auto-submit when time expires
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [quizStarted, quiz, timeRemaining, submitted]);

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer change
  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  // Start quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (!traineeData) {
      alert('User data not found');
      return;
    }

    // Verify all required questions are answered
    const unansweredQuestions = [];
    if (quiz.questions) {
      quiz.questions.forEach((q, idx) => {
        if (!answers[idx] || answers[idx].trim() === '') {
          unansweredQuestions.push(idx + 1);
        }
      });
    }

    if (unansweredQuestions.length > 0) {
      alert(`Please answer all questions before submitting. Unanswered: ${unansweredQuestions.join(', ')}`);
      return;
    }

    setSubmitting(true);
    try {
      // Convert answers to array format for server
      const answerArray = Object.keys(answers).map((key) => ({
        questionIndex: parseInt(key, 10),
        answer: answers[key]
      }));

      const payload = {
        quizId: parseInt(quizId, 10),
        traineeEmail: traineeData.email,
        traineeName: `${traineeData.firstName} ${traineeData.lastName}`.trim() || traineeData.username,
        answers: answerArray
      };

      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': traineeData.email },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        setSubmitResult(result);
        setSubmitted(true);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Failed to submit: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Quiz not found</p>
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

  // Show results after submission
  if (submitted && submitResult) {
    const attempt = submitResult.attempt;
    const isPassed = attempt.score >= quiz.passingMarks;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            {isPassed ? (
              <>
                <div className="mb-6">
                  <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
                </div>
                <h1 className="text-3xl font-bold text-green-600 mb-2">Quiz Passed!</h1>
                <p className="text-gray-600 mb-6">Great job! You have successfully completed the quiz.</p>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <AlertCircle className="w-20 h-20 text-red-600 mx-auto" />
                </div>
                <h1 className="text-3xl font-bold text-red-600 mb-2">Quiz Not Passed</h1>
                <p className="text-gray-600 mb-6">Keep practicing and try again.</p>
              </>
            )}

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Results</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Score:</span>
                  <span className="font-bold text-gray-800">
                    {attempt.score} / {attempt.totalMarks || quiz.totalMarks}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Passing Score:</span>
                  <span className="font-bold text-gray-800">{quiz.passingMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Status:</span>
                  <span className={`font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                    {attempt.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Attempt #:</span>
                  <span className="font-bold text-gray-800">{attempt.attemptCount}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Back to Courses
              </button>
              {!isPassed && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz pre-start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Courses
          </button>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
            <p className="text-gray-600 mb-6">{quiz.course}</p>

            {quiz.instructions && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Instructions</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{quiz.instructions}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Total Questions</p>
                <p className="text-2xl font-bold text-gray-800">{quiz.totalQuestions || (quiz.questions?.length || 0)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Duration</p>
                <p className="text-2xl font-bold text-gray-800">{quiz.duration} min</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Total Marks</p>
                <p className="text-2xl font-bold text-gray-800">{quiz.totalMarks}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Pass Score</p>
                <p className="text-2xl font-bold text-gray-800">{quiz.passingMarks}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Important:</strong> Once you start the quiz, you will have {quiz.duration} minutes to complete it. 
                Make sure all your answers are selected before submitting.
              </p>
            </div>

            <button
              onClick={handleStartQuiz}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold text-lg transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking screen
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with timer */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
            <p className="text-gray-600 text-sm">Question {Object.values(answers).filter(a => a).length} of {quiz.questions?.length || 0} answered</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeRemaining !== null && timeRemaining < 300 ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            <Clock className={`w-5 h-5 ${timeRemaining !== null && timeRemaining < 300 ? 'text-red-600' : 'text-gray-600'}`} />
            <span className={`font-mono font-bold text-lg ${timeRemaining !== null && timeRemaining < 300 ? 'text-red-600' : 'text-gray-800'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-6">
          {quiz.questions && quiz.questions.map((question, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {question.question}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Marks: <span className="font-bold">{question.marks || 0}</span>
                  </p>
                </div>
              </div>

              {/* Question type: Multiple Choice */}
              {question.type === 'multiple-choice' && (
                <div className="space-y-2 ml-11">
                  {question.options && question.options.map((option, optIdx) => (
                    <label key={optIdx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={option}
                        checked={answers[idx] === option}
                        onChange={(e) => handleAnswerChange(idx, e.target.value)}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-gray-800">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Question type: True/False */}
              {question.type === 'true-false' && (
                <div className="space-y-2 ml-11 flex gap-4">
                  {['True', 'False'].map((option) => (
                    <label key={option} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={option}
                        checked={answers[idx] === option}
                        onChange={(e) => handleAnswerChange(idx, e.target.value)}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-gray-800 font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Question type: Short Answer */}
              {question.type === 'short-answer' && (
                <div className="ml-11">
                  <textarea
                    value={answers[idx] || ''}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                  />
                  <p className="text-xs text-gray-600 mt-2">This answer will be reviewed by your instructor.</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit section */}
        <div className="bg-white rounded-lg shadow-md p-6 flex gap-4">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
          <button
            onClick={() => router.back()}
            disabled={submitting}
            className="px-6 py-3 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 font-semibold transition-colors"
          >
            Exit (Unsaved)
          </button>
        </div>

        {/* Confirmation modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Submit Quiz?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit? Your answers cannot be changed after submission.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    handleSubmit();
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
