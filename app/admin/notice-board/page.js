"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Calendar, AlertCircle, FileText, Users } from "lucide-react";

export default function AdminNoticeboardPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    timeLimit: "",
    selectedBatches: [],
    userTypes: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [notices, setNotices] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return router.push("/login");
        const user = JSON.parse(storedUser);
        const headers = { "x-user-email": user.email };

        const batchRes = await fetch("/api/batches/list", { headers });
        if (batchRes.ok) {
          const batchData = await batchRes.json();
          setBatches(batchData.batches || batchData || []);
        }

        const noticeRes = await fetch("/api/admin/noticeboard?role=admin", { headers });
        if (noticeRes.ok) {
          const noticeData = await noticeRes.json();
          setNotices(noticeData.notices || []);
        }
      } catch (err) {
        console.error(err);
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleBatchToggle = (id) =>
    setFormData((p) => ({
      ...p,
      selectedBatches: p.selectedBatches.includes(id) ? p.selectedBatches.filter((b) => b !== id) : [...p.selectedBatches, id],
    }));

  const handleUserTypeToggle = (type) =>
    setFormData((p) => ({
      ...p,
      userTypes: p.userTypes.includes(type) ? p.userTypes.filter((t) => t !== type) : [...p.userTypes, type],
    }));

  const handleCancel = () => router.push("/admin/dashboard");

  const handleCreateNotice = async () => {
    try {
      if (!formData.title.trim() || !formData.description.trim()) return alert("Please fill required fields");
      if (!formData.userTypes.length) return alert("Select at least one recipient type");
      if (formData.userTypes.includes("trainee") && !formData.selectedBatches.length) return alert("Select at least one batch");

      const storedUser = localStorage.getItem("user");
      if (!storedUser) return router.push("/login");
      const user = JSON.parse(storedUser);

      const noticeData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        timeLimit: formData.timeLimit || null,
        createdBy: user.email,
        targetAudience: formData.userTypes,
        batches: formData.userTypes.includes("trainee") ? formData.selectedBatches : [],
      };

      const res = await fetch("/api/admin/noticeboard", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-email": user.email },
        body: JSON.stringify(noticeData),
      });

      const text = await res.text();
      let json = null;
      try { json = JSON.parse(text); } catch (_) { json = null; }

      if (!res.ok) throw new Error(json?.error || json?.message || text || `Status ${res.status}`);
      if (!json) throw new Error("Invalid server response (expected JSON)");

      if (json.success && json.notice) {
        setNotices((p) => [json.notice, ...p]);
        setFormData({ title: "", description: "", priority: "medium", timeLimit: "", selectedBatches: [], userTypes: [] });
        alert("Notice created successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create notice. Check console for details.");
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "high": return "bg-red-100 text-red-800 border-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (showPreview) {
    return (
      <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">Noticeboard - Preview</h1>
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Back to Creation Form</button>
            </div>

            {notices.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow p-12 text-center mt-6">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notices available yet</p>
              </div>
            ) : (
              <div className="space-y-4 mt-6">
                {notices.map((notice) => (
                  <div key={notice.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-md overflow-hidden">
                    <div className={`p-4 border-l-4 ${notice.priority === 'high' ? 'border-red-500' : notice.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-1">{notice.title}</h3>
                          <p className="text-sm text-gray-500">Posted by {notice.createdBy} on {notice.createdAt}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{notice.description}</p>

                      {notice.timeLimit && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Valid until: {new Date(notice.timeLimit).toLocaleDateString()}</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Users className="w-4 h-4 mr-2" />
                        <span>Target: {notice.batches?.length || 0} batch(es)</span>
                        {notice.batches?.length > 0 && (
                          <span className="ml-2 text-gray-500">({notice.batches.map(b => b.batch?.batchName || b.batch?.batchCode).join(', ')})</span>
                        )}
                      </div>

                      {notice.attachments?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Attachments:</p>
                          <div className="space-y-2">
                            {notice.attachments.map((file, idx) => (
                              <div key={idx} className="flex items-center text-sm text-gray-700 bg-white/5 p-2 rounded">
                                <FileText className="w-4 h-4 mr-2" />
                                <span>{file.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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

  return (
    <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Bell className="w-7 h-7 mr-2 text-blue-600" />
                  Create Notice
                </h2>
                <p className="text-gray-600 mt-1">Share important announcements with trainees and trainers</p>
              </div>
              {notices.length > 0 && (
                <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  Preview Notices
                </button>
              )}
            </div>

            <div className="space-y-6 bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter notice title" className="w-full px-4 py-2 border border-white/20 rounded-lg bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} placeholder="Enter detailed description" className="w-full px-4 py-2 border border-white/20 rounded-lg bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority <span className="text-red-500">*</span></label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full px-4 py-2 border border-white/20 rounded-lg bg-transparent text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Valid Until</label>
                  <input type="date" name="timeLimit" value={formData.timeLimit} onChange={handleInputChange} min={new Date().toISOString().split("T")[0]} className="w-full px-4 py-2 border border-white/20 rounded-lg bg-transparent text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Recipients <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[["admin","Admins"],["trainer","Trainers"],["trainee","Trainees"]].map(([type,label]) => (
                    <label key={type} className="flex items-center p-3 border border-white/20 rounded-lg hover:bg-white/5 cursor-pointer">
                      <input type="checkbox" checked={formData.userTypes.includes(type)} onChange={() => handleUserTypeToggle(type)} className="w-4 h-4 text-blue-600 border-white/20 rounded focus:ring-blue-500" />
                      <span className="ml-3 text-gray-800">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.userTypes.includes("trainee") && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select Batches <span className="text-red-500">*</span></label>
                  <div className="border border-white/10 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto bg-transparent">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Loading batches...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-4 text-red-500"><AlertCircle className="w-8 h-8 mx-auto mb-2" /><p>{error}</p></div>
                    ) : batches.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">No batches available</div>
                    ) : (
                      batches.map((batch) => (
                        <label key={batch.id} className="flex items-center p-2 hover:bg-white/5 rounded cursor-pointer">
                          <input type="checkbox" checked={formData.selectedBatches.includes(batch.id)} onChange={() => handleBatchToggle(batch.id)} className="w-4 h-4 text-blue-600 border-white/20 rounded focus:ring-blue-500" />
                          <span className="ml-3 text-gray-800">{batch.batchName} - {batch.courseName}</span>
                        </label>
                      ))
                    )}
                  </div>
                  {formData.selectedBatches.length > 0 && (
                    <p className="text-sm text-blue-600 mt-2"><Users className="w-4 h-4 inline mr-1" />{formData.selectedBatches.length} batch(es) selected</p>
                  )}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button onClick={handleCancel} className="flex-1 px-6 py-3 border-2 border-white/20 text-gray-800 rounded-lg hover:bg-white/5 font-semibold transition-colors">Cancel</button>
                <button onClick={handleCreateNotice} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-md">Create Notice</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}