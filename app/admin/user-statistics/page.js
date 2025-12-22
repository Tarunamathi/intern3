'use client';

import { useState, useEffect } from 'react';

export default function UserStatisticsPage() {
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchUserStats() {
      try {
        const response = await fetch('/api/users/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch user statistics');
        }
        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        console.error('Error fetching user statistics:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserStats();
  }, []);

  const filteredUsers = userStats.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p>Error loading user statistics: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-green-700/5 to-transparent">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-600">User Statistics</h1>
        <p className="text-gray-300 mt-2">Track user activity and engagement across the platform</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-100">Total Users</h3>
          <p className="text-3xl font-bold text-green-600">{userStats.length}</p>
        </div>
        {/* Role-based stats */}
        {['Admin', 'Trainer', 'Trainee', 'Coordinator'].map(role => (
          <div key={role} className="bg-white/5 backdrop-blur-xl rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-100">Total {role}s</h3>
            <p className="text-3xl font-bold text-green-600">
              {userStats.filter(user => user.role.toLowerCase() === role.toLowerCase()).length}
            </p>
          </div>
        ))}
      </div>

      {/* User Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-white/10">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role.toLowerCase() === 'trainer' ? 'bg-green-100 text-green-800' :
                        user.role.toLowerCase() === 'trainee' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{new Date(user.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-300">
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}