"use client";
import { useState, useEffect } from "react";

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    async function loadAdmins() {
      try {
        const res = await fetch('/api/admin/list');
        if (res.ok) {
          const data = await res.json();
          setAdmins(data);
        }
      } catch (error) {
        console.error('Error loading admins:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAdmins();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    access: "Admin",
  });

  const filteredAdmins = admins.filter(function(a) {
    return a.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreate = async function(e) {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email || (!editingAdmin && !newAdmin.password)) return;

    try {
      if (editingAdmin) {
        // Editing existing admin (not implemented in API yet)
        setAdmins(
          admins.map(function(admin) {
            return admin.email === editingAdmin.email ? newAdmin : admin;
          })
        );
        setEditingAdmin(null);
      } else {
        // Creating new admin
        const res = await fetch('/api/admin/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newAdmin)
        });

        if (res.ok) {
          const createdAdmin = await res.json();
          setAdmins(function(prev) {
            return [createdAdmin, ...prev];
          });
        } else {
          const error = await res.json();
          alert(error.error || 'Failed to create admin');
          return;
        }
      }
      setNewAdmin({ name: "", email: "", password: "", access: "Admin" });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Failed to create admin. Please try again.');
    }
  };

  const handleDelete = function(email) {
    setAdmins(admins.filter(function(a) {
      return a.email !== email;
    }));
  };

  const handleEdit = function(admin) {
    setNewAdmin(admin);
    setEditingAdmin(admin);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen w-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-start p-0 text-black">
      {/* Header in green, full fill with no border & no rounded edges */}
      <div className="w-full bg-green-700 shadow">
        <div className="flex flex-col items-center justify-center w-full py-8">
          <h1 className="text-4xl font-bold text-white tracking-wide">Admin Management</h1>
        </div>
      </div>

      {/* Table and Actions */}
      <div className="flex flex-col items-center w-full flex-1 px-0 py-8">
        {/* Search + Button */}
        <div className="flex w-full max-w-7xl items-center justify-between px-5 mb-6">
          <input
            type="text"
            placeholder="Search Admins..."
            value={searchTerm}
            onChange={function(e) {
              setSearchTerm(e.target.value);
            }}
            className="w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
          />
          <button
            onClick={function() {
              setShowForm(true);
              setEditingAdmin(null);
              setNewAdmin({ name: "", email: "", password: "", access: "Admin" });
            }}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium shadow transition"
          >
            + Create Admin
          </button>
        </div>

        {/* Admin Table */}
        <div className="w-full flex-1 max-w-7xl mx-auto overflow-x-auto rounded-2xl border border-gray-200 shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-green-600 text-white font-semibold">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">E-mail</th>
                <th className="px-5 py-4">Access Type</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map(function(admin, idx) {
                  return (
                            <tr
                              key={idx}
                              className="even:bg-green-50 odd:bg-white/5 border-t border-gray-200"
                            >
                      <td className="px-5 py-4">{admin.name}</td>
                      <td className="px-5 py-4">{admin.email}</td>
                      <td className="px-5 py-4">{admin.access}</td>
                      <td className="px-5 py-4 text-right space-x-3">
                        <button
                          onClick={function() {
                            handleEdit(admin);
                          }}
                          className="text-green-700 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={function() {
                            handleDelete(admin.email);
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500 italic">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Admin Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg w-full max-w-md p-7">
            <h2 className="text-2xl font-bold mb-5 text-green-700">
              {editingAdmin ? "Edit Admin" : "Create New Admin"}
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={function(e) {
                    setNewAdmin({ ...newAdmin, name: e.target.value });
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={function(e) {
                    setNewAdmin({ ...newAdmin, email: e.target.value });
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                  required
                  disabled={editingAdmin !== null}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={function(e) {
                    setNewAdmin({ ...newAdmin, password: e.target.value });
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                  required={!editingAdmin}
                />
              </div>

              {/* Access Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Access Type</label>
                <div className="flex space-x-4">
                  {["View Only", "Edit Access", "Admin"].map(function(type) {
                    return (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="access"
                          value={type}
                          checked={newAdmin.access === type}
                          onChange={function(e) {
                            setNewAdmin({ ...newAdmin, access: e.target.value });
                          }}
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={function() {
                    setShowForm(false);
                    setEditingAdmin(null);
                  }}
                  className="bg-gray-200 text-black px-5 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-md transition"
                >
                  {editingAdmin ? "Update Admin" : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}