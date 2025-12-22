export const metadata = {
  title: 'Admin Dashboard | Learning Management System',
  description: 'Admin dashboard for managing courses, users, and resources',
}

export const viewport = {
  themeColor: '#166534', // green-800 from your color scheme
  width: 'device-width',
  initialScale: 1
}

import GlassLayout from '../../components/ui/GlassLayout';

export default function AdminLayout({ children }) {
  return (
    <GlassLayout containerClass="w-full h-full p-0" noWrapperStyles={true}>
      {children}
    </GlassLayout>
  );
}