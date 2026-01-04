"use client";
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import svgPaths from "./imports/svg-7fb3z428gg";
// Replace figma:asset imports with public image paths
const imgBg = "/images/bg.png";
const imgGradient = "/images/gradient.png";
const img = "/images/logo.png";
function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const router = useRouter();
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          alt=""
          className="absolute w-full h-full object-cover opacity-90"
          src={imgBg?.src ?? imgBg}
        />
        <img
          alt=""
          className="absolute top-1/4 left-0 w-full h-[80%] object-cover opacity-60"
          src={imgGradient?.src ?? imgGradient}
        />
        <img
          alt=""
          className="absolute top-1/3 left-0 w-full h-[80%] object-cover opacity-40"
          src={imgGradient?.src ?? imgGradient}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <header className="flex items-center justify-between py-8 sm:py-10 lg:py-14">
          {/* Logo */}
          <button className="shrink-0">
            <div className="w-[90px] h-[65px] sm:w-[110px] sm:h-[80px] lg:w-[130px] lg:h-[93px]">
              <img
                alt="Agri Logo"
                className="w-full h-full object-cover"
                style={{ filter: 'drop-shadow(0px 4px 109px rgba(0,0,0,0.1)) drop-shadow(0px 4px 4px rgba(0,0,0,0.25))' }}
                src={img?.src ?? img}
              />
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden bg-black/90 backdrop-blur-md rounded-lg p-6 mb-8">
            <div className="flex flex-col gap-4">
              <a href="#" className="font-['HeliosExt:Bold',sans-serif] text-white text-[18px]" onClick={(e) => { e.preventDefault(); router.push('/about-us'); }}>About</a>
              <a href="#" className="font-['HeliosExt:Bold',sans-serif] text-white text-[18px]" onClick={(e) => { e.preventDefault(); router.push('/food-nutrition'); }}>Food & Nutrition</a>
              <a href="#" className="font-['HeliosExt:Bold',sans-serif] text-white text-[18px]" onClick={(e) => { e.preventDefault(); router.push('/livelihood'); }}>Livelihood</a>
              <a href="#" className="font-['HeliosExt:Bold',sans-serif] text-white text-[18px]" onClick={(e) => { e.preventDefault(); router.push('/environment'); }}>Environment protection</a>
              <a href="#" className="font-['HeliosExt:Bold',sans-serif] text-white text-[18px]" onClick={(e) => { e.preventDefault(); router.push('/training'); }}>Training</a>
              <a href="#" className="font-['HeliosExt:Bold',sans-serif] text-white text-[18px]" onClick={(e) => { e.preventDefault(); router.push('/contact'); }}>Contact us</a>
              <div className="bg-white h-[44px] rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#d9d9d9] mt-2">
                <div className="flex gap-2 h-full items-center px-4 py-3">
                  <p className="flex-1 font-['Inter:Regular',sans-serif] text-[#1e1e1e] text-[16px]">Search</p>
                  <div className="w-4 h-4">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 10 10">
                      <path d={svgPaths.p307eee40} stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex justify-center gap-12 items-center mb-16">
          <a href="#" className="font-['HeliosExt:Bold',sans-serif] text-black text-[20px] whitespace-nowrap font-bold" onClick={(e) => { e.preventDefault(); router.push('/about-us'); }}>About</a>
          <a href="#" className="font-['HeliosExt:Bold',sans-serif] text-black text-[20px] whitespace-nowrap font-bold" onClick={(e) => { e.preventDefault(); router.push('/food-nutrition'); }}>Food & Nutrition</a>
          <a href="#" className="font-['HeliosExt:Bold',sans-serif] text-black text-[20px] whitespace-nowrap font-bold" onClick={(e) => { e.preventDefault(); router.push('/livelihood'); }}>Livelihood</a>
          <a href="#" className="font-['HeliosExt:Bold',sans-serif] text-black text-[20px] whitespace-nowrap font-bold" onClick={(e) => { e.preventDefault(); router.push('/environment'); }}>Environment protection</a>
          <a href="#" className="font-['HeliosExt:Bold',sans-serif] text-black text-[20px] whitespace-nowrap font-bold" onClick={(e) => { e.preventDefault(); router.push('/training'); }}>Training</a>
          <a href="#" className="font-['HeliosExt:Bold',sans-serif] text-black text-[20px] whitespace-nowrap font-bold" onClick={(e) => { e.preventDefault(); router.push('/contact'); }}>Contact us</a>
        </nav>

        {/* Hero Content */}
        <div className="pt-8 sm:pt-12 lg:pt-20 pb-16 sm:pb-20 lg:pb-32">
          {/* Main Heading */}
          <h1 className="font-['HeliosExt:Bold',sans-serif] text-white mb-6 sm:mb-8 lg:mb-12 [text-shadow:rgba(0,0,0,0.25)_0px_4px_4px,rgba(0,0,0,0.25)_0px_4px_4px,rgba(0,0,0,0.25)_0px_4px_4px]">
            <span className="block text-[48px] sm:text-[64px] lg:text-[96px] leading-none">
              Agri Value <span className="text-[#e3eb43]">Chain</span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="font-['HeliosExt:Bold',sans-serif] text-white text-[18px] sm:text-[22px] lg:text-[28px] mb-12 sm:mb-16 lg:mb-24 max-w-4xl [text-shadow:rgba(0,0,0,0.25)_0px_2px_4px,rgba(0,0,0,0.25)_0px_2px_2px]">
            Post-harvest and Cold Chain solutions for Sustainable Livelihood
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 lg:gap-6 items-stretch sm:items-center w-full">
            {/* Download Button */}
            <a
              href="/pdfs/avc-brochure.pdf"
              download
              className="relative group"
            >
              <div className="h-[56px] w-full sm:w-[380px] lg:w-[404px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                {/* Glass Effect Background */}
                <div className="absolute inset-0 rounded-[34px]">
                  <div className="absolute inset-0 pointer-events-none rounded-[34px]">
                    <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
                    <div className="absolute bg-[rgba(255,255,255,0.41)] inset-0 rounded-[34px]" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative flex items-center h-full px-6 sm:px-10 gap-4">
                  <div className="w-6 h-6 shrink-0">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 25 21">
                      <path d={svgPaths.p1aa26680} stroke="#F3F3F3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <p className="font-['HeliosExt:Bold',sans-serif] text-white text-[18px] sm:text-[20px] whitespace-nowrap">
                    Download AVC Brochure
                  </p>
                </div>
              </div>
            </a>

            {/* View Brochure Button */}
            <button
              onClick={() => setShowBrochureModal(true)}
              className="relative group"
            >
              <div className="h-[56px] w-full sm:w-[320px] lg:w-[340px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                {/* Glass Effect Background */}
                <div className="absolute inset-0 rounded-[34px]">
                  <div className="absolute inset-0 pointer-events-none rounded-[34px]">
                    <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
                    <div className="absolute bg-[rgba(255,255,255,0.41)] inset-0 rounded-[34px]" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative flex items-center h-full px-6 sm:px-10 gap-4">
                  <div className="w-6 h-6 shrink-0">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                      <path d="M12 5C7 5 2.73 8.11 1 12.46c1.73 4.35 6 7.54 11 7.54s9.27-3.19 11-7.54C21.27 8.11 17 5 12 5m0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3" fill="#F3F3F3" />
                    </svg>
                  </div>
                  <p className="font-['HeliosExt:Bold',sans-serif] text-white text-[18px] sm:text-[20px] whitespace-nowrap">
                    View Brochure
                  </p>
                </div>
              </div>
            </button>

            {/* Get Started Button */}
            <button className="relative group sm:ml-auto lg:ml-0" onClick={() => router.push('/login')}>
              <div className="h-[56px] w-full sm:w-[280px] lg:w-[301px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                {/* Glass Effect Background */}
                <div className="absolute inset-0 rounded-[34px]">
                  <div className="absolute inset-0 pointer-events-none rounded-[34px]">
                    <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
                    <div className="absolute bg-[rgba(255,255,255,0.41)] inset-0 rounded-[34px]" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative flex items-center justify-center h-full px-6 gap-3">
                  <div className="w-5 h-5 shrink-0">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 16 17">
                      <path d={svgPaths.p205a9bf0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <p className="font-['HeliosExt:Bold',sans-serif] text-white text-[18px] sm:text-[20px]">
                    Get Started
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Brochure Modal */}
      {showBrochureModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={() => setShowBrochureModal(false)}
        >
          <div
            className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowBrochureModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
            >
              <X size={24} className="text-gray-700" />
            </button>

            {/* PDF Viewer */}
            <div className="w-full h-[85vh] bg-gray-50">
              <iframe
                src="/pdfs/avc-brochure.pdf"
                className="w-full h-full"
                title="AVC Brochure"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default App;