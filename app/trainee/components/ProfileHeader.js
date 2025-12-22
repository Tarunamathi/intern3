
'use client';
import NotificationBell from '../../../components/NotificationBell';

export default function ProfileHeader({ user }) {
  if (!user) return null;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const profilePicture = user.profilePicture || '/default-avatar.png'; // fallback

  return (
    <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl flex items-center justify-between mb-6 text-white">
      <div>
        <h2 className="text-2xl font-semibold">{fullName || 'N/A'}</h2>
        <p className="text-white text-opacity-80">{user.role || 'Trainee'}</p>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell userRole="trainee" userEmail={user.email} />
        <img
          src={profilePicture}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border-2 border-green-400"
        />
      </div>
    </div>
  );
}
