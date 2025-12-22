export default function GlassLayout({ children, containerClass = 'max-w-7xl mx-auto', noWrapperStyles = false }) {
  const innerClass = noWrapperStyles
    ? containerClass
    : `${containerClass} rounded-2xl p-6`;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className={innerClass}>
          {children}
        </div>
      </div>
    </div>
  );
}
