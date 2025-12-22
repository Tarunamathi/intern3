'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import ProfileHeader from '../components/ProfileHeader';
import StatsCards from '../components/StatsCards';
import TraineeDetails from '../components/TraineeDetails';

export default function TraineeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [certCount, setCertCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [examScores, setExamScores] = useState([]);
  const [selectedBatchForScores, setSelectedBatchForScores] = useState('');
  const [loadingScores, setLoadingScores] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [showCertificatesModal, setShowCertificatesModal] = useState(false);
  const [loadingCerts, setLoadingCerts] = useState(false);

  // Fetch user from API
  useEffect(() => {
    async function fetchUser() {
      try {
        // include x-user-email header when available (dev auth stored in localStorage)
        const headers = {};
        try {
          const stored = localStorage.getItem('user');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.email) headers['x-user-email'] = parsed.email;
          }
        } catch (e) {
          // ignore
        }

        const res = await fetch('/api/user/me', { cache: 'no-store', headers });
        let data = null;
        try {
          data = await res.json();
        } catch (e) {
          console.warn('Could not parse /api/user/me response as JSON', e);
        }
        // support response shapes: { user } or user
        const userData = data?.user || data;

        if (res.ok && userData) {
          setUser(userData);

          try {
            const email = userData.email;

            // fetch cert count
            const certRes = await fetch(`/api/trainee/certificates?traineeEmail=${encodeURIComponent(email)}`);
            if (certRes.ok) {
              const certs = await certRes.json();
              setCertCount(Array.isArray(certs) ? certs.length : 0);
            }

            // fetch enrollments
            const enrRes = await fetch(`/api/trainee/enrollments?traineeEmail=${encodeURIComponent(email)}`);
            if (enrRes.ok) {
              const enrollments = await enrRes.json();
              setCourseCount(Array.isArray(enrollments) ? enrollments.length : 0);
            }
          } catch (e) {
            console.error('Error fetching trainee stats', e);
          }
        } else {
          // fallback: attempt to read user from localStorage (developer convenience)
          try {
            const stored = localStorage.getItem('user');
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.email) {
                  setUser(parsed);
                  // attempt to fetch stats with local email
                  try {
                    const email = parsed.email;
                    const certRes = await fetch(`/api/trainee/certificates?traineeEmail=${encodeURIComponent(email)}`, { headers: { 'x-user-email': email } });
                    if (certRes.ok) setCertCount((await certRes.json()).length || 0);
                    const enrRes = await fetch(`/api/trainee/enrollments?traineeEmail=${encodeURIComponent(email)}`, { headers: { 'x-user-email': email } });
                    if (enrRes.ok) setCourseCount((await enrRes.json()).length || 0);
                  } catch (e) {
                    console.error('Error fetching trainee stats with fallback user', e);
                  }
                return;
              }
            }
          } catch (e) {
            console.error('Error reading fallback user from localStorage', e);
          }

          // nothing useful — redirect to login
          console.error('/api/user/me failed', res.status, data);
          router.push('/login');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  // Fetch and display certificates when user clicks
  const handleShowCertificates = async () => {
    if (!user || !user.email) return;
    try {
      setLoadingCerts(true);
      const res = await fetch(`/api/trainee/certificates?traineeEmail=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const certs = await res.json();
        setCertificates(Array.isArray(certs) ? certs : []);
      } else {
        console.error('Failed to fetch certificates', res.statusText);
        setCertificates([]);
      }
    } catch (err) {
      console.error('Error fetching certificates', err);
      setCertificates([]);
    } finally {
      setLoadingCerts(false);
    }
    setShowCertificatesModal(true);
  };

  // Certificate helpers for trainee view/download
  const certificateHelpers = {
    formatDate: (dateString) => {
      if (!dateString) return '';
      try {
        return new Date(dateString).toISOString().split('T')[0];
      } catch (e) {
        return dateString;
      }
    },
    openPrintable: (cert) => {
      const certWindow = window.open('', '_blank');
      certWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificate - ${cert.id}</title>
          <style>
            body { font-family: 'Georgia', serif; margin:0; padding:40px; background:#f5f5f5; }
            .certificate { max-width:800px; margin:0 auto; background:white; padding:60px; border:8px solid #d97706; box-shadow:0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align:center; margin-bottom:40px }
            .title { font-size:36px; font-weight:bold; color:#333; margin:20px 0 }
            .name { font-size:32px; font-weight:bold; color:#1a1a1a; margin:30px 0 }
            .course { font-size:24px; color:#444; margin:20px 0 }
            .footer { display:flex; justify-content:space-around; margin-top:60px; padding-top:20px; border-top:2px solid #ddd }
            .footer-label { font-weight:bold; color:#666; font-size:14px }
            .footer-value { color:#333; font-size:16px; margin-top:5px }
            @media print { body { background:white; padding:0 } .certificate { box-shadow:none } }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div style="font-size:48px;color:#d97706">🏆</div>
              <div class="title">Certificate of Completion</div>
            </div>
            <div style="text-align:center;">
              <p>This is to certify that</p>
              <h2 class="name">${cert.traineeName || ''}</h2>
              <p>has successfully completed the course</p>
              <h3 class="course">${cert.course || ''}</h3>
              <div class="footer">
                <div>
                  <div class="footer-label">Date</div>
                  <div class="footer-value">${cert.issuedDate || ''}</div>
                </div>
                <div>
                  <div class="footer-label">Grade</div>
                  <div class="footer-value">${cert.grade || ''}</div>
                </div>
                <div>
                  <div class="footer-label">Certificate ID</div>
                  <div class="footer-value">${cert.id || cert.certificateId || ''}</div>
                </div>
              </div>
            </div>
          </div>
          <script>window.onload = () => { /* don't auto-print for trainee; user can print manually */ };</script>
        </body>
        </html>
      `);
      certWindow.document.close();
    },
    download: (cert) => {
      // reuse printable window as a simple download approach (user can Save as PDF)
      certificateHelpers.openPrintable(cert);
    }
  };

  // Fetch trainee's exam scores
  useEffect(() => {
    const fetchMyScores = async () => {
      if (!user || !user.email) {
        setExamScores([]);
        return;
      }

      try {
        setLoadingScores(true);
        const res = await fetch(`/api/exam-scores/list?traineeEmail=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setExamScores(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch exam scores', res.statusText);
          setExamScores([]);
        }
      } catch (err) {
        console.error('Error fetching my exam scores', err);
        setExamScores([]);
      } finally {
        setLoadingScores(false);
      }
    };

    fetchMyScores();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex w-full min-h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content: topbar (fixed height) + scrollable content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar - matches trainer layout (no side/top gaps) */}
        <div className="backdrop-blur-xl border-b border-white border-opacity-5 px-0 py-0 flex items-center justify-between relative z-30">
          <div>
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <p className="text-white text-opacity-80">Welcome back, {user.firstName} {user.lastName}</p>
          </div>
          <div />
        </div>

        {/* Scrollable area (no outer padding) */}
        <main className="flex-1 overflow-y-auto relative z-20">
          <div className="p-0">
            {/* Profile Header */}
            <ProfileHeader user={user} />

            {/* Stats Cards */}
            <StatsCards certCount={certCount} courseCount={courseCount} onCertificatesClick={handleShowCertificates} />

            {/* Trainee Details */}
            <div className="mt-6">
              <TraineeDetails user={user} />
            </div>

            {/* Certificates Modal */}
            {showCertificatesModal && (
              <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
                <div className="absolute inset-0 bg-black/40" onClick={() => setShowCertificatesModal(false)} />
                <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium">My Certificates</h3>
                    <button onClick={() => setShowCertificatesModal(false)} className="text-gray-600 hover:text-gray-900">Close</button>
                  </div>
                  <div className="p-4 max-h-96 overflow-y-auto">
                    {loadingCerts ? (
                      <div className="text-center py-6 text-gray-500">Loading certificates...</div>
                    ) : certificates && certificates.length > 0 ? (
                      <div className="space-y-3">
                        {certificates.map((cert) => (
                          <div key={cert.id} className="flex items-center justify-between p-3 rounded border">
                            <div>
                              <div className="font-semibold">{cert.course}</div>
                              <div className="text-sm text-gray-500">{cert.traineeName} • {cert.issuedDate}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button onClick={() => certificateHelpers.openPrintable(cert)} className="text-amber-600 hover:text-amber-800 text-sm flex items-center gap-1">
                                View
                              </button>
                              <button onClick={() => certificateHelpers.download(cert)} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">No certificates found.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* My Exam Scores */}
            <div className="mt-6 backdrop-blur-xl border border-white border-opacity-5 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">My Exam Scores</h3>
              {loadingScores ? (
                <div className="text-center py-6 text-gray-500">Loading exam scores...</div>
              ) : examScores && examScores.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 text-left text-white text-opacity-80">
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Trainee</th>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2">Total</th>
                        <th className="px-4 py-2">Obtained</th>
                        <th className="px-4 py-2">Document</th>
                        <th className="px-4 py-2">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examScores.map((s) => (
                        <tr key={s.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{s.examDate ? String(s.examDate).split('T')[0] : ''}</td>
                          <td className="px-4 py-3">{s.traineeName} <div className="text-xs text-gray-400">{s.traineeEmail}</div></td>
                          <td className="px-4 py-3">{s.examTitle}</td>
                          <td className="px-4 py-3">{s.examType}</td>
                          <td className="px-4 py-3">{s.totalMarks}</td>
                          <td className="px-4 py-3">{s.obtainedMarks}</td>
                          <td className="px-4 py-3">
                            {s.document ? (
                              <div className="flex gap-2">
                                <a href={s.document} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">View</a>
                                <a href={s.document} download className="text-green-600 hover:underline text-xs">Download</a>
                              </div>
                            ) : <span className="text-xs text-gray-400">—</span>}
                          </td>
                          <td className="px-4 py-3">{s.remarks || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-6 text-sm text-gray-500">No exam scores found.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
