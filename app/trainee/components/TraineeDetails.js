'use client';

export default function TraineeDetails({ user }) {
  if (!user) return null;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const role = user.role || 'Trainee';

  return (
    <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl text-white">
      <h3 className="text-xl font-semibold mb-4">Trainee Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-white text-opacity-70">Full Name</p>
          <p className="font-medium">{fullName || 'N/A'}</p>
        </div>
        <div>
          <p className="text-white text-opacity-70">Role</p>
          <p className="font-medium">{role}</p>
        </div>
        <div>
          <p className="text-white text-opacity-70">Email</p>
          <p className="font-medium">{user.email || 'N/A'}</p>
        </div>
        <div>
          <p className="text-white text-opacity-70">Phone</p>
          <p className="font-medium">{user.phone || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
