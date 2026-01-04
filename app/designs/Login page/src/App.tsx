"use client";
import imgLogo from "./assets/4c5b75d1d1f44b879cc0ffb4b315ece4b0ebb532.png";
import imgImg34061 from "./assets/1f4927ab89635abbedfe9b0f4988a0a078c4ead4.png";
import imgOverlay from "./assets/3ed07145ab101cd8ebca7fa7441287953441637a.png";
import imgGradient from "./assets/84b46758cf032fd795cecf60b64632dede907894.png";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Input({ value, onChange, onFocus, onBlur, isFocused }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
}) {
  return (
    <div className={`bg-white min-w-[240px] relative rounded-[8px] shrink-0 w-full transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`} data-name="Input">
      <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
          <input
            type="text"
            placeholder="Name"
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px] bg-transparent border-none outline-none w-full placeholder:text-[#b3b3b3]"
          />
        </div>
      </div>
      <div aria-hidden="true" className={`absolute border ${isFocused ? 'border-[#b3853f] border-2' : 'border-[#d9d9d9] border'} border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] transition-all duration-300`} />
    </div>
  );
}

function InputField({ username, setUsername }: { username: string; setUsername: (value: string) => void }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input Field">
      <p className={`font-['HeliosExt:Bold',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] text-neutral-50 w-[min-content] transition-all duration-300 ${isFocused ? 'text-white' : ''}`}>Username</p>
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        isFocused={isFocused}
      />
    </div>
  );
}

function Input1({ value, onChange, onFocus, onBlur, isFocused, showPassword, togglePassword }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  showPassword: boolean;
  togglePassword: () => void;
}) {
  return (
    <div className={`bg-white min-w-[240px] relative rounded-[8px] shrink-0 w-full transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`} data-name="Input">
      <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full gap-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="@Ab1"
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px] bg-transparent border-none outline-none w-full placeholder:text-[#b3b3b3]"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="shrink-0 text-[#666] hover:text-[#1e1e1e] transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <div aria-hidden="true" className={`absolute border ${isFocused ? 'border-[#b3853f] border-2' : 'border-[#d9d9d9] border'} border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] transition-all duration-300`} />
    </div>
  );
}

function InputField1({ password, setPassword }: { password: string; setPassword: (value: string) => void }) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input Field">
      <p className={`font-['HeliosExt:Bold',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] text-white w-[min-content] transition-all duration-300 ${isFocused ? 'text-white opacity-100' : 'opacity-90'}`}>Password</p>
      <Input1
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        isFocused={isFocused}
        showPassword={showPassword}
        togglePassword={() => setShowPassword(!showPassword)}
      />
    </div>
  );
}

function MainField({ username, setUsername, password, setPassword }: {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}) {
  return (
    <div className="bg-[rgba(204,204,204,0.2)] box-border content-stretch flex flex-col gap-[4px] w-full max-w-[450px] min-w-[280px] pb-[24px] pt-[30px] px-[24px] rounded-[8px] mx-auto backdrop-blur-sm" data-name="main field">
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
      <InputField username={username} setUsername={setUsername} />
      <InputField1 password={password} setPassword={setPassword} />
    </div>
  );
}

function Button({ onClick, disabled, isLoading }: { onClick: () => void; disabled: boolean; isLoading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`bg-[rgba(180,109,47,0.7)] rounded-[8px] w-full max-w-[383px] mx-auto relative border border-[#2c2c2c] border-solid transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[rgba(180,109,47,0.85)] hover:scale-[1.02] active:scale-[0.98]'
        }`}
      data-name="Button"
    >
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit] w-full">
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-neutral-100 border-t-transparent rounded-full animate-spin" />
        ) : (
          <p className="font-['HeliosExt:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[16px] text-neutral-100 text-nowrap whitespace-pre">Login</p>
        )}
      </div>
    </button>
  );
}

function Button1({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] rounded-[8px] flex-1 min-w-[100px] transition-all duration-300 ${isActive
        ? 'bg-[rgba(255,255,255,0.43)] hover:bg-[rgba(255,255,255,0.6)] scale-[1.05]'
        : 'bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.3)]'
        }`}
      data-name="Button"
    >
      <p className="font-['HeliosExt:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">Login</p>
    </button>
  );
}

function Button2({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[8px] flex-1 min-w-[100px] relative border border-[rgba(44,44,44,0.33)] border-solid transition-all duration-300 ${isActive
        ? 'bg-[rgba(180,109,47,0.7)] hover:bg-[rgba(180,109,47,0.85)] scale-[1.05]'
        : 'bg-[rgba(180,109,47,0.4)] hover:bg-[rgba(180,109,47,0.6)]'
        }`}
      data-name="Button"
    >
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit] w-full">
        <p className="font-['HeliosExt:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[16px] text-neutral-100 text-nowrap whitespace-pre">Sign-Up</p>
      </div>
    </button>
  );
}

function X({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative shrink-0 size-[16px] bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
      data-name="X"
      aria-label="Clear search"
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="X">
          <path d="M12 4L4 12M4 4L12 12" id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </button>
  );
}

function NoZoomLogopVariant({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} aria-label="Open logo" className="content-stretch flex flex-col gap-[10px] items-center justify-center relative shrink-0 w-[130px]" data-name="no zoom logop/Variant2">
      <div className="h-[93px] relative shadow-[0px_4px_109px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="logo">
        <img alt="Logo" className="absolute inset-0 max-w-none object-50%-50% object-cover size-full" src={imgLogo?.src ?? imgLogo} />
      </div>
    </button>
  );
}

import { useRouter } from "next/navigation";

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showLogoModal, setShowLogoModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username || !password) return;
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        data = { message: text };
      }
      if (res.ok) {
        try {
          if (data.user?.role && data.user.role.toLowerCase() === 'trainer') {
            const profileRes = await fetch('/api/trainer/profile', {
              method: 'GET',
              headers: { 'x-user-email': data.user.email }
            });
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              localStorage.setItem('user', JSON.stringify(profileData));
            } else {
              localStorage.setItem('user', JSON.stringify(data.user));
            }
          } else {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        } catch (err) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        switch (data.user.role.toLowerCase()) {
          case "trainer":
            router.push("/trainer/dashboard");
            break;
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "trainee":
            router.push("/trainee/dashboard");
            break;
          default:
            router.push("/");
        }
      } else {
        const serverMsg = data?.message || data?.error || text || `Login failed (${res.status})`;
        setMessage(serverMsg);
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    }
    setIsLoading(false);
  };

  const isFormValid = username.trim().length > 0 && password.length > 0;

  const handleForgotSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim()) {
      setMessage('Please enter your email');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(data.message || 'If this email exists, a reset link was sent.');
      } else {
        setMessage(data.error || data.message || `Request failed (${res.status})`);
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-900" data-name="LOGIN">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full" data-name="IMG_3406 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt=""
            className="absolute min-h-full min-w-full object-cover left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-110 transition-transform duration-[10s] hover:scale-[1.15]"
            src={imgImg34061?.src ?? imgImg34061}
          />
        </div>
      </div>

      {/* Overlay and Gradient */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-[40%] overflow-hidden" data-name="overlay">
          {imgOverlay && (
            <img
              alt=""
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full min-w-[1247px] object-cover"
              src={imgOverlay?.src ?? imgOverlay}
            />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[40%] overflow-hidden" data-name="gradient">
          <img
            alt=""
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full min-w-[1347px] object-cover"
            src={imgGradient?.src ?? imgGradient}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-start justify-between p-4 sm:p-6 md:p-8 lg:p-12 animate-[fadeIn_0.6s_ease-in]">
          {/* Logo */}
          <div className="flex-shrink-0 hover:scale-110 transition-transform duration-300">
            <NoZoomLogopVariant onClick={() => setShowLogoModal(true)} />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pb-32 sm:pb-40 animate-[fadeInUp_0.8s_ease-out]">
          {/* Toggle Buttons */}
          <div className="flex gap-[8px] mb-8 w-full max-w-[450px] justify-center px-4 mx-auto">
            <Button1 isActive={mode === 'login'} onClick={() => setMode('login')} />
            <Button2 isActive={mode === 'signup'} onClick={() => router.push('/signup')} />
          </div>

          {/* Login Form */}

          <form onSubmit={mode === 'forgot' ? handleForgotSubmit : handleSubmit} className="w-full max-w-[450px] px-4 mb-6 relative mx-auto">
            <InputField username={username} setUsername={setUsername} />
            {mode !== 'forgot' && (
              <div className="mt-4">
                <InputField1 password={password} setPassword={setPassword} />
              </div>
            )}
            {message && (
              <div className="text-red-500 text-sm mt-2 text-center">{message}</div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 font-['HeliosExt:Bold',sans-serif] text-white bg-[#f09444] rounded-[8px] text-[18px] transition-all duration-300 hover:bg-[#b3853f] focus:outline-none focus:ring-2 focus:ring-[#b3853f] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={((mode === 'forgot' ? username.trim().length === 0 : !isFormValid) || isLoading)}
              >
                {isLoading ? (mode === 'forgot' ? 'Sending...' : 'Logging in...') : (mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Send reset link')}
              </button>
            </div>
          </form>

          {/* Forgot Password */}
          <div className="w-full max-w-[450px] px-4 text-center mb-8 mx-auto">
            <button onClick={() => setMode('forgot')} className="font-['HeliosExt:Bold',sans-serif] not-italic text-[14px] text-white hover:underline bg-transparent border-none cursor-pointer transition-all duration-300 hover:text-[#f09444]">
              Forgot password ?
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-20 pb-8 sm:pb-12 md:pb-16 flex flex-col items-center gap-6 px-4 animate-[fadeInUp_1s_ease-out]">
          {/* Glad to see you back */}
          <h1 className="[text-shadow:rgba(0,0,0,0.25)_0px_4px_4px,rgba(0,0,0,0.25)_0px_4px_4px] font-['HeliosExt:Bold',sans-serif] leading-none not-italic text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] text-center text-white max-w-[90%] sm:max-w-[882px] transition-all duration-500 hover:scale-105">
            {mode === 'login' ? 'Glad to see you back !' : 'Welcome to our community !'}
          </h1>

          {/* Sign-Up Text */}
          <p className="font-['HeliosExt:Bold',sans-serif] leading-none not-italic text-[#f09444] text-[14px] text-center">
            <>
              <span>Don't have an account ? </span>
              <button
                onClick={() => router.push('/signup')}
                className="text-neutral-50 hover:underline bg-transparent border-none cursor-pointer transition-all duration-300 hover:text-[#f09444]"
              >
                Sign-Up Now
              </button>
            </>
          </p>
        </footer>
      </div>

      {showLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" role="dialog" aria-modal="true">
          <div className="bg-white p-6 rounded-md relative max-w-[90%]">
            <button onClick={() => setShowLogoModal(false)} aria-label="Close" className="absolute right-3 top-3 bg-transparent border-none text-gray-700 hover:opacity-80">
              ✕
            </button>
            <div className="flex items-center justify-center p-4">
              <img src={imgLogo?.src ?? imgLogo} alt="Logo" className="max-h-[60vh] max-w-full object-contain" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}