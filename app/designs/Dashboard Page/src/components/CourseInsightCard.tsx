interface CourseInsightCardProps {
  title: string;
  value: string;
  label: string;
}

export function CourseInsightCard({ title, value, label }: CourseInsightCardProps) {
  return (
    <div 
      className="relative h-[180px] sm:h-[207px] w-full rounded-[15px] overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)"
      }}
    >
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 py-6 sm:py-8">
        <p className="font-['HeliosExt:Bold',sans-serif] leading-[normal] not-italic text-white text-lg sm:text-[20px] mb-2 sm:mb-4">
          {title}
        </p>
        <p className="font-['HeliosExt:Bold',sans-serif] leading-[normal] not-italic text-white text-5xl sm:text-[75px]">
          {value}
        </p>
        <p className="font-['HeliosExt:Bold',sans-serif] leading-[normal] not-italic text-white text-xs sm:text-[12px] mt-2">
          {label}
        </p>
      </div>
    </div>
  );
}
