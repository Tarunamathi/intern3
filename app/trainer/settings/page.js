'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, MapPin, Building, Lock, Save, X, 
  AlertCircle, CheckCircle, Eye, EyeOff, Camera
} from 'lucide-react';

export default function TrainerSetting() {
  const router = useRouter();
  const [trainerData, setTrainerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    yearsOfExperience: '',
    bio: '',
    specialization: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch trainer data
  useEffect(() => {
    const fetchTrainerData = async () => {
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
          setTrainerData(data);
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || '',
            yearsOfExperience: data.yearsOfExperience || '',
            bio: data.bio || '',
            specialization: data.specialization || ''
          });
          if (data.profilePicture) {
            setProfilePicturePreview(data.profilePicture);
          }
        } else {
          setError('Failed to load trainer profile');
          router.push('/login');
        }
      } catch (err) {
        console.error('Error fetching trainer data:', err);
        setError('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, [router]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setError('');
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all required fields (First Name, Last Name, Email)');
      return;
    }

    try {
      setIsSaving(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      let profilePictureUrl = profilePicturePreview;

      // Upload profile picture if a new one was selected
      if (profilePicture) {
        const formDataFile = new FormData();
        formDataFile.append('file', profilePicture);

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

      const res = await fetch('/api/trainer/profile/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': userData.email 
        },
        body: JSON.stringify({
          ...formData,
          profilePicture: profilePictureUrl,
          yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : null
        })
      });

      if (res.ok) {
        const resp = await res.json().catch(() => null);
        // update localStorage user for dev-auth and UI
        try {
          const stored = JSON.parse(localStorage.getItem('user') || '{}');
          const updatedUser = {
            ...stored,
            firstName: resp?.user?.firstName || formData.firstName,
            lastName: resp?.user?.lastName || formData.lastName,
            profilePicture: resp?.user?.profilePicture || profilePictureUrl || stored.profilePicture
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (e) {
          // ignore localStorage errors
        }

        setSuccess('Profile updated successfully!');
        setProfilePicture(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    try {
      setIsSaving(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      const res = await fetch('/api/trainer/profile/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': userData.email 
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (res.ok) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordChange(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Error changing password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto border border-white border-opacity-10 rounded-2xl p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto border border-white border-opacity-10 rounded-2xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your profile and account preferences</p>
        </div>

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

        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <User className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Profile Picture */}
            <div>
              <label className="block text-gray-700 font-medium mb-4 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Profile Picture
              </label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-green-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profilePicture"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors inline-block"
                  >
                    Change Picture
                  </label>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF (Max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="block text-gray-700 font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter phone number"
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter years of experience"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Agriculture, Horticulture, etc."
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Write a short bio about yourself"
              />
            </div>

            {/* Address Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Address
              </h3>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-6 border-t">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <Lock className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Security</h2>
          </div>

          {!showPasswordChange ? (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              {/* Current Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Current Password *</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">New Password *</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password (min 8 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-2">Password requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 8 characters long</li>
                  <li>Passwords must match</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}