"use client";
import { useState, useEffect } from "react";

// Helper for calculating duration in weeks
function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return "";
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) return "Invalid dates";
  const diffTime = Math.abs(end - start);
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks + (diffWeeks === 1 ? " Week" : " Weeks");
}

// Generate unique batch code
function generateBatchCode(courseName, startDate) {
  const coursePrefix = courseName.substring(0, 3).toUpperCase();
  const date = new Date(startDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${coursePrefix}${year}${month}${Date.now().toString().slice(-4)}`;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOUR_SLOTS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTE_SLOTS = ['00', '15', '30', '45'];

export default function BatchManagementPage() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBatch, setEditingBatch] = useState(null);
  const [newBatch, setNewBatch] = useState({
    batchName: "",
    courseId: "",
    trainerEmail: "",
    coordinatorEmail: "",
    traineeEmails: [],
    startDate: "",
    endDate: "",
    institutionName: "",
    schedule: {},
    totalStudents: 0,
    status: "Upcoming",
  });

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch batches
      const batchRes = await fetch('/api/batch');
      const batchData = batchRes.ok ? await batchRes.json() : [];
      setBatches(batchData);
      
      // Fetch courses
      const courseRes = await fetch('/api/admin/courses');
      const courseData = courseRes.ok ? await courseRes.json() : { courses: [] };
      setCourses(Array.isArray(courseData) ? courseData : (courseData.courses || []));
      
      // Fetch trainers
      const trainerRes = await fetch('/api/admin/trainers');
      const trainerData = trainerRes.ok ? await trainerRes.json() : { trainers: [] };
      setTrainers(Array.isArray(trainerData) ? trainerData : (trainerData.trainers || []));
      
      // Fetch trainees
      const traineeRes = await fetch('/api/admin/trainees');
      const traineeData = traineeRes.ok ? await traineeRes.json() : { trainees: [] };
      setTrainees(Array.isArray(traineeData) ? traineeData : (traineeData.trainees || []));

      // Fetch coordinators
      const coordinatorRes = await fetch('/api/coordinator/list');
      const coordinatorData = coordinatorRes.ok ? await coordinatorRes.json() : [];
      setCoordinators(Array.isArray(coordinatorData) ? coordinatorData : []);

      // Fetch institutions
      const institutionRes = await fetch('/api/institution');
      const institutionData = institutionRes.ok ? await institutionRes.json() : [];
      setInstitutions(Array.isArray(institutionData) ? institutionData : []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get course details by ID
  const getCourse = (courseId) => {
    return courses.find(c => c.id === courseId);
  };

  // Get trainer details by email
  const getTrainer = (email) => {
    return trainers.find(t => t.email === email);
  };

  // Get coordinator details by email
  const getCoordinator = (email) => {
    return coordinators.find(c => c.email === email);
  };

  // Get enrolled trainees for batch
  const getBatchTrainees = (batch) => {
    if (!batch.students) return [];
    return batch.students.map(s => {
      const trainee = trainees.find(t => t.email === s.studentEmail);
      return trainee;
    }).filter(Boolean);
  };

  const filteredBatches = batches.filter(batch => {
    const course = getCourse(batch.courseId);
    const trainer = getTrainer(batch.trainerEmail);
    const search = searchTerm.toLowerCase();
    
    return batch.batchName.toLowerCase().includes(search) ||
           batch.batchCode.toLowerCase().includes(search) ||
           (course?.name || '').toLowerCase().includes(search) ||
           (trainer?.firstName || '').toLowerCase().includes(search) ||
           (trainer?.lastName || '').toLowerCase().includes(search);
  });

  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
  const pagedBatches = filteredBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusColors = {
    Active: "bg-green-500",
    Upcoming: "bg-blue-500",
    Completed: "bg-gray-600",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newBatch.batchName || !newBatch.courseId || !newBatch.trainerEmail) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const course = getCourse(parseInt(newBatch.courseId));
      if (!course) {
        alert("Invalid course selected");
        return;
      }

      const batchData = {
        batchName: newBatch.batchName,
        batchCode: editingBatch ? editingBatch.batchCode : generateBatchCode(course.name, newBatch.startDate),
        courseId: parseInt(newBatch.courseId),
        courseName: course.name,
        trainerEmail: newBatch.trainerEmail,
        coordinatorEmail: newBatch.coordinatorEmail,
        startDate: newBatch.startDate,
        endDate: newBatch.endDate,
        institutionName: newBatch.institutionName,
        schedule: newBatch.schedule,
        totalStudents: parseInt(newBatch.totalStudents) || newBatch.traineeEmails.length,
        status: newBatch.status,
        traineeEmails: newBatch.traineeEmails,
      };

      let res;
      if (editingBatch) {
        res = await fetch(`/api/batch/${editingBatch.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batchData)
        });
      } else {
        res = await fetch('/api/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batchData)
        });
      }

      if (res.ok) {
        const result = await res.json();
        if (editingBatch) {
          setBatches(batches.map(b => b.id === editingBatch.id ? result : b));
        } else {
          setBatches([result, ...batches]);
        }
        alert(editingBatch ? 'Batch updated successfully!' : 'Batch created successfully!');
        resetForm();
      } else {
        const error = await res.json();
        alert(error.error || 'An error occurred while saving the batch');
      }
    } catch (error) {
      console.error('Error saving batch:', error);
      alert('An error occurred while saving the batch');
    }
  };

  const resetForm = () => {
    setNewBatch({
      batchName: "",
      courseId: "",
      trainerEmail: "",
      coordinatorEmail: "",
      traineeEmails: [],
      startDate: "",
      endDate: "",
      institutionName: "",
      schedule: {},
      totalStudents: 0,
      status: "Upcoming",
    });
    setShowForm(false);
    setEditingBatch(null);
  };

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setNewBatch({
      batchName: batch.batchName,
      courseId: batch.courseId.toString(),
      trainerEmail: batch.trainerEmail,
      coordinatorEmail: batch.coordinatorEmail || "",
      traineeEmails: batch.students?.map(s => s.studentEmail) || [],
      startDate: new Date(batch.startDate).toISOString().split('T')[0],
      endDate: new Date(batch.endDate).toISOString().split('T')[0],
      institutionName: batch.institutionName,
      schedule: batch.schedule || {},
      totalStudents: batch.totalStudents,
      status: batch.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (batch) => {
    if (!window.confirm(`Are you sure you want to delete batch "${batch.batchName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/batch/${batch.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setBatches(batches.filter(b => b.id !== batch.id));
        alert('Batch deleted successfully!');
        if ((currentPage - 1) * itemsPerPage >= batches.length - 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        alert('Failed to delete batch');
      }
    } catch (error) {
      console.error('Error deleting batch:', error);
      alert('An error occurred while deleting the batch');
    }
  };

  const toggleTrainee = (email) => {
    const emails = newBatch.traineeEmails.includes(email)
      ? newBatch.traineeEmails.filter(e => e !== email)
      : [...newBatch.traineeEmails, email];
    setNewBatch({ ...newBatch, traineeEmails: emails });
  };

  const toggleScheduleSlot = (day, time) => {
    const key = `${day}-${time}`;
    setNewBatch(prev => {
      const updatedSchedule = { ...prev.schedule };
      if (updatedSchedule[key]) {
        delete updatedSchedule[key];
      } else {
        updatedSchedule[key] = true;
      }
      return { ...prev, schedule: updatedSchedule };
    });
  };

  const goPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col p-0 text-black font-sans">
      <div className="w-full bg-green-700 py-8 shadow flex justify-center">
        <h1 className="text-white text-4xl font-bold">Batch Management System</h1>
      </div>
      
      <div className="flex flex-col w-full flex-1 px-6 py-8 max-w-7xl mx-auto">
        <div className="flex w-full justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by batch, code, course, or trainer..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
          />
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
          >
            + Create Batch
          </button>
        </div>

        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left text-sm">
              <thead className="bg-green-50">
                <tr className="border-b border-gray-300">
                  <th className="px-4 py-3 font-semibold">Batch Code</th>
                  <th className="px-4 py-3 font-semibold">Batch Name</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Trainer</th>
                  <th className="px-4 py-3 font-semibold">Institution</th>
                  <th className="px-4 py-3 font-semibold">Trainees</th>
                  <th className="px-4 py-3 font-semibold">Students</th>
                  <th className="px-4 py-3 font-semibold">Duration</th>
                  <th className="px-4 py-3 font-semibold">Start Date</th>
                  <th className="px-4 py-3 font-semibold">End Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedBatches.length > 0 ? (
                  pagedBatches.map((batch, idx) => {
                    const course = getCourse(batch.courseId);
                    const trainer = getTrainer(batch.trainerEmail);
                    const institution = institutions.find(i => i.name === batch.location);
                    const batchTrainees = getBatchTrainees(batch);
                    
                      return (
                      <tr
                        key={batch.id}
                        className={idx % 2 === 0 ? "bg-white/5" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 font-mono text-xs">{batch.batchCode}</td>
                        <td className="px-4 py-3 font-semibold">{batch.batchName}</td>
                        <td className="px-4 py-3">{course?.name || 'N/A'}</td>
                        <td className="px-4 py-3">
                          {trainer ? `${trainer.firstName} ${trainer.lastName}` : 'N/A'}
                        </td>
                        <td className="px-4 py-3">{institution?.name || batch.location || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <div className="text-xs max-w-xs">
                            {batchTrainees.length > 0 ? (
                              <div className="space-y-1">
                                {batchTrainees.slice(0, 2).map((t, i) => (
                                  <div key={`trainee-${i}`}>{t.firstName} {t.lastName}</div>
                                ))}
                                {batchTrainees.length > 2 && (
                                  <div className="text-gray-600 italic">+{batchTrainees.length - 2} more</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500">No trainees</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {batch.enrolledStudents} / {batch.totalStudents}
                        </td>
                        <td className="px-4 py-3">
                          {calculateDuration(batch.startDate, batch.endDate)}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(batch.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(batch.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-white rounded-full px-3 py-1 text-xs font-semibold ${statusColors[batch.status] || 'bg-gray-500'}`}>
                            {batch.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-3">
                          <button
                            onClick={() => handleEdit(batch)}
                            className="text-green-700 hover:underline font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(batch)}
                            className="text-red-600 hover:underline font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-gray-500 italic">
                      No batches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between px-4 py-4 bg-gray-50 border-t border-gray-200 items-center">
            <button
              onClick={goPrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed text-gray-500"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Previous
            </button>
            <div className="font-semibold text-gray-700">
              Page {currentPage} of {totalPages || 1}
            </div>
            <button
              onClick={goNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-200 cursor-not-allowed text-gray-500"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showForm && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6 text-green-700">
              {editingBatch ? "Edit Batch" : "Create New Batch"}
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2 text-gray-700">
                    Batch Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newBatch.batchName}
                    onChange={(e) => setNewBatch({ ...newBatch, batchName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                    placeholder="e.g., Advanced Farming Batch 2025"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newBatch.courseId}
                    onChange={(e) => setNewBatch({ ...newBatch, courseId: e.target.value, traineeEmails: [] })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course, idx) => (
                      <option key={`course-${course.id || idx}`} value={course.id}>
                        {course.name} ({course.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700">
                    Trainer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newBatch.trainerEmail}
                    onChange={(e) => setNewBatch({ ...newBatch, trainerEmail: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    <option value="">Select Trainer</option>
                    {trainers.map((trainer, idx) => (
                      <option key={`trainer-${trainer.email || idx}`} value={trainer.email}>
                        {trainer.firstName} {trainer.lastName} - {trainer.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700">Coordinator</label>
                  <select
                    value={newBatch.coordinatorEmail}
                    onChange={(e) => setNewBatch({ ...newBatch, coordinatorEmail: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    <option value="">Select Coordinator (Optional)</option>
                    {coordinators.map((coordinator, idx) => (
                      <option key={`coordinator-${coordinator.email || idx}`} value={coordinator.email}>
                        {coordinator.firstName} {coordinator.lastName} - {coordinator.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700">Institution Name</label>
                  <select
                    value={newBatch.institutionName}
                    onChange={(e) => setNewBatch({ ...newBatch, institutionName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    <option value="">Select Institution (Optional)</option>
                    {institutions.map((inst, idx) => (
                      <option key={`institution-${inst.id || idx}`} value={inst.name}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700">Status</label>
                  <div className="flex gap-4 pt-2">
                    {["Upcoming", "Active", "Completed"].map(status => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={newBatch.status === status}
                          onChange={(e) => setNewBatch({ ...newBatch, status: e.target.value })}
                          className="w-4 h-4 text-green-600 focus:ring-green-500"
                        />
                        <span>{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={newBatch.startDate}
                    onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={newBatch.endDate}
                    onChange={(e) => setNewBatch({ ...newBatch, endDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700">Total Students Capacity</label>
                  <input
                    type="number"
                    value={newBatch.totalStudents}
                    onChange={(e) => setNewBatch({ ...newBatch, totalStudents: e.target.value })}
                    min="0"
                    placeholder="e.g., 30"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block font-medium text-gray-700">Weekly Schedule</label>
                
                <div className="mb-4">
                  <label className="block font-medium mb-2 text-sm text-gray-700">Select Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map(day => {
                      const isSelected = newBatch.schedule[`${day}-selected`];
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setNewBatch({
                              ...newBatch,
                              schedule: {
                                ...newBatch.schedule,
                                [`${day}-selected`]: !isSelected
                              }
                            });
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            isSelected
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 border border-green-300 rounded-lg bg-green-50">
                  <label className="block font-medium mb-3 text-sm text-gray-700">Set Time</label>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-gray-600 mb-2 font-semibold">Start Time</label>
                      <div className="flex gap-2">
                        <select
                          value={newBatch.schedule['startHour'] || '09'}
                          onChange={(e) => {
                            setNewBatch({
                              ...newBatch,
                              schedule: { ...newBatch.schedule, startHour: e.target.value }
                            });
                          }}
                          className="flex-1 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700 bg-white/5 text-sm"
                        >
                          <option value="">Hour</option>
                          {HOUR_SLOTS.map(hour => (
                            <option key={hour} value={hour}>
                              {hour}
                            </option>
                          ))}
                        </select>
                        <select
                          value={newBatch.schedule['startMinute'] || '00'}
                          onChange={(e) => {
                            setNewBatch({
                              ...newBatch,
                              schedule: { ...newBatch.schedule, startMinute: e.target.value }
                            });
                          }}
                          className="flex-1 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700 bg-white/5 text-sm"
                        >
                          <option value="">Min</option>
                          {MINUTE_SLOTS.map(min => (
                            <option key={min} value={min}>
                              {min}
                            </option>
                          ))}
                        </select>
                        <select
                          value={newBatch.schedule['startPeriod'] || 'AM'}
                          onChange={(e) => {
                            setNewBatch({
                              ...newBatch,
                              schedule: { ...newBatch.schedule, startPeriod: e.target.value }
                            });
                          }}
                          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700 bg-white/5 text-sm font-semibold"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-2 font-semibold">End Time</label>
                      <div className="flex gap-2">
                        <select
                          value={newBatch.schedule['endHour'] || '05'}
                          onChange={(e) => {
                            setNewBatch({
                              ...newBatch,
                              schedule: { ...newBatch.schedule, endHour: e.target.value }
                            });
                          }}
                          className="flex-1 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700 bg-white/5 text-sm"
                        >
                          <option value="">Hour</option>
                          {HOUR_SLOTS.map(hour => (
                            <option key={hour} value={hour}>
                              {hour}
                            </option>
                          ))}
                        </select>
                        <select
                          value={newBatch.schedule['endMinute'] || '00'}
                          onChange={(e) => {
                            setNewBatch({
                              ...newBatch,
                              schedule: { ...newBatch.schedule, endMinute: e.target.value }
                            });
                          }}
                          className="flex-1 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700 bg-white/5 text-sm"
                        >
                          <option value="">Min</option>
                          {MINUTE_SLOTS.map(min => (
                            <option key={min} value={min}>
                              {min}
                            </option>
                          ))}
                        </select>
                        <select
                          value={newBatch.schedule['endPeriod'] || 'PM'}
                          onChange={(e) => {
                            setNewBatch({
                              ...newBatch,
                              schedule: { ...newBatch.schedule, endPeriod: e.target.value }
                            });
                          }}
                          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700 bg-white/5 text-sm font-semibold"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-3 text-gray-700">
                  Select Trainees to Enroll
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
                  {trainees.length > 0 ? (
                    <div className="space-y-2">
                      {trainees.map((trainee, idx) => (
                        <label key={`trainee-${trainee.email || idx}`} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={newBatch.traineeEmails.includes(trainee.email)}
                            onChange={() => toggleTrainee(trainee.email)}
                            className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{trainee.firstName} {trainee.lastName}</div>
                            <div className="text-sm text-gray-500">{trainee.email}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No trainees available</p>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {newBatch.traineeEmails.length} trainee(s) selected
                </p>
              </div>

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  {editingBatch ? "Update Batch" : "Create Batch"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}