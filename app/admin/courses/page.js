'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Plus, X, Clock, Users, FileText, Trash2, Download, Eye } from 'lucide-react';

export default function AdminCoursesPage() {
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [coursesData, setCoursesData] = useState([]);
  const [enrolledCounts, setEnrolledCounts] = useState({});
  const [showEnrolledModal, setShowEnrolledModal] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [selectedCourseForEnrolled, setSelectedCourseForEnrolled] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    duration: '',
    startDate: '',
    endDate: '',
    startTime: '',
    startTimeFormat: 'AM',
    endTime: '',
    endTimeFormat: 'AM',
    daysOfWeek: [],
    modules: [{ title: '', file: null }],
    beneficiaries: [''],
    color: 'from-green-500 to-green-600',
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserData(user);
          setUserRole(user.role === 'admin' ? 'admin' : user.role === 'trainer' ? 'trainer' : null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userData) return;
      try {
        let url = '/api/admin/courses';
        if (userRole === 'trainer' && userData?.email) {
          url += `?createdBy=${userData.email}&role=trainer`;
        }
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setCoursesData(data.courses || []);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [userData, userRole]);

  const resetForm = () => {
    setNewCourse({
      title: '', duration: '', startDate: '', endDate: '', startTime: '', startTimeFormat: 'AM',
      endTime: '', endTimeFormat: 'AM', daysOfWeek: [], modules: [{ title: '', file: null }],
      beneficiaries: [''], color: 'from-green-500 to-green-600', image: null, imagePreview: null,
    });
    setEditCourseId(null);
  };

  const handleOpenEdit = (course) => {
    setEditCourseId(course.id);
    setNewCourse({
      title: course.name || course.title || '',
      duration: course.duration || '',
      startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : '',
      endDate: course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : '',
      startTime: course.startTime || '',
      startTimeFormat: 'AM',
      endTime: course.endTime || '',
      endTimeFormat: 'AM',
      daysOfWeek: course.daysOfWeek || [],
      modules: (course.modules || []).map((m) => ({
        title: m.title,
        file: null,
        fileUrl: (m.materials?.[0]?.fileUrl) || null,
      })),
      beneficiaries: course.beneficiaries?.length ? course.beneficiaries : [''],
      color: course.color || 'from-green-500 to-green-600',
      image: course.image || null,
      imagePreview: course.image || null,
    });
    setShowCourseModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' });
      if (res.ok) {
        setCoursesData(prev => prev.filter(c => c.id !== courseId));
        alert('Course deleted successfully');
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course', err);
    }
  };

  const handleAddModule = () => {
    setNewCourse({ ...newCourse, modules: [...newCourse.modules, { title: '', file: null }] });
  };

  const handleRemoveModule = (index) => {
    setNewCourse({ ...newCourse, modules: newCourse.modules.filter((_, i) => i !== index) });
  };

  const handleModuleTitleChange = (index, value) => {
    const updated = [...newCourse.modules];
    updated[index] = { ...updated[index], title: value };
    setNewCourse({ ...newCourse, modules: updated });
  };

  const handleModuleFileChange = (index, file) => {
    const updated = [...newCourse.modules];
    updated[index] = { ...updated[index], file, fileUrl: null };
    setNewCourse({ ...newCourse, modules: updated });
  };

  const handleAddBeneficiary = () => {
    setNewCourse({ ...newCourse, beneficiaries: [...newCourse.beneficiaries, ''] });
  };

  const handleRemoveBeneficiary = (index) => {
    setNewCourse({ ...newCourse, beneficiaries: newCourse.beneficiaries.filter((_, i) => i !== index) });
  };

  const handleBeneficiaryChange = (index, value) => {
    const updated = [...newCourse.beneficiaries];
    updated[index] = value;
    setNewCourse({ ...newCourse, beneficiaries: updated });
  };

  const handleCreateCourse = async () => {
    const filteredModules = newCourse.modules.filter(m => m?.title?.trim());
    const filteredBeneficiaries = newCourse.beneficiaries.filter(b => b?.trim());
    
    if (!newCourse.title || filteredModules.length === 0 || filteredBeneficiaries.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setUploadingFiles(true);

      const modulesPayload = await Promise.all(
        filteredModules.map(async (m) => {
          if (m.file) {
            const formData = new FormData();
            formData.append('file', m.file);
            formData.append('folder', 'courses');
            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!uploadRes.ok) throw new Error('Upload failed');
            const uploadData = await uploadRes.json();
            return { title: m.title, fileUrl: uploadData.url || uploadData.fileUrl, fileName: uploadData.fileName };
          }
          return { title: m.title };
        })
      );

      let uploadedImageUrl = null;
      if (newCourse.image && typeof newCourse.image === 'object') {
        const imgForm = new FormData();
        imgForm.append('file', newCourse.image);
        imgForm.append('folder', 'courses');
        const imgRes = await fetch('/api/upload', { method: 'POST', body: imgForm });
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          uploadedImageUrl = imgData.url || imgData.fileUrl || null;
        }
      }

      const courseData = {
        name: newCourse.title,
        category: 'General',
        duration: newCourse.duration,
        startDate: newCourse.startDate,
        endDate: newCourse.endDate,
        startTime: newCourse.startTime,
        endTime: newCourse.endTime,
        daysOfWeek: newCourse.daysOfWeek,
        modules: modulesPayload.map((m, idx) => ({
          title: m.title,
          description: '',
          order: idx + 1,
          materials: m.fileUrl ? [{ title: m.title, fileUrl: m.fileUrl, mimeType: 'application/pdf' }] : []
        })),
        createdBy: userData.email,
        beneficiaries: filteredBeneficiaries,
        image: uploadedImageUrl || null,
      };

      const headers = { 'Content-Type': 'application/json' };
      const response = editCourseId
        ? await fetch(`/api/admin/courses/${editCourseId}`, { method: 'PATCH', headers, body: JSON.stringify(courseData) })
        : await fetch('/api/admin/courses', { method: 'POST', headers, body: JSON.stringify(courseData) });

      if (response.ok) {
        const savedCourse = await response.json();
        if (editCourseId) {
          setCoursesData(prev => prev.map(c => c.id === savedCourse.id ? savedCourse : c));
          alert('✅ Course updated successfully!');
        } else {
          setCoursesData([savedCourse, ...coursesData]);
          alert('✅ Course created successfully!');
        }
        setShowCourseModal(false);
        resetForm();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert('❌ ' + (errorData.error || 'Failed to save course'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleShowEnrolled = async (courseId, courseName) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/enrollments`);
      if (res.ok) {
        const data = await res.json();
        const students = data.students || [];
        setEnrolledCounts((p) => ({ ...p, [courseId]: students.length }));
        setSelectedCourseForEnrolled(courseName);
        setEnrolledStudents(students);
        setShowEnrolledModal(true);
      } else {
        alert('❌ Failed to fetch enrolled students');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error fetching enrolled students');
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-green-700/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📚 Training Courses</h1>
            <p className="text-gray-600">{userRole === 'admin' ? 'Manage all training courses' : 'Manage your courses'}</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowCourseModal(true); }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus size={20} />
            Create Course
          </button>
        </div>

        {showCourseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white/5 z-10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-gray-800">{editCourseId ? '✏️ Edit Course' : '➕ Create New Course'}</h3>
                <button onClick={() => { setShowCourseModal(false); resetForm(); }} className="p-2 hover:bg-white/5 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Course Title *</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    className="w-full px-4 py-3 border border-white/20 bg-white/5 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Course Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const preview = file ? URL.createObjectURL(file) : null;
                      setNewCourse({ ...newCourse, image: file, imagePreview: preview });
                    }}
                    className="w-full px-4 py-2 border border-white/20 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {newCourse.imagePreview && <img src={newCourse.imagePreview} alt="preview" className="mt-2 w-48 h-28 object-cover rounded" />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                    <input type="date" value={newCourse.startDate} onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })} className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">End Date</label>
                    <input type="date" value={newCourse.endDate} onChange={(e) => setNewCourse({ ...newCourse, endDate: e.target.value })} className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">📚 Course Modules *</label>
                  {newCourse.modules.map((module, index) => (
                    <div key={index} className="mb-3 p-4 rounded-lg bg-white/5 border border-white/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Module {index + 1}</span>
                        {newCourse.modules.length > 1 && (
                          <button type="button" onClick={() => handleRemoveModule(index)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input type="text" value={module.title} onChange={(e) => handleModuleTitleChange(index, e.target.value)} className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/5 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 text-gray-900" placeholder="Module title" />
                      <input type="file" onChange={(e) => handleModuleFileChange(index, e.target.files[0])} className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" accept=".pdf,.doc,.docx,.ppt,.pptx" />
                      {module.file && <p className="text-sm text-green-600 mt-1">✓ {module.file.name}</p>}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddModule} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <Plus className="w-4 h-4" />
                    Add Module
                  </button>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">👥 Beneficiaries *</label>
                  {newCourse.beneficiaries.map((beneficiary, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input type="text" value={beneficiary} onChange={(e) => handleBeneficiaryChange(index, e.target.value)} className="flex-1 px-4 py-2 border border-white/20 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900" placeholder="Beneficiary" />
                      {newCourse.beneficiaries.length > 1 && (
                        <button type="button" onClick={() => handleRemoveBeneficiary(index)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddBeneficiary} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <Plus className="w-4 h-4" />
                    Add Beneficiary
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => { setShowCourseModal(false); resetForm(); }} className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10" disabled={uploadingFiles}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleCreateCourse} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:bg-gray-400" disabled={uploadingFiles}>
                    {uploadingFiles ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        {editCourseId ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEnrolledModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white/5 z-10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold">📋 Enrolled Students - {selectedCourseForEnrolled}</h3>
                <button onClick={() => { setShowEnrolledModal(false); setEnrolledStudents([]); }} className="p-2 hover:bg-white/5 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                {enrolledStudents.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600">No students enrolled</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/5 border-b">
                        <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolledStudents.map((student, idx) => (
                        <tr key={idx} className="border-b hover:bg-white/5">
                          <td className="px-4 py-3 text-sm">{student.firstName} {student.lastName}</td>
                          <td className="px-4 py-3 text-sm">{student.email}</td>
                          <td className="px-4 py-3 text-sm">{student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {student.status || 'Enrolled'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {coursesData.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">Create your first course to get started</p>
              <button onClick={() => { resetForm(); setShowCourseModal(true); }} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Create Course
              </button>
            </div>
          ) : (
            coursesData.map((course) => (
              <div key={course.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {course.image ? (
                  <div
                    className="h-44 w-full bg-center bg-cover"
                    style={{ backgroundImage: `url(${course.image})` }}
                  />
                ) : null}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{course.name || course.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">Modules: {course.modules?.length || 0}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{enrolledCounts[course.id] || 0}</p>
                      <p className="text-gray-600 text-sm">Enrolled</p>
                    </div>
                  </div>
                  
                  {course.beneficiaries?.length > 0 && (
                    <p className="text-sm text-gray-600 mb-4">Beneficiaries: {course.beneficiaries.join(', ')}</p>
                  )}

                  <div className="flex gap-3 pt-4 border-t">
                    <button onClick={() => handleShowEnrolled(course.id, course.name)} className="flex-1 px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-medium">
                      View Students
                    </button>
                    <button onClick={() => handleOpenEdit(course)} className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100 font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}