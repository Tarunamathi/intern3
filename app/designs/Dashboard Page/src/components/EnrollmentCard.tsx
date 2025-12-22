interface EnrollmentCardProps {
  title: string;
}

export function EnrollmentCard({ title }: EnrollmentCardProps) {
  return (
    <div 
      className="relative h-[110px] sm:h-[125px] w-full rounded-[15px] overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)"
      }}
    >
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <p className="font-['Inter:Black',sans-serif] font-black leading-[normal] not-italic text-white text-lg sm:text-[22px] text-center">
          {title}
        </p>
      </div>
    </div>
  );
}
