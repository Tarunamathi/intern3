"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          router.push('/login');
          return;
        }

        const user = JSON.parse(storedUser);
        
        // Fetch dashboard statistics
        const response = await fetch('/api/admin/dashboard-stats', {
          headers: { 
            'x-user-email': user.email,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 401 || response.status === 403) {
            router.push('/login');
            return;
          }
          throw new Error(errorData.error || 'Failed to fetch dashboard data');
        }

        const data = await response.json();
        if (!data || !data.stats) {
          throw new Error('Invalid dashboard data received');
        }
        
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Show error in UI instead of just console
        setDashboardData({
          error: error.message || 'Failed to load dashboard data'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardData?.error) {
    return (
      <div className="bg-gray-50 min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">
            {dashboardData.error}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-green-700/5 to-transparent">
      <div className="max-w-7xl mx-auto">
      {/* Top Main Heading */}
      <h1 className="text-4xl font-bold mb-8 text-black text-center">
        DASHBOARD
      </h1>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-black mb-2">
            {stats.totalCourses || 0}
          </div>
          <div className="text-gray-100 text-sm font-medium">
            Total Courses
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-black mb-2">
            {stats.totalTrainers || 0}
          </div>
          <div className="text-gray-100 text-sm font-medium">
            Total Trainers
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-black mb-2">
            {stats.totalTrainees || 0}
          </div>
          <div className="text-gray-100 text-sm font-medium">
            Total Trainees
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-black mb-2">
            {stats.totalBatches || 0}
          </div>
          <div className="text-gray-100 text-sm font-medium">
            Total Batches
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {stats.totalEnrollment || 0}
          </div>
          <div className="text-gray-100 text-sm font-medium">
            Total Enrollment
          </div>
        </div>
      </div>

      {/* Enrollment Progress */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow p-6">
          <h2 className="font-semibold text-xl mb-4 text-black">
            Enrollment Process
          </h2>
          <div className="h-48 flex items-center justify-center text-gray-100 bg-white/5 rounded">
            <div className="text-center">
              <p className="text-sm mb-2">Registration → Completed</p>
              {dashboardData?.enrollmentProcess1 && (
                <div className="space-y-1">
                  <p>Registered: {dashboardData.enrollmentProcess1.registered || 0}</p>
                  <p>Completed: {dashboardData.enrollmentProcess1.completed || 0}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow p-6">
          <h2 className="font-semibold text-xl mb-4 text-black">
            Enrollment Process
          </h2>
          <div className="h-48 flex items-center justify-center text-gray-100 bg-white/5 rounded">
            <div className="text-center">
              <p className="text-sm mb-2">Registration → Active → Completed</p>
              {dashboardData?.enrollmentProcess2 && (
                <div className="space-y-1">
                  <p>Registered: {dashboardData.enrollmentProcess2.registered || 0}</p>
                  <p>Active: {dashboardData.enrollmentProcess2.active || 0}</p>
                  <p>Completed: {dashboardData.enrollmentProcess2.completed || 0}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Insights */}
      <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow p-6">
        <h2 className="font-semibold text-xl mb-6 text-black">
          Course Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardData?.courseInsights && dashboardData.courseInsights.length > 0 ? (
            dashboardData.courseInsights.map((course, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-black">
                  {course.name}
                </h3>
                <div className="text-3xl font-bold text-gray-100 mb-1">
                  {course.enrollments}
                </div>
                <div className="text-gray-100 text-sm">Enrollments</div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-black">
                  Post Harvest Management
                </h3>
                <div className="text-3xl font-bold text-gray-100 mb-1">0</div>
                <div className="text-gray-100 text-sm">Enrollments</div>
              </div>
              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-black">
                  Cold Chain Operation
                </h3>
                <div className="text-3xl font-bold text-gray-100 mb-1">0</div>
                <div className="text-gray-100 text-sm">Enrollments</div>
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}