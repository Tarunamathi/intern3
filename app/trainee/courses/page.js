"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default function TraineeCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [enrolledMap, setEnrolledMap] = useState({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/courses");
        if (!mounted) return;
        if (res.ok) {
          const body = await res.json();
          setCourses(Array.isArray(body.courses) ? body.courses : (Array.isArray(body) ? body : []));
        } else {
          setCourses([]);
        }
        // load enrollments for current user (to show Enroll/Continue)
        try {
          const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
          const email = stored ? JSON.parse(stored).email : null;
          if (email) {
            const enr = await fetch('/api/trainee/enrollments', { headers: { 'x-user-email': email } });
            if (enr.ok) {
              const ed = await enr.json();
              const map = {};
              (Array.isArray(ed) ? ed : []).forEach((e) => {
                const batch = e.batch || {};
                const courseId = batch.courseId || e.courseId || (batch.course && batch.course.id);
                if (courseId) {
                  map[Number(courseId)] = batch.id || e.batchId || e.batch?.id;
                }
              });
              setEnrolledMap(map);
            }
          }
        } catch (e) {
          console.warn('enrollment fetch failed', e);
        }
      } catch (err) {
        console.error(err);
        setCourses([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    let mounted = true;
    const loadMaterials = async () => {
      try {
        const mats = [];
        if (Array.isArray(selectedCourse.modules)) {
          selectedCourse.modules.forEach((m, mi) => {
            if (Array.isArray(m.materials)) {
              m.materials.forEach((mat, mj) => mats.push({ id: `${mi}-${mj}`, title: mat.title || 'Untitled', fileUrl: mat.fileUrl, mimeType: mat.mimeType }));
            }
          });
        }
        if (!mounted) return;
        setMaterials(mats);
      } catch (err) {
        console.error('materials load err', err);
        setMaterials([]);
      }
    };
    loadMaterials();
    return () => { mounted = false; };
  }, [selectedCourse]);

  const handleEnroll = async (courseId) => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (!stored) return router.push('/login');
      const user = JSON.parse(stored);
      const res = await fetch('/api/trainee/enrollments', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-email': user.email }, body: JSON.stringify({ courseId }) });
      const j = await res.json();
      if (res.ok) {
        const batchId = j.enrollment?.batchId || j.enrollment?.batch?.id || j.batchId;
        if (batchId) {
          router.push(`/trainee/course/${batchId}`);
          return;
        }
        // refresh enrollments map
        const enr = await fetch('/api/trainee/enrollments', { headers: { 'x-user-email': user.email } });
        if (enr.ok) {
          const ed = await enr.json();
          const map = {};
          (Array.isArray(ed) ? ed : []).forEach((e) => {
            const batch = e.batch || {};
            const courseId = batch.courseId || e.courseId || (batch.course && batch.course.id);
            if (courseId) map[Number(courseId)] = batch.id || e.batchId || e.batch?.id;
          });
          setEnrolledMap(map);
        }
        alert('Enrolled successfully');
      } else {
        alert(j.error || 'Failed to enroll');
      }
    } catch (err) {
      console.error(err);
      alert('Enrollment failed');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="backdrop-blur-xl border-b border-white border-opacity-5 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Training Courses</h2>
            <p className="text-white text-opacity-80">Browse available courses</p>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="text-white/80">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-white/80">No courses found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => {
                const enrolledBatchId = enrolledMap[Number(c.id)];
                const bgStyle = c.image ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.36), rgba(0,0,0,0.18)), url(${c.image.startsWith('http') ? c.image : '/' + c.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined;
                return (
                  <div key={c.id} className="relative rounded-lg overflow-hidden shadow-lg">
                      <div className="relative h-48 w-full bg-gray-800">
                        {c.image && (
                          <img
                            src={c.image.startsWith('http') ? c.image : '/' + c.image}
                            alt={c.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                      </div>
                      <div className="p-4 bg-white/5 backdrop-blur-xl text-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{c.name}</h3>
                          <p className="text-sm text-white/80 mt-2">{c.shortDescription || c.description || ''}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {enrolledBatchId ? (
                            <button onClick={() => router.push(`/trainee/course/${enrolledBatchId}`)} className="bg-green-600 text-white px-3 py-2 rounded">Continue</button>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); handleEnroll(c.id); }} className="bg-green-600 text-white px-3 py-2 rounded">Enroll</button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); setSelectedCourse(c); }} className="bg-white/10 text-white px-3 py-2 rounded">View Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCourse(null)}>
            <div className="w-full max-w-3xl rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 bg-gradient-to-r from-green-600 to-green-500 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
                    <div className="text-sm mt-1">{selectedCourse.beneficiaries && selectedCourse.beneficiaries.join(', ')}</div>
                  </div>
                  <button onClick={() => setSelectedCourse(null)} className="text-white text-xl">✕</button>
                </div>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-xl text-white rounded">
                <p className="mb-4">{selectedCourse.description || selectedCourse.shortDescription}</p>
                {Array.isArray(selectedCourse.modules) && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Modules</h3>
                    <ul className="space-y-2">
                      {selectedCourse.modules.map((m, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-sm font-semibold">{i + 1}</span>
                          <div>{m.title}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button onClick={() => { const bid = enrolledMap[Number(selectedCourse.id)]; if (bid) router.push(`/trainee/course/${bid}`); else handleEnroll(selectedCourse.id); }} className="flex-1 bg-green-600 text-white py-3 rounded-lg">{enrolledMap[Number(selectedCourse.id)] ? 'Continue' : 'Enroll Now'}</button>
                  <button onClick={() => setSelectedCourse(null)} className="flex-1 bg-white/10 text-white py-3 rounded-lg">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
