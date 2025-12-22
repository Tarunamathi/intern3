"use client";
import React, { useState, useEffect } from "react";

export default function InstitutionPage() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    contactNumber: "",
    status: "Active",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch institutions on mount
  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/institution');
      
      if (!res.ok) {
        throw new Error('Failed to fetch institutions');
      }
      
      const data = await res.json();
      setInstitutions(data);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      setError('Failed to load institutions. Please try again.');
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!form.name.trim()) {
      alert('Institution name is required');
      return;
    }

    setSubmitting(true);
    
    try {
      if (editingId !== null) {
        // Update existing institution
        const res = await fetch(`/api/institution/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to update institution');
        }

        const updated = await res.json();
        setInstitutions(institutions.map(i => i.id === editingId ? updated : i));
        alert('Institution updated successfully!');
      } else {
        // Create new institution
        const res = await fetch('/api/institution', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to create institution');
        }

        const newInst = await res.json();
        setInstitutions([newInst, ...institutions]);
        alert('Institution created successfully!');
      }

      // Reset form
      setForm({ name: "", address: "", email: "", contactNumber: "", status: "Active" });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving institution:', error);
      alert(error.message || 'An error occurred while saving the institution');
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(inst) {
    setForm({
      name: inst.name,
      address: inst.address || "",
      email: inst.email || "",
      contactNumber: inst.contactNumber || "",
      status: inst.status
    });
    setEditingId(inst.id);
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this institution? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/institution/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete institution');
      }

      setInstitutions(institutions.filter(i => i.id !== id));
      alert('Institution deleted successfully!');
    } catch (error) {
      console.error('Error deleting institution:', error);
      alert(error.message || 'An error occurred while deleting the institution');
    }
  }

  function handleCreateInstitution() {
    setForm({ name: "", address: "", email: "", contactNumber: "", status: "Active" });
    setEditingId(null);
    setShowForm(true);
  }

  function handleCancel() {
    setForm({ name: "", address: "", email: "", contactNumber: "", status: "Active" });
    setEditingId(null);
    setShowForm(false);
  }

  function handleBackToDashboard() {
    window.location.href = "/admin/dashboard";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-green-700/5 to-transparent">
        <div className="text-center">
          <div className="text-2xl text-green-600">Loading institutions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-green-700/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <button onClick={handleBackToDashboard} className="mb-5 px-4 py-2 bg-gray-600 text-white rounded-md font-medium flex items-center gap-2">
          <span>←</span> Back to Dashboard
        </button>

        <h1 className="text-center text-2xl font-bold text-green-600 mb-5">Institution Management</h1>

        {error && (
          <div style={{
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            padding: "12px 16px",
            borderRadius: 6,
            marginBottom: 16,
            border: "1px solid #fecaca"
          }}>
            {error}
            <button
              onClick={fetchInstitutions}
              style={{
                marginLeft: 16,
                padding: "4px 12px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: "0.875rem"
              }}
            >
              Retry
            </button>
          </div>
        )}
        
        <button
          onClick={handleCreateInstitution}
          style={{
            float: "right",
            marginBottom: 16,
            backgroundColor: "#059669",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Create Institution
        </button>
        
        <div className="w-full mb-8 bg-white/5 backdrop-blur-xl shadow rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
          <thead className="bg-green-600 text-white text-left">
            <tr>
              <th style={{ padding: "10px 12px" }}>Code</th>
              <th style={{ padding: "10px 12px" }}>Name</th>
              <th style={{ padding: "10px 12px" }}>Address</th>
              <th style={{ padding: "10px 12px" }}>Email</th>
              <th style={{ padding: "10px 12px" }}>Contact Number</th>
              <th style={{ padding: "10px 12px" }}>Batches</th>
              <th style={{ padding: "10px 12px" }}>Status</th>
              <th style={{ padding: "10px 12px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {institutions.length > 0 ? (
              institutions.map((inst) => (
                <tr key={inst.id} className="border-b border-white/10">
                  <td style={{ padding: "10px 12px" }} className="text-gray-200 font-medium text-sm">
                    {inst.code}
                  </td>
                  <td style={{ padding: "10px 12px" }} className="text-gray-100 font-semibold">
                    {inst.name}
                  </td>
                  <td style={{ padding: "10px 12px" }} className="text-gray-300">
                    {inst.address || '-'}
                  </td>
                  <td style={{ padding: "10px 12px" }} className="text-gray-300">
                    {inst.email || '-'}
                  </td>
                  <td style={{ padding: "10px 12px" }} className="text-gray-300">
                    {inst.contactNumber || '-'}
                  </td>
                  <td style={{ padding: "10px 12px" }} className="text-gray-300">
                    {inst.batches && inst.batches.length > 0 ? (
                      <span>
                        {inst.batches.slice(0, 2).map(b => b.batchName).join(", ")}
                        {inst.batches.length > 2 && ` +${inst.batches.length - 2} more`}
                      </span>
                    ) : (
                      <span className="text-gray-400">No batches</span>
                    )}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${inst.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {inst.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <button onClick={() => handleEdit(inst)} className="bg-green-500 text-white px-3 py-1 mr-2 rounded text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(inst.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                  <div style={{ fontSize: "1.125rem", marginBottom: 8 }}>No institutions found</div>
                  <div style={{ fontSize: "0.875rem" }}>Click "Create Institution" to add your first institution</div>
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCancel}>
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-xl shadow-lg max-w-2xl w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-gray-100 mb-6 text-xl font-bold">{editingId !== null ? "Edit Institution" : "Create New Institution"}</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", marginBottom: 8, color: "#374151", fontWeight: "600" }}>
                    Institution Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter institution name"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      color: "#111827",
                      fontSize: "1rem"
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", marginBottom: 8, color: "#374151", fontWeight: "600" }}>
                    Address
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter address (optional)"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      color: "#111827",
                      fontSize: "1rem"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, color: "#374151", fontWeight: "600" }}>
                      Email <span style={{ color: "#9ca3af", fontWeight: "400" }}>(Optional)</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 6,
                        border: "1px solid #d1d5db",
                        color: "#111827",
                        fontSize: "1rem"
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: "block", marginBottom: 8, color: "#374151", fontWeight: "600" }}>
                      Contact Number <span style={{ color: "#9ca3af", fontWeight: "400" }}>(Optional)</span>
                    </label>
                    <input
                      name="contactNumber"
                      value={form.contactNumber}
                      onChange={handleChange}
                      placeholder="Phone number"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 6,
                        border: "1px solid #d1d5db",
                        color: "#111827",
                        fontSize: "1rem"
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", marginBottom: 8, color: "#374151", fontWeight: "600" }}>
                    Status
                  </label>
                  <div style={{ display: "flex", gap: 20 }}>
                    <label style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#374151" }}>
                      <input
                        type="radio"
                        name="status"
                        value="Active"
                        checked={form.status === "Active"}
                        onChange={handleChange}
                        style={{ marginRight: 8, cursor: "pointer" }}
                      />
                      Active
                    </label>
                    <label style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#374151" }}>
                      <input
                        type="radio"
                        name="status"
                        value="Inactive"
                        checked={form.status === "Inactive"}
                        onChange={handleChange}
                        style={{ marginRight: 8, cursor: "pointer" }}
                      />
                      Inactive
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <button type="button" onClick={handleCancel} disabled={submitting} className="px-4 py-2 rounded bg-white/5 text-gray-200 border border-white/10 font-semibold">Cancel</button>
                  <button type="submit" disabled={submitting} className={`px-4 py-2 rounded font-semibold text-white ${submitting ? 'bg-gray-400' : 'bg-green-600'}`}>
                    {submitting ? "Saving..." : (editingId !== null ? "Update Institution" : "Create Institution")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}