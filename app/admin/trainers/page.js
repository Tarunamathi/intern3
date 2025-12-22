"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TrainersPage() {
  const router = useRouter();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    specialization: "",
    yearsOfExperience: "",
    bio: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    checkAuth();
    fetchTrainers();
  }, []);

  const checkAuth = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login');
        return;
      }
      const user = JSON.parse(storedUser);
      const role = (user?.role || '').toString().toLowerCase();
      if (role !== 'admin') {
        router.push('/login');
      }
    } catch (e) {
      console.error('Error checking auth in TrainersPage:', e);
      router.push('/login');
    }
  };

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/trainers');
      if (res.ok) {
        const data = await res.json();
        setTrainers(data.trainers || []);
      } else {
        console.error('Failed to fetch trainers');
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (trainer = null) => {
    if (trainer) {
      setEditingTrainer(trainer);
      setFormData({
        firstName: trainer.firstName || "",
        lastName: trainer.lastName || "",
        email: trainer.email || "",
        password: "",
        phone: trainer.phone || "",
        location: trainer.location || "",
        specialization: trainer.specialization || "",
        yearsOfExperience: trainer.yearsOfExperience?.toString() || "",
        bio: trainer.bio || ""
      });
    } else {
      setEditingTrainer(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        location: "",
        specialization: "",
        yearsOfExperience: "",
        bio: ""
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTrainer(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      location: "",
      specialization: "",
      yearsOfExperience: "",
      bio: ""
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!editingTrainer && !formData.password) {
      errors.password = "Password is required";
    }
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const url = editingTrainer 
        ? `/api/admin/trainers/${editingTrainer.id}`
        : '/api/admin/trainers';
      
      const method = editingTrainer ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : null
      };

      if (editingTrainer && !formData.password) {
        delete payload.password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        await fetchTrainers();
        handleCloseModal();
        alert(editingTrainer ? 'Trainer updated successfully!' : 'Trainer added successfully!');
      } else {
        alert(data.error || 'Failed to save trainer');
      }
    } catch (error) {
      console.error('Error saving trainer:', error);
      alert('An error occurred while saving');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this trainer?')) return;

    try {
      const res = await fetch(`/api/admin/trainers/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchTrainers();
        alert('Trainer deleted successfully!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete trainer');
      }
    } catch (error) {
      console.error('Error deleting trainer:', error);
      alert('An error occurred while deleting');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push("/login");
  };

  const handleNavigate = (page) => {
    router.push(`/admin/${page}`);
  };

  const filteredTrainers = trainers.filter(trainer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      trainer.firstName?.toLowerCase().includes(searchLower) ||
      trainer.lastName?.toLowerCase().includes(searchLower) ||
      trainer.email?.toLowerCase().includes(searchLower) ||
      trainer.specialization?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white flex flex-col p-5">
        <h2 className="text-xl font-bold mb-6">ADMIN</h2>
        <ul className="space-y-3">
          <li className="hover:bg-green-700 p-2 rounded cursor-pointer" onClick={() => handleNavigate("dashboard")}>Dashboard</li>
          <li className="hover:bg-green-700 p-2 rounded cursor-pointer" onClick={() => handleNavigate("user-statistics")}>User Statistics</li>
          <li className="hover:bg-green-700 p-2 rounded cursor-pointer" onClick={() => handleNavigate("courses")}>Courses</li>
          <li className="hover:bg-green-700 p-2 rounded cursor-pointer" onClick={() => handleNavigate("institution")}>My Institution</li>
          <li className="hover:bg-green-700 p-2 rounded cursor-pointer" onClick={() => handleNavigate("co-ordinator")}>Coordinators</li>
          <li className="bg-green-700 p-2 rounded cursor-pointer">Trainers</li>
          <li className="hover:bg-green-700 p-2 rounded cursor-pointer" onClick={() => handleNavigate("trainees")}>Trainees</li>
          <li className="hover:bg-green-700 p-2 rounded cursor-pointer" onClick={() => handleNavigate("management")}>Admin Management</li>
          <li className="hover:bg-green-700 p-2 rounded cursor-pointer" onClick={() => handleNavigate("batch")}>Batch</li>
          <li className="hover:bg-green-700 p-2 rounded cursor-pointer" onClick={() => handleNavigate("enrollment")}>Enrollment</li>
          <li className="hover:bg-green-700 p-2 rounded cursor-pointer" onClick={() => handleNavigate("notice-board")}>Notice Board</li>
          <li className="hover:bg-green-700 p-2 rounded cursor-pointer" onClick={() => handleNavigate("settings")}>Settings</li>
          <li onClick={handleLogout} className="hover:bg-red-600 p-2 rounded cursor-pointer mt-5">Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">TRAINERS</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
          >
            + Add Trainer
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search trainers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Trainers Table */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading trainers...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trainer Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Experience</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Specialization</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No trainers found
                    </td>
                  </tr>
                ) : (
                  filteredTrainers.map((trainer) => (
                    <tr key={trainer.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {trainer.firstName} {trainer.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{trainer.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {trainer.yearsOfExperience ? `${trainer.yearsOfExperience} years` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{trainer.specialization || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{trainer.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleOpenModal(trainer)}
                          className="text-green-600 hover:text-green-800 mr-4 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(trainer.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!!editingTrainer}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {!editingTrainer && <span className="text-red-500">*</span>}
                    {editingTrainer && <span className="text-gray-500 text-xs">(leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({...formData, yearsOfExperience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {editingTrainer ? 'Update' : 'Add'} Trainer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
