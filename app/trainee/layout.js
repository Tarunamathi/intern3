export const metadata = {
  title: 'Trainee Portal | Learning Management System',
  description: 'Trainee dashboard and pages',
}

import GlassLayout from '../../components/ui/GlassLayout';

export default function TraineeLayout({ children }) {
  return (
    <GlassLayout containerClass="w-full h-full p-0" noWrapperStyles={true}>
      {children}
    </GlassLayout>
  );
}
