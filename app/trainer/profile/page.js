'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Edit,
  Camera,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

export default function TrainerProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    specialization: ''
  });

  // Fetch trainer profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          router.push('/login');
          return;
        }

        const user = JSON.parse(userData);
        const res = await fetch('/api/trainer/profile', {
          method: 'GET',
          headers: { 'x-user-email': user.email }
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setFormData({
            firstName: data.name?.split(' ')[0] || '',
            lastName: data.name?.split(' ').slice(1).join(' ') || '',
            phone: data.phone || '',
            location: data.location || '',
            specialization: data.specialization || ''
          });
          setProfilePicturePreview(data.profilePicture);
        } else {
          setError('Failed to load profile');
          router.push('/login');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required');
      return;
    }

    try {
      setIsSaving(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');

      let profilePictureUrl = profilePicturePreview;

      // Upload profile picture if a new one was selected
      if (profilePictureFile) {
        const formDataFile = new FormData();
        formDataFile.append('file', profilePictureFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataFile
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          profilePictureUrl = uploadData.url;
        } else {
          setError('Failed to upload profile picture');
          setIsSaving(false);
          return;
        }
      }

      // Update profile
      const res = await fetch('/api/trainer/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userData.email
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          location: formData.location,
          specialization: formData.specialization,
          profilePicture: profilePictureUrl
        })
      });

      if (res.ok) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setProfilePictureFile(null);

        // Refresh profile data
        const updatedRes = await fetch('/api/trainer/profile', {
          method: 'GET',
          headers: { 'x-user-email': userData.email }
        });

        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          setProfile(updatedData);
        }

        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto border border-white border-opacity-10 rounded-2xl p-6 flex items-center justify-center">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
        <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto border border-white border-opacity-10 rounded-2xl p-6 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <p className="text-gray-600">Failed to load profile</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

    return (
      <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto border border-white border-opacity-10 rounded-2xl p-6">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">Success</h3>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex gap-6 items-center flex-1">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={profilePicturePreview}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                    <p className="text-green-600 font-semibold mt-1">{profile.role}</p>
                    <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {profile.joinDate}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 self-start md:self-center"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3 self-start md:self-center">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setProfilePictureFile(null);
                    setError('');
                  }}
                  disabled={isSaving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Contact Information
            </h2>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900 font-medium">{profile.email}</p>
                  </div>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-gray-900 font-medium">{profile.phone}</p>
                    </div>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-900 font-medium">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Professional Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Professional Info
            </h2>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="e.g., Agriculture, Horticulture"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.specialization && (
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="text-gray-900 font-medium">{profile.specialization}</p>
                  </div>
                )}
                {profile.certifications && profile.certifications.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.certifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{profile.totalCourses}</p>
              </div>
              <BookOpen className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{profile.totalStudents}</p>
              </div>
              <Users className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Batches</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{profile.activeBatches}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{profile.completionRate}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}