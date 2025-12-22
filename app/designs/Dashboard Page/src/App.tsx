import { GlassCard } from "./components/GlassCard";
import { EnrollmentCard } from "./components/EnrollmentCard";
import { CourseInsightCard } from "./components/CourseInsightCard";
import imgLogo from "figma:asset/4c5b75d1d1f44b879cc0ffb4b315ece4b0ebb532.png";
import imgBg from "figma:asset/4315496bc5670401895bda2a44959ee5909cd454.png";
import imgGradient from "figma:asset/84b46758cf032fd795cecf60b64632dede907894.png";

export default function App() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-110"
          src={imgBg}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-[356px] pointer-events-none">
        <img 
          alt="" 
          className="absolute w-full h-auto object-cover opacity-80"
          src={imgGradient}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-8 lg:py-14">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-12 gap-4">
          <h1 
            className="text-white font-['HeliosExt:Bold',sans-serif] text-4xl sm:text-5xl lg:text-[75px] leading-[normal] not-italic"
            style={{
              textShadow: "rgba(0,0,0,0.25) 0px 4px 4px, rgba(0,0,0,0.25) 0px 4px 4px"
            }}
          >
            Dashboard
          </h1>
          
          {/* Logo */}
          <div className="shrink-0">
            <img 
              alt="Agri Logo" 
              className="w-[100px] sm:w-[130px] h-auto"
              src={imgLogo}
              style={{ filter: "drop-shadow(0px 4px 109px rgba(0,0,0,0.1)) drop-shadow(0px 4px 4px rgba(0,0,0,0.25))" }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-8 lg:mb-12">
          <GlassCard value="120" label="Total Institutions" />
          <GlassCard value="75" label="Total Courses" />
          <GlassCard value="30" label="Total Trainers" />
          <GlassCard value="450" label="Total Trainees" />
          <GlassCard value="50" label="Total Batches" />
          <GlassCard value="3500" label="Total Enrollment" />
        </div>

        {/* Enrollment Process Section */}
        <div className="mb-8 lg:mb-12">
          <h2 className="text-white font-['HeliosExt:Bold',sans-serif] text-base sm:text-lg mb-4 px-2">
            Enrollment Process
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <EnrollmentCard 
              title="Chart: Registration → Completed"
            />
            <EnrollmentCard 
              title="Chart: Registration → Active → Completed"
            />
          </div>
        </div>

        {/* Course Insights Section */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <h2 className="text-white font-['HeliosExt:Bold',sans-serif] text-base sm:text-lg mb-4 px-2">
                Course Insights
              </h2>
              <CourseInsightCard 
                title="Post Harvest Management"
                value="300"
                label="Enrollments"
              />
            </div>
            <div>
              <h2 className="text-white font-['HeliosExt:Bold',sans-serif] text-base sm:text-lg mb-4 px-2">
                Cold Chain Operation
              </h2>
              <CourseInsightCard 
                title="Cold Chain Operation"
                value="150"
                label="Enrollments"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}