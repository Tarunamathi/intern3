'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Plus, X, Clock, Users, FileText, Trash2, Edit, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TrainerCoursesPage() {
  const router = useRouter();
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [allCoursesData, setAllCoursesData] = useState([]);
  const [enrolledCounts, setEnrolledCounts] = useState({});
  const [userData, setUserData] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [showEnrolledModal, setShowEnrolledModal] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [selectedCourseForEnrolled, setSelectedCourseForEnrolled] = useState(null);
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    duration: '',
    startDate: '',
    endDate: '',
    modules: [{ title: '', file: null }],
    beneficiaries: [''],
    image: null,
  });
  const [editCourseId, setEditCourseId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const userRole = user.role?.toLowerCase() || '';
          if (userRole !== 'trainer') {
            router.push('/login');
            return;
          }
          setUserData(user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      }
    };
    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchAllCourses = async () => {
      if (!userData) return;
      
      try {
        setLoadingAll(true);
        const response = await fetch('/api/admin/courses');
        if (response.ok) {
          const data = await response.json();
          const list = data.courses || [];
          setAllCoursesData(list);
        } else if (response.status === 401) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching all courses:', error);
      } finally {
        setLoadingAll(false);
      }
    };
    
    fetchAllCourses();
  }, [userData, router]);

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
            
            if (!uploadRes.ok) {
              const errorData = await uploadRes.json();
              throw new Error(errorData.error || 'Upload failed');
            }
            
            const uploadData = await uploadRes.json();
            
            return {
              title: m.title,
              fileUrl: uploadData.url || uploadData.fileUrl,
              fileName: uploadData.fileName
            };
          }
          return { title: m.title };
        })
      );

      let uploadedImageUrl = null;
      if (newCourse.image && typeof newCourse.image === 'object') {
        try {
          const imgForm = new FormData();
          imgForm.append('file', newCourse.image);
          imgForm.append('folder', 'courses');
          const imgRes = await fetch('/api/upload', { method: 'POST', body: imgForm });
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            uploadedImageUrl = imgData.url || imgData.fileUrl || null;
          }
        } catch (err) {
          console.error('Error uploading course image:', err);
        }
      }

      const courseData = {
        name: newCourse.title,
        category: 'General',
        topics: 1,
        duration: newCourse.duration || '1 day',
        price: '₹0',
        description: '',
        startDate: newCourse.startDate,
        endDate: newCourse.endDate,
        modules: modulesPayload.map((m, idx) => ({
          title: m.title,
          description: '',
          order: idx + 1,
          materials: m.fileUrl ? [{ title: m.title, fileUrl: m.fileUrl, mimeType: 'application/pdf' }] : []
        })),
        createdBy: userData.email,
        image: uploadedImageUrl || null,
      };

      const url = editCourseId ? `/api/admin/courses/${editCourseId}` : '/api/admin/courses';
      const method = editCourseId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });

      if (response.ok) {
        const savedCourse = await response.json();
        if (editCourseId) {
          setAllCoursesData(prev => prev.map(c => c.id === savedCourse.id ? savedCourse : c));
          setEditCourseId(null);
        } else {
          setAllCoursesData([savedCourse, ...allCoursesData]);
        }

        setShowCourseModal(false);
        resetCourseForm();
        alert('✅ Course ' + (editCourseId ? 'updated' : 'created') + ' successfully!');
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

  const resetCourseForm = () => {
    setNewCourse({
      title: '',
      duration: '',
      startDate: '',
      endDate: '',
      modules: [{ title: '', file: null }],
      beneficiaries: [''],
      image: null,
    });
  };

  const handleCancelCreate = () => {
    setShowCourseModal(false);
    setEditCourseId(null);
    resetCourseForm();
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

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' });
      if (res.ok) {
        setAllCoursesData(prev => prev.filter(c => c.id !== courseId));
        alert('Course deleted successfully');
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error deleting course');
    }
  };

  const isCreatedByUser = (course) => course.createdBy === userData?.email;

  if (!userData) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={() => router.push('/trainer/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Training Courses</h1>
              <p className="text-gray-700 text-lg">Manage and organize your training courses</p>
            </div>
            <button
              onClick={() => {
                setEditCourseId(null);
                resetCourseForm();
                setShowCourseModal(true);
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg transition-all font-semibold"
            >
              <Plus size={20} />
              Create Course
            </button>
          </div>

          {showCourseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                  <h3 className="text-2xl font-bold text-gray-800">{editCourseId ? '✏️ Edit Course' : '➕ Create Course'}</h3>
                  <button onClick={handleCancelCreate} className="p-2 hover:bg-gray-100 rounded-full">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Course Image</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewCourse({ ...newCourse, image: e.target.files[0] || null })}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {newCourse.image && typeof newCourse.image === 'object' && (
                        <span className="text-blue-600 text-sm font-medium">{newCourse.image.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                      <input
                        type="date"
                        value={newCourse.startDate}
                        onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">End Date</label>
                      <input
                        type="date"
                        value={newCourse.endDate}
                        onChange={(e) => setNewCourse({ ...newCourse, endDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Duration</label>
                    <input
                      type="text"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 5 days"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-3">📚 Modules *</label>
                    <div className="space-y-3">
                      {newCourse.modules.map((module, idx) => (
                        <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-gray-700">Module {idx + 1}</span>
                            {newCourse.modules.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setNewCourse({ ...newCourse, modules: newCourse.modules.filter((_, i) => i !== idx) })}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => {
                              const updated = [...newCourse.modules];
                              updated[idx].title = e.target.value;
                              setNewCourse({ ...newCourse, modules: updated });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            placeholder="Module title"
                          />
                          <input
                            type="file"
                            onChange={(e) => {
                              const updated = [...newCourse.modules];
                              updated[idx].file = e.target.files[0];
                              setNewCourse({ ...newCourse, modules: updated });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewCourse({ ...newCourse, modules: [...newCourse.modules, { title: '', file: null }] })}
                      className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Module
                    </button>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-3">👥 Beneficiaries *</label>
                    <div className="space-y-2">
                      {newCourse.beneficiaries.map((ben, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={ben}
                            onChange={(e) => {
                              const updated = [...newCourse.beneficiaries];
                              updated[idx] = e.target.value;
                              setNewCourse({ ...newCourse, beneficiaries: updated });
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Beneficiary group"
                          />
                          {newCourse.beneficiaries.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setNewCourse({ ...newCourse, beneficiaries: newCourse.beneficiaries.filter((_, i) => i !== idx) })}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewCourse({ ...newCourse, beneficiaries: [...newCourse.beneficiaries, ''] })}
                      className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Beneficiary
                    </button>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      onClick={handleCancelCreate}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                      disabled={uploadingFiles}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateCourse}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400 font-medium"
                      disabled={uploadingFiles}
                    >
                      {uploadingFiles ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Uploading...
                        </>
                      ) : (editCourseId ? 'Update' : 'Create')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEnrolledModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                  <h3 className="text-2xl font-bold text-gray-800">📋 {selectedCourseForEnrolled}</h3>
                  <button onClick={() => setShowEnrolledModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  {enrolledStudents.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No students enrolled yet</p>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Enrollment Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrolledStudents.map((student, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-sm text-gray-800">{student.firstName} {student.lastName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{student.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {loadingAll ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading courses...</p>
              </div>
            </div>
          ) : allCoursesData.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-16 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Yet</h3>
              <p className="text-gray-600">Create your first course to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {allCoursesData.map((course, idx) => (
                <div 
                  key={course.id} 
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  <div 
                    className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden"
                    style={course.image ? {
                      backgroundImage: `linear-gradient(135deg, rgba(37,99,235,0.7) 0%, rgba(37,99,235,0.7) 100%), url(${course.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    } : undefined}
                  >
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                        Course {idx + 1}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{course.name || course.title}</h3>
                    
                    {course.beneficiaries && course.beneficiaries.length > 0 && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-1">👥 {course.beneficiaries.join(', ')}</p>
                    )}

                    <div className="flex items-center gap-1 text-gray-600 mb-4">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{course.duration}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-blue-600">{course.modules?.length || 0}</div>
                        <div className="text-xs text-gray-600">Modules</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-purple-600">{enrolledCounts[course.id] || 0}</div>
                        <div className="text-xs text-gray-600">Enrolled</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-xs font-semibold text-green-600">{course.status || 'Active'}</div>
                        <div className="text-xs text-gray-600">Status</div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-auto">
                      <button
                        onClick={() => handleShowEnrolled(course.id, course.name || course.title)}
                        className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        View Enrolled
                      </button>
                      <div className="flex gap-2">
                        {isCreatedByUser(course) && (
                          <>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="flex-1 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}