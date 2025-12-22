'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Camera, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: null,
  });
  const [profilePreview, setProfilePreview] = useState(null);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    retypePassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    retype: false,
  });

  // Loading and message
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch user on mount
  useEffect(() => {
    async function fetchUser() {
      try {
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

        const userData = data?.user || data;

        if (res.ok && userData) {
          setUser(userData);
          setProfileData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            profilePicture: null,
          });
          if (userData.profilePicture) setProfilePreview(userData.profilePicture);
        } else {
          // attempt to use localStorage fallback (development helper)
          try {
            const stored = localStorage.getItem('user');
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.email) {
                setUser(parsed);
                setProfileData({
                  firstName: parsed.firstName || '',
                  lastName: parsed.lastName || '',
                  email: parsed.email || '',
                  profilePicture: null,
                });
                if (parsed.profilePicture) setProfilePreview(parsed.profilePicture);
                return;
              }
            }
          } catch (e) {
            console.error('Error reading fallback user from localStorage', e);
          }

          setMessage({ type: 'error', text: 'User not found' });
        }
      } catch (err) {
        console.error(err);
        setMessage({ type: 'error', text: 'Failed to fetch user' });
      }
    }

    fetchUser();
  }, []);

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePreview(reader.result);
      setProfileData({ ...profileData, profilePicture: file });
    };
    reader.readAsDataURL(file);
  };

  // ✅ Update profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user?.id) return setMessage({ type: 'error', text: 'User not found' });

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const body = {
        firstName: profileData.firstName,
        lastName: profileData.lastName || '',
        profilePicture: profilePreview,
      };

      // include x-user-email header when available (frontend stores user in localStorage)
      const headers = { 'Content-Type': 'application/json' };
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email) headers['x-user-email'] = parsed.email;
        }
      } catch (e) {
        // ignore
      }

      const res = await fetch('/api/user/update-profile', {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');

      setUser(data.user);
      setProfilePreview(data.user.profilePicture || null);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Password update logic stays same
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.retypePassword) {
      setMessage({ type: 'error', text: 'Please fill all password fields' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.retypePassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', retypePassword: '' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-6">
            {/* Header */}
            <div className="mb-6">
              <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>

            <div className="px-0">
              {/* Tabs */}
              <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow-sm mb-6">
                <div className="flex border-b">
                  <button
                    onClick={() => { setActiveTab('profile'); setMessage({ type: '', text: '' }); }}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'profile' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
                  >
                    <User size={20} />Profile
                  </button>
                  <button
                    onClick={() => { setActiveTab('password'); setMessage({ type: '', text: '' }); }}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'password' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
                  >
                    <Lock size={20} />Password
                  </button>
                </div>
              </div>

              {/* Message */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {message.text}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
                  <form onSubmit={handleProfileUpdate}>
                    {/* Profile Picture */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                            {profilePreview ? (
                              <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User size={40} />
                              </div>
                            )}
                          </div>
                          <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700">
                            <Camera size={16} />
                            <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                          </label>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Click the camera icon to upload a new picture</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (Max 5MB)</p>
                        </div>
                      </div>
                    </div>

                    {/* ✅ First Name */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>

                    {/* ✅ Last Name */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your last name (optional)"
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordUpdate}>
                    {['current', 'new', 'retype'].map((field, idx) => (
                      <div className="mb-6" key={idx}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field === 'current' ? 'Current Password' : field === 'new' ? 'New Password' : 'Retype New Password'}
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords[field] ? 'text' : 'password'}
                            value={passwordData[field + 'Password']}
                            onChange={(e) => setPasswordData({ ...passwordData, [field + 'Password']: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                            placeholder={field === 'current' ? 'Enter current password' : field === 'new' ? 'Enter new password' : 'Retype new password'}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(field)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPasswords[field] ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {field === 'new' && <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>}
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
