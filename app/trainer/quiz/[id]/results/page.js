'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Eye, Download } from 'lucide-react';

export default function QuizResultsPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id;

  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  // Fetch quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        if (res.ok) {
          setQuiz(await res.json());
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    if (quizId) fetchQuiz();
  }, [quizId]);

  // Fetch attempts
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await fetch(`/api/trainer/quiz/${quizId}/attempts`);
        if (res.ok) {
          setAttempts(await res.json());
        }
      } catch (error) {
        console.error('Error fetching attempts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) fetchAttempts();
  }, [quizId]);

  // Calculate statistics
  const totalAttempts = attempts.length;
  const uniqueTrainees = new Set(attempts.map(a => a.traineeEmail)).size;
  const passedCount = attempts.filter(a => a.status === 'Passed').length;
  const failedCount = attempts.filter(a => a.status === 'Failed').length;
  const averageScore = attempts.length > 0
    ? (attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length).toFixed(2)
    : 0;

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto border border-white border-opacity-10 rounded-2xl p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto border border-white border-opacity-10 rounded-2xl p-6">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Quiz
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz?.title}</h1>
          <p className="text-gray-600">{quiz?.course}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Total Attempts</p>
            <p className="text-3xl font-bold text-gray-800">{totalAttempts}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Unique Trainees</p>
            <p className="text-3xl font-bold text-gray-800">{uniqueTrainees}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
            <p className="text-gray-600 text-sm">Passed</p>
            <p className="text-3xl font-bold text-green-600">{passedCount}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
            <p className="text-gray-600 text-sm">Failed</p>
            <p className="text-3xl font-bold text-red-600">{failedCount}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
            <p className="text-gray-600 text-sm">Average Score</p>
            <p className="text-3xl font-bold text-blue-600">{averageScore}</p>
          </div>
        </div>

        {/* Attempts Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Trainee Attempts</h2>
          </div>
          
          {attempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trainee Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Attempt</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Score</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt, idx) => {
                    const isPassed = attempt.status === 'Passed';
                    return (
                      <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-sm text-gray-800 font-medium">{attempt.traineeName || attempt.studentName}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{attempt.traineeEmail || attempt.studentEmail}</td>
                        <td className="px-6 py-3 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                            {attempt.attemptCount || attempt.attemptNumber}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="font-bold text-gray-800">{attempt.score}/{attempt.totalMarks}</span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isPassed 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {attempt.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center text-sm text-gray-600">
                          {attempt.attemptedAt ? new Date(attempt.attemptedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <button
                            onClick={() => setSelectedAttempt(attempt)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-600">
              <p>No attempts yet</p>
            </div>
          )}
        </div>

        {/* Attempt Detail Modal */}
        {selectedAttempt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-2xl w-full my-8">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-gray-800">
                  Attempt #{selectedAttempt.attemptCount} by {selectedAttempt.traineeName}
                </h3>
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Score</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {selectedAttempt.score}/{selectedAttempt.totalMarks}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Status</p>
                      <p className={`text-lg font-bold ${
                        selectedAttempt.status === 'Passed' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedAttempt.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Date</p>
                      <p className="text-lg font-bold text-gray-800">
                        {selectedAttempt.attemptedAt ? new Date(selectedAttempt.attemptedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Answers (if available) */}
                {selectedAttempt.answers && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Trainee Answers</h4>
                    {Array.isArray(selectedAttempt.answers) ? (
                      selectedAttempt.answers.map((ans, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium text-gray-800">Question {ans.questionIndex + 1}</p>
                          <p className="text-gray-600 mt-2">Answer: <span className="font-mono text-sm">{ans.answer}</span></p>
                        </div>
                      ))
                    ) : typeof selectedAttempt.answers === 'object' ? (
                      Object.entries(selectedAttempt.answers).map(([qIdx, answer]) => (
                        <div key={qIdx} className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium text-gray-800">Question {parseInt(qIdx) + 1}</p>
                          <p className="text-gray-600 mt-2">Answer: <span className="font-mono text-sm">{answer}</span></p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No answer details available</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
