"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, X, Upload, FileText, Users } from "lucide-react";

export default function NoticeboardPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    timeLimit: "",
    selectedBatches: [],
    attachments: [],
  });
  const [showTraineeView, setShowTraineeView] = useState(false);
  const [notices, setNotices] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) return router.push("/login");
        const user = JSON.parse(userData);

        const [bRes, nRes] = await Promise.all([
          fetch(`/api/batches/list?trainerEmail=${user.email}`),
          fetch(`/api/notices/list?userEmail=${encodeURIComponent(user.email)}&userRole=trainer`),
        ]);

        if (bRes.ok) setBatches(await bRes.json());
        if (nRes.ok) {
          const data = await nRes.json();
          if (data.success && Array.isArray(data.notices)) setNotices(data.notices);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleBatchToggle = (batch) =>
    setFormData((p) => ({
      ...p,
      selectedBatches: p.selectedBatches.includes(batch) ? p.selectedBatches.filter((b) => b !== batch) : [...p.selectedBatches, batch],
    }));

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((p) => ({ ...p, attachments: [...p.attachments, ...files] }));
  };

  const removeAttachment = (i) => setFormData((p) => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) }));

  const handleCancel = () => router.push("/trainer/dashboard");

  const handleCreateNotice = async () => {
    if (!formData.title || !formData.description || formData.selectedBatches.length === 0) {
      alert("Please fill required fields");
      return;
    }

    try {
      const userData = localStorage.getItem("user");
      if (!userData) return router.push("/login");
      const user = JSON.parse(userData);

      const attachmentPromises = formData.attachments.map((file) =>
        new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res({ name: file.name, data: reader.result });
          reader.onerror = rej;
          reader.readAsDataURL(file);
        })
      );

      const attachments = await Promise.all(attachmentPromises);

      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        timeLimit: formData.timeLimit || null,
        batches: formData.selectedBatches.map((s) => batches.find((b) => b.batchName === s || b.batchCode === s)?.id).filter(Boolean),
        attachments,
        createdBy: user.email,
      };

      const res = await fetch("/api/notices/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        const created = await res.json();
        setNotices((p) => [created, ...p]);
        setFormData({ title: "", description: "", priority: "medium", timeLimit: "", selectedBatches: [], attachments: [] });
        alert("Notice created");
      } else {
        alert("Failed to create notice");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating notice");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center"><Bell className="w-7 h-7 mr-2 text-green-600" />Create Notice</h2>
              <p className="text-gray-600 mt-1">Share important announcements with trainees</p>
            </div>
            {notices.length > 0 && <button onClick={() => setShowTraineeView(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Preview Trainee View</button>}
          </div>

          {/* Form */}
          <div className="space-y-6 bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
              <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter notice title" className="w-full px-4 py-2 border border-white/20 rounded-lg bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter detailed description" rows={5} className="w-full px-4 py-2 border border-white/20 rounded-lg bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority <span className="text-red-500">*</span></label>
                <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full px-4 py-2 border border-white/20 rounded-lg bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Valid Until</label>
                <input type="date" name="timeLimit" value={formData.timeLimit} onChange={handleInputChange} min={new Date().toISOString().split("T")[0]} className="w-full px-4 py-2 border border-white/20 rounded-lg bg-transparent text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Batches <span className="text-red-500">*</span></label>
              <div className="border border-white/10 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto bg-transparent">
                {batches.length > 0 ? batches.map((batch) => (
                  <label key={batch.id} className="flex items-center p-2 hover:bg-white/5 rounded cursor-pointer">
                    <input type="checkbox" checked={formData.selectedBatches.includes(batch.batchName || batch.batchCode)} onChange={() => handleBatchToggle(batch.batchName || batch.batchCode)} className="w-4 h-4 text-green-600 border-white/20 rounded" />
                    <span className="ml-3 text-gray-800">{batch.batchName || batch.batchCode} - {batch.courseName}</span>
                  </label>
                )) : (
                  <p className="text-gray-500 text-center p-4">No batches assigned to you yet</p>
                )}
              </div>
              {formData.selectedBatches.length > 0 && <p className="text-sm text-green-600 mt-2"><Users className="w-4 h-4 inline mr-1" />{formData.selectedBatches.length} batch(es) selected</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Attach Documents</label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-green-500 transition-colors bg-transparent">
                <input type="file" id="fileUpload" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="fileUpload" className="cursor-pointer"><Upload className="w-12 h-12 text-gray-300 mx-auto mb-2" /><p className="text-gray-300 mb-1">Click to upload documents</p><p className="text-sm text-gray-300">PDF, DOC, XLS, PPT, Images (Max 10MB each)</p></label>
              </div>

              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-800">{file.name}</span>
                      </div>
                      <button onClick={() => removeAttachment(index)} className="text-red-500 hover:text-red-700"><X className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleCancel} className="flex-1 px-6 py-3 border-2 border-white/20 text-gray-800 rounded-lg hover:bg-white/5 font-semibold">Cancel</button>
              <button onClick={handleCreateNotice} className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-md">Create Notice</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
