"use client";
import React, { useState, useEffect } from "react";

export default function CoordinatorPage() {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    status: "Pending"
  });

  // Load coordinators from API
  useEffect(function() {
    async function loadCoordinators() {
      try {
        const res = await fetch('/api/coordinator/list');
        if (res.ok) {
          const data = await res.json();
          setCoordinators(data);
        }
      } catch (error) {
        console.error('Error loading coordinators:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCoordinators();
  }, []);

  const handleOpenModal = function() {
    setForm({ name: "", email: "", password: "", status: "Pending" });
    setShowModal(true);
  };
  
  const handleCloseModal = function() {
    setShowModal(false);
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;

    try {
      const res = await fetch('/api/coordinator/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        const createdCoordinator = await res.json();
        setCoordinators([createdCoordinator, ...coordinators]);
        handleCloseModal();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create coordinator');
      }
    } catch (error) {
      console.error('Error creating coordinator:', error);
      alert('Failed to create coordinator. Please try again.');
    }
  }

  async function handleDelete(email) {
    if (!confirm('Are you sure you want to delete this coordinator?')) return;

    try {
      const res = await fetch('/api/coordinator/list', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });

      if (res.ok) {
        setCoordinators(coordinators.filter(function(c) {
          return c.email !== email;
        }));
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete coordinator');
      }
    } catch (error) {
      console.error('Error deleting coordinator:', error);
      alert('Failed to delete coordinator. Please try again.');
    }
  }

  async function handleApprove(email) {
    try {
      const res = await fetch('/api/coordinator/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, status: 'Approved' })
      });

      if (res.ok) {
        setCoordinators(coordinators.map(function(c) {
          return c.email === email ? { ...c, status: "Approved" } : c;
        }));
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to approve coordinator');
      }
    } catch (error) {
      console.error('Error approving coordinator:', error);
      alert('Failed to approve coordinator. Please try again.');
    }
  }

  async function handleReject(email) {
    try {
      const res = await fetch('/api/coordinator/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, status: 'Rejected' })
      });

      if (res.ok) {
        setCoordinators(coordinators.map(function(c) {
          return c.email === email ? { ...c, status: "Rejected" } : c;
        }));
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to reject coordinator');
      }
    } catch (error) {
      console.error('Error rejecting coordinator:', error);
      alert('Failed to reject coordinator. Please try again.');
    }
  }

  // Stats
  const totalApproved = coordinators.filter(function(x) {
    return x.status === "Approved";
  }).length;
  
  const totalPending = coordinators.filter(function(x) {
    return x.status === "Pending";
  }).length;

  const approvalList = coordinators.filter(function(c) {
    return c.status === "Pending";
  });

  const mainList = coordinators.filter(function(c) {
    return c.status !== "Pending";
  });

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen w-full h-screen flex items-center justify-center overflow-x-hidden">
        <div className="text-green-700 text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full h-screen overflow-y-auto overflow-x-hidden flex flex-col">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={function() {
            window.location.href = '/admin/dashboard';
          }}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Heading */}
      <h1 className="text-center text-green-700 text-3xl font-extrabold mb-8 tracking-wide">
        TOTAL <span className="text-green-700">CO-ORDINATORS</span>
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 px-4 py-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-center p-4 max-w-none shadow-sm">
          <div className="text-2xl font-bold text-green-700 mb-1">{coordinators.length}</div>
          <div className="text-black text-sm">Total</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-center p-4 max-w-none shadow-sm">
          <div className="text-2xl font-bold text-yellow-500 mb-1">{totalPending}</div>
          <div className="text-black text-sm">Pending</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-center p-4 max-w-none shadow-sm">
          <div className="text-2xl font-bold text-green-700 mb-1">{totalApproved}</div>
          <div className="text-black text-sm">Approved</div>
        </div>
      </div>

      {/* Create Button */}
      <div className="mb-6 flex justify-end px-4">
        <button
          onClick={handleOpenModal}
          className="bg-green-700 text-white px-5 py-2 rounded shadow hover:bg-green-800 font-bold"
        >
          + Create Coordinator
        </button>
      </div>

      {/* Approval List */}
      {approvalList.length > 0 && (
        <div className="mb-8 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-500 mb-4">Approval List</h2>
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-green-100">
                <th className="text-green-700 py-3 px-3 text-left font-semibold rounded-tl">Name</th>
                <th className="text-green-700 py-3 px-3 text-left font-semibold">Email</th>
                <th className="text-green-700 py-3 px-3 text-left font-semibold">Status</th>
                <th className="text-green-700 py-3 px-3 text-center font-semibold rounded-tr w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvalList.map(function(c) {
                return (
                  <tr key={c.email} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3 text-black">{c.name}</td>
                    <td className="py-3 px-3 text-black">{c.email}</td>
                    <td className="py-3 px-3 font-bold text-yellow-500">{c.status}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={function() {
                          handleApprove(c.email);
                        }}
                        className="bg-green-600 text-white px-4 py-1 rounded font-bold mr-2 hover:bg-green-700"
                      >Approve</button>
                      <button
                        onClick={function() {
                          handleReject(c.email);
                        }}
                        className="bg-red-600 text-white px-4 py-1 rounded font-bold mr-2 hover:bg-red-700"
                      >Reject</button>
                      <button
                        onClick={function() {
                          handleDelete(c.email);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded font-bold hover:bg-red-600"
                        title="Delete"
                      >🗑</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Main Coordinators Table */}
      <div className="px-4 flex-1 min-h-[60vh] bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
        <h3 className="text-green-700 font-bold text-lg mb-4">Current Coordinators</h3>
        <div className="w-full max-w-full">
          <table className="w-full table-fixed whitespace-normal break-words">
          <thead>
            <tr className="bg-green-100">
              <th className="text-green-700 py-3 px-3 text-left font-semibold rounded-tl">Name</th>
              <th className="text-green-700 py-3 px-3 text-left font-semibold">Email</th>
              <th className="text-green-700 py-3 px-3 text-left font-semibold">Status</th>
              <th className="text-green-700 py-3 px-3 text-center font-semibold rounded-tr w-36">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mainList.map(function(c) {
              return (
                <tr key={c.email} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 text-black">{c.name}</td>
                  <td className="py-3 px-3 text-black">{c.email}</td>
                  <td className={"py-3 px-3 font-bold " + (
                    c.status === "Approved"
                      ? "text-green-700"
                      : c.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-500"
                  )}>{c.status}</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={function() {
                        handleDelete(c.email);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded font-bold hover:bg-red-600"
                      title="Delete"
                    >🗑</button>
                  </td>
                </tr>
              );
            })}
            {mainList.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-slate-500">
                  No coordinators available.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-30">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col gap-5"
          >
            <h2 className="text-green-700 font-extrabold text-2xl text-center mb-2">
              Create New Coordinator
            </h2>
            <label className="font-semibold text-black">
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="block w-full mt-2 px-4 py-2 rounded border border-green-500 bg-green-50 text-black"
              />
            </label>
            <label className="font-semibold text-black">
              Email
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                className="block w-full mt-2 px-4 py-2 rounded border border-green-500 bg-green-50 text-black"
              />
            </label>
            <label className="font-semibold text-black">
              Password
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                required
                className="block w-full mt-2 px-4 py-2 rounded border border-green-500 bg-green-50 text-black"
              />
            </label>
            <label className="font-semibold text-black">
              Status
              <div className="flex gap-7 mt-2">
                {["Pending", "Approved", "Rejected"].map(function(st) {
                  return (
                    <label
                      key={st}
                      className={"capitalize font-bold " + (
                        form.status === st ? "text-green-700" : "text-black"
                      )}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={st}
                        checked={form.status === st}
                        onChange={handleChange}
                        className="accent-green-600 mr-2"
                      />
                      {st}
                    </label>
                  );
                })}
              </div>
            </label>
            <div className="flex justify-end gap-4 mt-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="border border-green-700 text-green-700 px-4 py-1 rounded font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-700 text-white font-bold px-6 py-1 rounded"
              >
                Create Coordinator
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}