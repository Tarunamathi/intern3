interface GlassCardProps {
  value: string;
  label: string;
}

export function GlassCard({ value, label }: GlassCardProps) {
  return (
    <div 
      className="relative h-[120px] sm:h-[133px] w-full rounded-[15px] overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)"
      }}
    >
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-['Inter:Black',sans-serif] font-black leading-[normal] not-italic px-4">
        <p className="text-3xl sm:text-[40px] text-center">{value}</p>
        <p className="text-xs sm:text-[13px] text-nowrap whitespace-pre text-center mt-1">{label}</p>
      </div>
    </div>
  );
}
