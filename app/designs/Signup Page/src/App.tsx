"use client";
import svgPaths from "./imports/svg-7q03p6xc9u";
import imgLogo from "./assets/4c5b75d1d1f44b879cc0ffb4b315ece4b0ebb532.png";
import imgImg34061 from "./assets/1f4927ab89635abbedfe9b0f4988a0a078c4ead4.png";
import imgOverlay from "./assets/3ed07145ab101cd8ebca7fa7441287953441637a.png";
import imgGradient from "./assets/84b46758cf032fd795cecf60b64632dede907894.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

function NoZoomLogopVariant() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center justify-center relative shrink-0 w-[130px]" data-name="no zoom logop/Variant2">
      <div className="h-[93px] relative shadow-[0px_4px_109px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="logo">
        <img alt="Logo" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogo?.src ?? imgLogo} />
      </div>
    </div>
  );
}

function Input({ placeholder, value, onChange, onFocus, onBlur, isFocused, hasError, type = "text" }: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  hasError?: boolean;
  type?: string;
}) {
  return (
    <div className={`bg-white min-w-[240px] relative rounded-[8px] shrink-0 w-full transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''} ${hasError ? 'animate-shake' : ''}`} data-name="Input">
      <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px] bg-transparent border-none outline-none w-full placeholder:text-[#b3b3b3]"
          />
        </div>
      </div>
      <div aria-hidden="true" className={`absolute border ${hasError ? 'border-red-500 border-2' : isFocused ? 'border-[#b3853f] border-2' : 'border-[#d9d9d9] border'} border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] transition-all duration-300`} />
    </div>
  );
}

function PasswordInput({ placeholder, value, onChange, onFocus, onBlur, isFocused, showPassword, togglePassword, hasError }: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  showPassword: boolean;
  togglePassword: () => void;
  hasError?: boolean;
}) {
  return (
    <div className={`bg-white min-w-[240px] relative rounded-[8px] shrink-0 w-full transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''} ${hasError ? 'animate-shake' : ''}`} data-name="Input">
      <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full gap-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
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
      <div aria-hidden="true" className={`absolute border ${hasError ? 'border-red-500 border-2' : isFocused ? 'border-[#b3853f] border-2' : 'border-[#d9d9d9] border'} border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] transition-all duration-300`} />
    </div>
  );
}

function InputField({ label, placeholder, value, onChange, onBlur, textColor = "text-neutral-50", hasError, errorMessage, type = "text" }: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  textColor?: string;
  hasError?: boolean;
  errorMessage?: string;
  type?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input Field">
      <p className={`font-['HeliosExt:Bold',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] ${textColor} w-[min-content] transition-all duration-300 ${isFocused ? 'text-white' : ''}`}>{label}</p>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { setIsFocused(false); onBlur && onBlur(); }}
        isFocused={isFocused}
        hasError={hasError}
        type={type}
      />
      {hasError && errorMessage && (
        <p className="font-['Inter:Regular',sans-serif] text-[12px] text-red-400 flex items-center gap-1 animate-[fadeIn_0.3s_ease-in]">
          <XCircle size={14} />
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function PasswordField({ label, placeholder, value, onChange, hasError, errorMessage, showStrength }: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  showStrength?: boolean;
}) {
  // Support an optional onBlur forwarded via props (we access via arguments[0])
  const props: any = arguments[0] as any;
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };

    let strength = 1;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (strength === 3) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (strength === 4) return { strength: 3, label: 'Good', color: 'bg-green-500' };
    return { strength: 4, label: 'Strong', color: 'bg-green-600' };
  };

  const passwordStrength = showStrength ? getPasswordStrength(value) : null;

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input Field">
      <p className={`font-['HeliosExt:Bold',sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] text-white w-[min-content] transition-all duration-300 ${isFocused ? 'opacity-100' : 'opacity-90'}`}>{label}</p>
      <PasswordInput
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { setIsFocused(false); props.onBlur && props.onBlur(); }}
        isFocused={isFocused}
        showPassword={showPassword}
        togglePassword={() => setShowPassword(!showPassword)}
        hasError={hasError}
      />
      {showStrength && value.length > 0 && passwordStrength && (
        <div className="w-full animate-[fadeIn_0.3s_ease-in]">
          <div className="flex gap-1 mb-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-600'
                  }`}
              />
            ))}
          </div>
          <p className="font-['Inter:Regular',sans-serif] text-[12px] text-white/80">
            Password strength: {passwordStrength.label}
          </p>
        </div>
      )}
      {hasError && errorMessage && (
        <p className="font-['Inter:Regular',sans-serif] text-[12px] text-red-400 flex items-center gap-1 animate-[fadeIn_0.3s_ease-in]">
          <XCircle size={14} />
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function MainField({ firstName, setFirstName, lastName, setLastName, username, setUsername, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, errors, touched, handleBlur }: {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  errors: any;
  touched: any;
  handleBlur: (field: string) => void;
}) {
  return (
    <div className="bg-[rgba(250,250,250,0.2)] box-border content-stretch flex flex-col gap-[24px] w-full max-w-[539px] min-w-[280px] pb-[24px] pt-[18px] px-[24px] md:px-[28px] rounded-[8px] mx-auto backdrop-blur-sm" data-name="main field">
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />

      {/* First name and Last name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <InputField
          label="First name"
          placeholder="Name"
          value={firstName}
          onChange={setFirstName}
          hasError={touched.firstName && !!errors.firstName}
          errorMessage={errors.firstName}
          onBlur={() => handleBlur('firstName')}
        />
        <InputField
          label="Last name"
          placeholder="Name"
          value={lastName}
          onChange={setLastName}
          textColor="text-white"
          hasError={touched.lastName && !!errors.lastName}
          errorMessage={errors.lastName}
          onBlur={() => handleBlur('lastName')}
        />
      </div>

      {/* Username */}
      <div>
        <InputField
          label="Username"
          placeholder="Choose a unique username"
          value={username}
          onChange={setUsername}
          hasError={touched.username && !!errors.username}
          errorMessage={errors.username}
          onBlur={() => handleBlur('username')}
        />
      </div>

      {/* Email Address */}
      <InputField
        label="Email Address"
        placeholder="example@email.com"
        value={email}
        onChange={setEmail}
        type="email"
        hasError={touched.email && !!errors.email}
        errorMessage={errors.email}
        onBlur={() => handleBlur('email')}
      />

      {/* Password */}
      <PasswordField
        label="Password"
        placeholder="Enter strong password"
        value={password}
        onChange={setPassword}
        hasError={touched.password && !!errors.password}
        errorMessage={errors.password}
        onBlur={() => handleBlur('password')}
        showStrength={true}
      />

      {/* Confirm Password */}
      <PasswordField
        label="Confirm Password"
        placeholder="Re-enter password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        hasError={touched.confirmPassword && !!errors.confirmPassword}
        errorMessage={errors.confirmPassword}
        onBlur={() => handleBlur('confirmPassword')}
        showStrength={false}
      />
    </div>
  );
}

function Button({ isActive, onClick, children }: { isActive: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] rounded-[8px] flex-1 min-w-[100px] transition-all duration-300 ${isActive
        ? 'bg-[rgba(255,255,255,0.43)] hover:bg-[rgba(255,255,255,0.6)] scale-[1.05]'
        : 'bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.3)]'
        }`}
      data-name="Button"
    >
      <p className="font-['HeliosExt:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">{children}</p>
    </button>
  );
}

function Button2({ isActive, onClick, children }: { isActive: boolean; onClick: () => void; children: React.ReactNode }) {
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
        <p className="font-['HeliosExt:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[16px] text-neutral-100 text-nowrap whitespace-pre">{children}</p>
      </div>
    </button>
  );
}

function RegisterButton({ onClick, disabled, isLoading }: { onClick: () => void; disabled: boolean; isLoading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`bg-[rgba(180,109,47,0.7)] box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] rounded-[8px] w-full max-w-[383px] mx-auto transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[rgba(180,109,47,0.85)] hover:scale-[1.02] active:scale-[0.98]'
        }`}
      data-name="Button"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-neutral-100 border-t-transparent rounded-full animate-spin" />
      ) : (
        <p className="font-['HeliosExt:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[16px] text-neutral-100 text-nowrap whitespace-pre">Register Now</p>
      )}
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

function CheckSmall() {
  return (
    <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="check_small">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="check_small">
          <path d={svgPaths.p1f089400} fill="var(--fill-0, white)" id="icon" />
        </g>
      </svg>
    </div>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0 transition-transform duration-200 hover:scale-110 active:scale-95 bg-transparent border-none cursor-pointer"
      data-name="state-layer"
      aria-label="Agree to terms"
    >
      <div className={`rounded-[2px] shrink-0 size-[18px] transition-all duration-300 ${checked ? 'bg-[#ff7700]' : 'bg-white border border-[#d9d9d9]'}`} data-name="container" />
      {checked && <CheckSmall />}
    </button>
  );
}

export default function Signup() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e && typeof (e as any).preventDefault === 'function') (e as any).preventDefault();
    // ensure validation runs and touched flags are set
    validate();
    if (!isFormValid) {
      setMessage('Please fix validation errors');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      const payload = { firstName, lastName, username, email, password, confirmPassword };
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(data.message || 'Signup successful. Redirecting to login...');
        setTimeout(() => router.push('/login'), 800);
      } else {
        setMessage(data.error || data.message || `Signup failed (${res.status})`);
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    }
    setIsLoading(false);
  };

  // enable register option even if user hasn't explicitly toggled the T&C checkbox
  const isFormValid = firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    username.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const validate = () => {
    const newErrors: any = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (password && confirmPassword && password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validate();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-900" data-name="SIGNUP">
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
          <img
            alt=""
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full min-w-[1247px] object-cover"
            src={imgOverlay?.src ?? imgOverlay}
          />
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
            <NoZoomLogopVariant />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pb-32 sm:pb-40 pt-8 animate-[fadeInUp_0.8s_ease-out]">
          {/* Toggle Buttons */}
          <div className="flex gap-[8px] mb-8 w-full max-w-[450px] justify-center px-4">
            <Button isActive={mode === 'login'} onClick={() => router.push('/login')}>Login</Button>
            <Button2 isActive={mode === 'signup'} onClick={() => setMode('signup')}>Sign-Up</Button2>
          </div>

          {/* Signup Form centered */}
          <div className="w-full max-w-[640px] px-4 mb-6 relative mx-auto">
            <div className="flex items-center justify-center">
              <div className="w-full">
                <MainField
                  firstName={firstName}
                  setFirstName={setFirstName}
                  lastName={lastName}
                  setLastName={setLastName}
                  username={username}
                  setUsername={setUsername}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                />
              </div>
            </div>
          </div>

          {/* Register Button */}
          <div className="w-full max-w-[539px] px-4 mb-6">
            <RegisterButton onClick={handleSubmit} disabled={isLoading} isLoading={isLoading} />
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="w-full max-w-[539px] px-4 mb-8">
            <div className="flex items-center gap-2">
              <Checkbox checked={agreedToTerms} onChange={setAgreedToTerms} />
              <button
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className="font-['HeliosExt:Bold',sans-serif] leading-none not-italic text-[14px] text-white hover:underline bg-transparent border-none cursor-pointer text-left transition-all duration-300 hover:text-[#f09444]"
              >
                I agree to the Terms and Conditions and Privacy Policy
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-20 pb-8 sm:pb-12 md:pb-16 flex flex-col items-center gap-6 px-4 animate-[fadeInUp_1s_ease-out]">
          {/* Welcome to Agri Value Chain */}
          <h1 className="[text-shadow:rgba(0,0,0,0.25)_0px_4px_4px,rgba(0,0,0,0.25)_0px_4px_4px] font-['HeliosExt:Bold',sans-serif] leading-none not-italic text-[32px] sm:text-[48px] md:text-[56px] lg:text-[60px] text-center text-white max-w-[90%] sm:max-w-[1130px] transition-all duration-500 hover:scale-105">
            Welcome to Agri Value Chain
          </h1>

          {/* Login Link */}
          <p className="font-['HeliosExt:Bold',sans-serif] leading-none not-italic text-[#f09444] text-[14px] text-center">
            <>
              <span>Already have an account ? </span>
              <button
                onClick={() => router.push('/login')}
                className="text-neutral-50 hover:underline bg-transparent border-none cursor-pointer transition-all duration-300 hover:text-[#f09444]"
              >
                Login Now
              </button>
            </>
          </p>
        </footer>
      </div>

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
        @keyframes shake {
          0% { transform: translateX(0); }
          10% { transform: translateX(-10px); }
          20% { transform: translateX(10px); }
          30% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          50% { transform: translateX(-10px); }
          60% { transform: translateX(10px); }
          70% { transform: translateX(-10px); }
          80% { transform: translateX(10px); }
          90% { transform: translateX(-10px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}