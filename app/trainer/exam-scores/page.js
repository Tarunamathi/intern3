'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Plus, Trash2, Download, Eye, Calendar, 
  User, Award, BookOpen, ArrowLeft 
} from 'lucide-react';

export default function ExamScoresPage() {
  const router = useRouter();
  
  // State
  const [trainerData, setTrainerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState([]);
  const [examScores, setExamScores] = useState([]);
  const [selectedBatchForScores, setSelectedBatchForScores] = useState('');
  const [loadingScores, setLoadingScores] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [batchTrainees, setBatchTrainees] = useState([]);
  
  const [examForm, setExamForm] = useState({
    batchId: '',
    traineeEmail: '',
    traineeName: '',
    examTitle: '',
    examType: 'Quiz',
    courseId: '',
    totalMarks: '',
    obtainedMarks: '',
    examDate: '',
    document: null,
    remarks: ''
  });

  // ==================== EFFECTS ====================
  
  // Fetch trainer profile data
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
        console.error('Error fetching my courses', err);
      }
    };

    if (trainerData?.email) fetchMyCourses();
  }, [trainerData]);

  // Fetch exam scores when batch selected
  useEffect(() => {
    const fetchExamScores = async () => {
      if (!selectedBatchForScores) {
        setExamScores([]);
        return;
      }
      try {
        setLoadingScores(true);
        const response = await fetch(
          `/api/exam-scores/list?batchId=${selectedBatchForScores}&createdBy=${trainerData.email}`,
          {
            headers: {
              'x-user-email': trainerData.email
            }
          }
        );
        if (response.ok) {
          const scores = await response.json();
          setExamScores(scores);
        } else {
          setExamScores([]);
        }
      } catch (error) {
        console.error('Error fetching exam scores:', error);
        setExamScores([]);
      } finally {
        setLoadingScores(false);
      }
    };

    if (trainerData && selectedBatchForScores) {
      fetchExamScores();
    }
  }, [selectedBatchForScores, trainerData]);

  // ==================== HANDLERS ====================
  
  const handleExamFormChange = (field, value) => {
    setExamForm({ ...examForm, [field]: value });
  };

  const handleExamFileChange = (file) => {
    setExamForm({ ...examForm, document: file });
  };

  const handleCreateExamScore = async (e) => {
    e.preventDefault();
    try {
      if (!examForm.batchId || !examForm.traineeEmail || !examForm.traineeName || 
          !examForm.examTitle || !examForm.examType || examForm.totalMarks === '' || 
          examForm.obtainedMarks === '' || !examForm.examDate) {
        alert('Please fill required fields');
        return;
      }

      if (myCourses?.length > 0) {
        const found = myCourses.find(b => String(b.id) === String(examForm.batchId));
        if (!found) {
          alert('Selected batch is not valid. Please select a valid batch from the list.');
          return;
        }
      } else {
        alert('No batches assigned to you. Please contact admin to assign batches before recording exam scores.');
        return;
      }

      let documentPayload = null;
      if (examForm.document) {
        const toBase64 = (file) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

        const base64 = await toBase64(examForm.document);
        documentPayload = { name: examForm.document.name, data: base64 };
      }

      const fallbackUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
      const createdByEmail = trainerData?.email || fallbackUser?.email;

      if (!createdByEmail) {
        alert('Trainer identity not available. Please log in again.');
        return;
      }

      const payload = {
        batchId: Number(examForm.batchId),
        traineeEmail: examForm.traineeEmail,
        traineeName: examForm.traineeName,
        examTitle: examForm.examTitle,
        examType: examForm.examType,
        courseId: examForm.courseId ? Number(examForm.courseId) : null,
        totalMarks: Number(examForm.totalMarks),
        obtainedMarks: Number(examForm.obtainedMarks),
        examDate: examForm.examDate,
        document: documentPayload,
        remarks: examForm.remarks,
        createdBy: createdByEmail
      };

      const res = await fetch('/api/exam-scores/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Exam score saved successfully!');
        setExamForm({ 
          batchId: '', traineeEmail: '', traineeName: '', examTitle: '', 
          examType: 'Quiz', courseId: '', totalMarks: '', obtainedMarks: '', 
          examDate: '', document: null, remarks: '' 
        });
        setShowForm(false);
        // Refresh scores
        if (selectedBatchForScores) {
          const response = await fetch(
            `/api/exam-scores/list?batchId=${selectedBatchForScores}&createdBy=${trainerData.email}`
          );
          if (response.ok) {
            const scores = await response.json();
            setExamScores(scores);
          }
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Failed to save exam score');
      }
    } catch (err) {
      console.error('Error creating exam score:', err);
      alert('Error creating exam score. Please try again.');
    }
  };

  const handleDeleteScore = async (scoreId) => {
    if (!confirm('Are you sure you want to delete this exam score?')) return;
    try {
      const res = await fetch(`/api/exam-scores/${scoreId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Exam score deleted successfully');
        setExamScores(examScores.filter(s => s.id !== scoreId));
      } else {
        alert('Failed to delete exam score');
      }
    } catch (err) {
      console.error('Error deleting score:', err);
      alert('Error deleting exam score');
    }
  };

  const handleDownloadCertificate = (score) => {
    if (!score.document) {
      alert('No document available for this score');
      return;
    }
    // Implementation for downloading document
    const link = document.createElement('a');
    link.href = score.document;
    link.download = `exam-score-${score.id}.pdf`;
    link.click();
  };

  const calculatePercentage = (obtained, total) => {
    if (total === 0) return 0;
    return ((obtained / total) * 100).toFixed(2);
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Average';
    return 'Poor';
  };

  // Filter scores
  const filteredScores = examScores.filter(score => {
    if (filterStatus === 'All') return true;
    const percentage = calculatePercentage(score.obtainedMarks, score.totalMarks);
    if (filterStatus === 'Excellent') return percentage >= 80;
    if (filterStatus === 'Good') return percentage >= 60 && percentage < 80;
    if (filterStatus === 'Average') return percentage >= 40 && percentage < 60;
    if (filterStatus === 'Poor') return percentage < 40;
    return true;
  });

  if (loading || !trainerData) {
    return (
      <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto border border-white border-opacity-10 rounded-2xl p-6 flex items-center justify-center">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      <div className="flex-1 overflow-y-auto p-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Exam Scores</h1>
              <p className="text-gray-600 text-sm">Record and manage trainee exam scores</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Record Score
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add Exam Score Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-green-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Record Exam Score</h2>
            <form onSubmit={handleCreateExamScore} className="space-y-6">
              {/* Batch Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Select Batch *</label>
                <select
                  required
                  value={examForm.batchId}
                  onChange={(e) => {
                    const batch = myCourses.find(b => String(b.id) === e.target.value);
                    setExamForm({
                      ...examForm,
                      batchId: e.target.value,
                      courseId: batch?.courseId || '',
                      traineeEmail: '',
                      traineeName: ''
                    });

                    // Fetch trainees for this batch
                    const fetchTrainees = async () => {
                      try {
                        const res = await fetch(`/api/batches/${e.target.value}/students`);
                        if (res.ok) {
                          const data = await res.json();
                          setBatchTrainees(data.students || []);
                        }
                      } catch (err) {
                        console.error('Error fetching batch trainees:', err);
                      }
                    };
                    fetchTrainees();
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select batch</option>
                  {myCourses?.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchCode} - {batch.courseName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trainee Selection */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Select from Enrolled Trainees</label>
                  <select
                    value={examForm.traineeEmail}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setExamForm({
                          ...examForm,
                          traineeEmail: "",
                          traineeName: ""
                        });
                        return;
                      }
                      const trainee = batchTrainees.find(t => t.studentEmail === e.target.value);
                      if (trainee) {
                        setExamForm({
                          ...examForm,
                          traineeEmail: trainee.studentEmail,
                          traineeName: `${trainee.student.firstName} ${trainee.student.lastName}`.trim()
                        });
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- Select from enrolled trainees --</option>
                    {batchTrainees.map((trainee) => (
                      <option key={trainee.id} value={trainee.studentEmail}>
                        {trainee.student.firstName} {trainee.student.lastName} ({trainee.studentEmail})
                      </option>
                    ))}
                  </select>
                  {batchTrainees.length === 0 && examForm.batchId && (
                    <p className="mt-2 text-sm text-yellow-600">No trainees enrolled in this batch yet.</p>
                  )}
                </div>

                <div className="border-t pt-6">
                  <label className="block text-gray-700 font-medium mb-2">Or Enter Trainee Details Manually</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Trainee Name *</label>
                      <input
                        type="text"
                        required
                        value={examForm.traineeName}
                        onChange={(e) => handleExamFormChange('traineeName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter trainee's full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Trainee Email *</label>
                      <input
                        type="email"
                        required
                        value={examForm.traineeEmail}
                        onChange={(e) => handleExamFormChange('traineeEmail', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter trainee's email"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Exam Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Exam Title *</label>
                  <input
                    type="text"
                    required
                    value={examForm.examTitle}
                    onChange={(e) => handleExamFormChange('examTitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Mid-term Exam"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Exam Type *</label>
                  <select
                    value={examForm.examType}
                    onChange={(e) => handleExamFormChange('examType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Quiz">Quiz</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Mid-term">Mid-term</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
              </div>

              {/* Marks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Total Marks *</label>
                  <input
                    type="number"
                    required
                    value={examForm.totalMarks}
                    onChange={(e) => handleExamFormChange('totalMarks', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="100"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Obtained Marks *</label>
                  <input
                    type="number"
                    required
                    value={examForm.obtainedMarks}
                    onChange={(e) => handleExamFormChange('obtainedMarks', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="85"
                    min="0"
                  />
                </div>
              </div>

              {/* Exam Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Exam Date *</label>
                <input
                  type="date"
                  required
                  value={examForm.examDate}
                  onChange={(e) => handleExamFormChange('examDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Attach Document</label>
                <input
                  type="file"
                  onChange={(e) => handleExamFileChange(e.target.files[0])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Remarks</label>
                <textarea
                  value={examForm.remarks}
                  onChange={(e) => handleExamFormChange('remarks', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Add any additional remarks..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setExamForm({
                      batchId: '', traineeEmail: '', traineeName: '', examTitle: '',
                      examType: 'Quiz', courseId: '', totalMarks: '', obtainedMarks: '',
                      examDate: '', document: null, remarks: ''
                    });
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Batch Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-gray-700 font-medium mb-3">Select Batch to View Scores *</label>
          <select
            value={selectedBatchForScores}
            onChange={(e) => setSelectedBatchForScores(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a batch</option>
            {myCourses?.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.batchCode} - {batch.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Tabs */}
        {selectedBatchForScores && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {['All', 'Excellent', 'Good', 'Average', 'Poor'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterStatus(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterStatus
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {/* Exam Scores Table */}
        {selectedBatchForScores && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loadingScores ? (
              <div className="p-8 text-center text-gray-600">Loading exam scores...</div>
            ) : filteredScores.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No exam scores recorded yet for this batch</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trainee Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Exam Title</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Marks</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Percentage</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Performance</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredScores.map((score) => {
                      const percentage = calculatePercentage(score.obtainedMarks, score.totalMarks);
                      const performanceColor = getPerformanceColor(percentage);
                      const badge = getPerformanceBadge(percentage);
                      return (
                        <tr key={score.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                                {score.traineeName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{score.traineeName}</div>
                                <div className="text-sm text-gray-500">{score.traineeEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-800">{score.examTitle}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                              {score.examType}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-yellow-600" />
                              <span className="font-semibold text-gray-800">
                                {score.obtainedMarks}/{score.totalMarks}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-800">{percentage}%</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${performanceColor}`}>
                              {badge}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <Calendar className="w-4 h-4" />
                              {new Date(score.examDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {score.document && (
                                <button
                                  onClick={() => handleDownloadCertificate(score)}
                                  title="Download Document"
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteScore(score.id)}
                                title="Delete Score"
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
  );
}