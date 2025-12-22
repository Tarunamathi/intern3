// ============================================
// app/trainer/certificates/page.js
// Enhanced Certificate Management - Company & Institute
// ============================================

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Eye, Download, Trash2, ArrowLeft, Upload, X } from 'lucide-react';

// ============================================
// UTILS - Certificate Helpers
// ============================================
const certificateHelpers = {
  formatDate: (dateString) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    return new Date(dateString).toISOString().split('T')[0];
  },

  downloadCertificate: (cert, template, brandingDetails, fontSettings = {}) => {
    const { fontSize = 'medium', fontStyle = 'elegant' } = fontSettings;
    
    // Font size multipliers
    const sizeMap = {
      small: { title: '24px', name: '22px', course: '14px', subtitle: '11px', label: '9px', value: '12px', icon: '30px', company: '14px' },
      medium: { title: '28px', name: '26px', course: '16px', subtitle: '12px', label: '10px', value: '14px', icon: '35px', company: '16px' },
      large: { title: '32px', name: '30px', course: '18px', subtitle: '13px', label: '11px', value: '15px', icon: '40px', company: '18px' }
    };
    
    // Font family selections
    const styleMap = {
      elegant: { title: "'Playfair Display', serif", body: "'Lora', serif", accent: "'Montserrat', sans-serif" },
      modern: { title: "'Montserrat', sans-serif", body: "'Montserrat', sans-serif", accent: "'Montserrat', sans-serif" },
      classic: { title: "'Georgia', serif", body: "'Georgia', serif", accent: "'Arial', sans-serif" }
    };
    
    const sizes = sizeMap[fontSize] || sizeMap.medium;
    const fonts = styleMap[fontStyle] || styleMap.elegant;
    
    const certWindow = window.open('', '_blank');
    certWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${cert.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@400;600;700&family=Lora:wght@400;600&display=swap');
          
          * {
            margin: 0;
            padding: 0;
          }
          
          @page {
            size: A4 landscape;
            margin: 5mm;
          }
          
          body { 
            font-family: ${fonts.body}; 
            margin: 0;
            padding: 10px;
            background: white;
          }
          
          .certificate {
            width: 100%;
            max-width: 297mm;
            height: 210mm;
            background: ${template?.gradient || 'linear-gradient(135deg, white 0%, #f9f9f9 100%)'};
            padding: 20px 30px;
            border: 5px solid ${template?.hexColor || '#d97706'};
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          
          .certificate::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 10% 10%, rgba(255,255,255,0.8) 0%, transparent 50%),
              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 0%, transparent 50%);
            pointer-events: none;
          }
          
          .certificate-content {
            position: relative;
            z-index: 1;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            gap: 10px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${template?.hexColor || '#d97706'};
          }
          
          .logo-section {
            flex: 0 0 60px;
          }
          
          .logo-img {
            width: 60px;
            height: 60px;
            object-fit: contain;
          }
          
          .company-info {
            flex: 1;
            text-align: center;
          }
          
          .company-name {
            font-family: ${fonts.title};
            font-size: ${sizes.company};
            font-weight: 900;
            color: ${template?.hexColor || '#d97706'};
            margin: 0;
            letter-spacing: 0.5px;
          }
          
          .institute-info {
            flex: 0 0 auto;
            text-align: right;
          }
          
          .institute-name {
            font-size: 9px;
            font-weight: 600;
            color: #555;
            margin: 0;
          }
          
          .center-header {
            text-align: center;
            margin: 8px 0;
          }
          
          .award-icon {
            font-size: ${sizes.icon};
            margin-bottom: 6px;
          }
          
          .title {
            font-family: ${fonts.title};
            font-size: ${sizes.title};
            font-weight: 900;
            color: ${template?.hexColor || '#d97706'};
            margin: 4px 0;
            letter-spacing: 1px;
          }
          
          .divider-line {
            width: 80px;
            height: 2px;
            background: linear-gradient(90deg, transparent, ${template?.hexColor || '#d97706'}, transparent);
            margin: 8px auto;
          }
          
          .subtitle {
            font-family: ${fonts.body};
            font-size: ${sizes.subtitle};
            color: #555;
            margin: 6px 0;
            font-weight: 400;
          }
          
          .name {
            font-family: ${fonts.title};
            font-size: ${sizes.name};
            font-weight: 900;
            color: ${template?.hexColor || '#d97706'};
            margin: 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
          }
          
          .course {
            font-family: ${fonts.body};
            font-size: ${sizes.course};
            color: #333;
            margin: 8px 0;
            font-weight: 600;
          }
          
          .decorative-line {
            width: 100px;
            height: 1px;
            background: linear-gradient(90deg, transparent, ${template?.hexColor || '#d97706'}, transparent);
            margin: 10px auto;
          }
          
          .footer {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px dashed ${template?.hexColor || '#d97706'};
            position: relative;
          }
          
          .footer::before {
            content: '';
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 16px;
            height: 16px;
            background: ${template?.hexColor || '#d97706'};
            border-radius: 50%;
          }
          
          .footer-item {
            text-align: center;
            flex: 1;
            font-size: 9px;
          }
          
          .footer-label {
            font-weight: 700;
            color: ${template?.hexColor || '#d97706'};
            font-size: ${sizes.label};
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .footer-value {
            color: #333;
            font-size: ${sizes.value};
            margin-top: 2px;
            font-family: ${fonts.body};
          }
          
          .seal {
            position: absolute;
            width: 50px;
            height: 50px;
            border: 2px solid ${template?.hexColor || '#d97706'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            bottom: 15px;
            right: 25px;
            background: rgba(255,255,255,0.9);
          }
          
          @media print {
            body { background: white; padding: 0; margin: 0; }
            .certificate { box-shadow: none; margin: 0; padding: 15px 20px; height: auto; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="certificate-content">
            ${brandingDetails?.logoUrl || brandingDetails?.companyName || brandingDetails?.instituteName ? `
              <div class="header-section">
                ${brandingDetails?.logoUrl ? `<div class="logo-section"><img src="${brandingDetails.logoUrl}" alt="Logo" class="logo-img" /></div>` : '<div class="logo-section"></div>'}
                <div class="company-info">
                  ${brandingDetails?.companyName ? `<p class="company-name">${brandingDetails.companyName}</p>` : ''}
                </div>
                <div class="institute-info">
                  ${brandingDetails?.instituteName ? `<p class="institute-name">${brandingDetails.instituteName}</p>` : ''}
                </div>
              </div>
            ` : ''}
            
            <div class="center-header">
              <div class="award-icon">🏆</div>
              <div class="title">Certificate of Completion</div>
              <div class="divider-line"></div>
            </div>
            
            <div style="text-align: center;">
              <p class="subtitle">This is to certify that</p>
              <h2 class="name">${cert.traineeName}</h2>
              <p class="subtitle">has successfully completed the course</p>
              <h3 class="course">${cert.course}</h3>
              <div class="decorative-line"></div>
              
              <div class="footer">
                <div class="footer-item">
                  <div class="footer-label">Date</div>
                  <div class="footer-value">${cert.issuedDate}</div>
                </div>
                <div class="footer-item">
                  <div class="footer-label">Grade</div>
                  <div class="footer-value">${cert.grade}</div>
                </div>
                <div class="footer-item">
                  <div class="footer-label">Certificate ID</div>
                  <div class="footer-value">${cert.id}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="seal">✓</div>
        </div>
        <script>
          window.onload = () => { window.print(); }
        </script>
      </body>
      </html>
    `);
    certWindow.document.close();
  }
};

// ============================================
// CERTIFICATE TEMPLATES
// ============================================
const CERTIFICATE_TEMPLATES = [
  {
    id: 1,
    name: 'Classic Elegance',
    description: 'Traditional certificate with ornate borders',
    color: 'from-amber-50 via-orange-50 to-amber-100',
    borderColor: 'border-amber-600',
    accentColor: 'text-amber-700',
    hexColor: '#d97706',
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fde68a 100%)',
    borderStyle: 'double'
  },
  {
    id: 2,
    name: 'Modern Professional',
    description: 'Clean and contemporary design',
    color: 'from-slate-50 via-blue-50 to-cyan-50',
    borderColor: 'border-blue-600',
    accentColor: 'text-blue-700',
    hexColor: '#2563eb',
    gradient: 'linear-gradient(135deg, #e0f2fe 0%, #cffafe 50%, #ecf0f1 100%)',
    borderStyle: 'solid'
  },
  {
    id: 3,
    name: 'Agricultural Green',
    description: 'Nature-inspired green theme with leaf accents',
    color: 'from-green-50 via-emerald-50 to-green-100',
    borderColor: 'border-green-600',
    accentColor: 'text-green-700',
    hexColor: '#16a34a',
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 50%, #a7f3d0 100%)',
    borderStyle: 'solid'
  },
  {
    id: 4,
    name: 'Premium Gold',
    description: 'Luxurious gold with elegant accents',
    color: 'from-yellow-50 via-amber-50 to-yellow-100',
    borderColor: 'border-yellow-600',
    accentColor: 'text-yellow-700',
    hexColor: '#ca8a04',
    gradient: 'linear-gradient(135deg, #fefce8 0%, #fef08a 50%, #fcd34d 100%)',
    borderStyle: 'double'
  },
  {
    id: 5,
    name: 'Royal Purple',
    description: 'Distinguished purple with vibrant accents',
    color: 'from-purple-50 via-violet-50 to-purple-100',
    borderColor: 'border-purple-600',
    accentColor: 'text-purple-700',
    hexColor: '#9333ea',
    gradient: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 50%, #ddd6fe 100%)',
    borderStyle: 'solid'
  },
  {
    id: 6,
    name: 'Corporate Blue',
    description: 'Professional business style',
    color: 'from-indigo-50 via-blue-50 to-indigo-100',
    borderColor: 'border-indigo-600',
    accentColor: 'text-indigo-700',
    hexColor: '#4f46e5',
    gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)',
    borderStyle: 'solid'
  },
  {
    id: 7,
    name: 'Vibrant Coral',
    description: 'Energetic coral and pink theme',
    color: 'from-rose-50 via-pink-50 to-rose-100',
    borderColor: 'border-rose-600',
    accentColor: 'text-rose-700',
    hexColor: '#e11d48',
    gradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)',
    borderStyle: 'solid'
  },
  {
    id: 8,
    name: 'Ocean Blue',
    description: 'Deep ocean blue with cyan accents',
    color: 'from-cyan-50 via-sky-50 to-cyan-100',
    borderColor: 'border-cyan-600',
    accentColor: 'text-cyan-700',
    hexColor: '#0891b2',
    gradient: 'linear-gradient(135deg, #ecf8ff 0%, #cffafe 50%, #a5f3fc 100%)',
    borderStyle: 'solid'
  },
  {
    id: 9,
    name: 'Emerald Excellence',
    description: 'Vibrant emerald with gold accents',
    color: 'from-emerald-50 via-teal-50 to-emerald-100',
    borderColor: 'border-emerald-600',
    accentColor: 'text-emerald-700',
    hexColor: '#059669',
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #ccfbf1 50%, #99f6e4 100%)',
    borderStyle: 'double'
  },
  {
    id: 10,
    name: 'Sunset Gradient',
    description: 'Warm sunset gradient with orange and red',
    color: 'from-orange-50 via-red-50 to-orange-100',
    borderColor: 'border-orange-600',
    accentColor: 'text-orange-700',
    hexColor: '#ea580c',
    gradient: 'linear-gradient(135deg, #fff7ed 0%, #fee2e2 50%, #fed7aa 100%)',
    borderStyle: 'solid'
  }
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function CertificatesPage() {
  const router = useRouter();

  // STATE
  const [trainerData, setTrainerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState([]);
  const [batchTrainees, setBatchTrainees] = useState([]);
  const [selectedBatchForCert, setSelectedBatchForCert] = useState('');
  const [showIssueCertificate, setShowIssueCertificate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [issuedCertificates, setIssuedCertificates] = useState([]);
  
  // Font Settings
  const [fontSettings, setFontSettings] = useState({
    fontSize: 'medium', // small, medium, large
    fontStyle: 'elegant' // elegant, modern, classic
  });
  
  // Branding details
  const [brandingDetails, setBrandingDetails] = useState({
    companyName: '',
    instituteName: '',
    logoUrl: null
  });

  const [certificateForm, setCertificateForm] = useState({
    traineeEmail: '',
    traineeName: '',
    course: '',
    completionDate: '',
    grade: ''
  });

  // EFFECTS
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          router.push('/login');
          return;
        }
        const user = JSON.parse(userData);
        const res = await fetch('/api/trainer/profile', {
          method: 'GET',
          headers: { 'x-user-email': user.email }
        });
        const data = await res.json();
        if (res.ok) setTrainerData(data);
        else router.push('/login');
      } catch (error) {
        console.error('Error fetching trainer data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchTrainerData();
  }, [router]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await fetch(`/api/batches/list?trainerEmail=${trainerData.email}`);
        if (res.ok) {
          const batches = await res.json();
          setMyCourses(batches);
        }
      } catch (err) {
        console.error('Error fetching courses', err);
      }
    };
    if (trainerData?.email) fetchMyCourses();
  }, [trainerData]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          `/api/certificates/list?issuedBy=${trainerData.email}&userRole=trainer`
        );
        if (response.ok) {
          const certificates = await response.json();
          setIssuedCertificates(certificates);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };
    if (trainerData) fetchCertificates();
  }, [trainerData]);

  useEffect(() => {
    const fetchBatchTrainees = async () => {
      if (!selectedBatchForCert) {
        setBatchTrainees([]);
        return;
      }
      try {
        const res = await fetch(`/api/batches/students?batchId=${selectedBatchForCert}`);
        if (res.ok) {
          const data = await res.json();
          setBatchTrainees(data || []);
        } else {
          setBatchTrainees([]);
        }
      } catch (err) {
        console.error('Error fetching trainees', err);
        setBatchTrainees([]);
      }
    };
    fetchBatchTrainees();
  }, [selectedBatchForCert]);

  // HANDLERS
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBrandingDetails({
          ...brandingDetails,
          logoUrl: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setBrandingDetails({
      ...brandingDetails,
      logoUrl: null
    });
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setShowIssueCertificate(true);
  };

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traineeName: certificateForm.traineeName,
          traineeEmail: certificateForm.traineeEmail,
          course: certificateForm.course,
          templateId: selectedTemplate.id,
          grade: certificateForm.grade,
          completionDate: certificateForm.completionDate,
          issuedBy: trainerData.email,
          branding: brandingDetails
        })
      });

      if (response.ok) {
        const savedCertificate = await response.json();
        setIssuedCertificates([
          ...issuedCertificates,
          {
            id: savedCertificate.certificateId,
            traineeName: savedCertificate.traineeName,
            course: savedCertificate.course,
            template: savedCertificate.templateId,
            issuedDate: certificateHelpers.formatDate(savedCertificate.completionDate),
            grade: savedCertificate.grade,
            status: savedCertificate.status,
            branding: brandingDetails
          }
        ]);
        handleCancelCertificate();
        alert('Certificate issued successfully!');
      } else {
        alert('Failed to issue certificate. Please try again.');
      }
    } catch (error) {
      console.error('Error issuing certificate:', error);
      alert('Error issuing certificate. Please try again.');
    }
  };

  const handleCancelCertificate = () => {
    setShowIssueCertificate(false);
    setSelectedTemplate(null);
    setSelectedBatchForCert('');
    setBatchTrainees([]);
    setCertificateForm({
      traineeEmail: '',
      traineeName: '',
      course: '',
      completionDate: '',
      grade: ''
    });
  };

  const handleViewCertificate = (cert) => {
    const template = CERTIFICATE_TEMPLATES.find(t => t.id === cert.template);
    certificateHelpers.downloadCertificate(cert, template, cert.branding || brandingDetails, fontSettings);
  };

  const handleDeleteCertificate = async (certId) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      const response = await fetch(`/api/certificates/${certId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setIssuedCertificates(issuedCertificates.filter(cert => cert.id !== certId));
        alert('Certificate deleted successfully!');
      } else {
        alert('Failed to delete certificate');
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('Error deleting certificate');
    }
  };

  if (!trainerData) return null;

  return (
      <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{
        backgroundImage: "url('/images/rice-field.png')",
      }}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto border border-white border-opacity-10 rounded-2xl p-6">
          <div className="mb-6">
          <button 
            onClick={() => router.push('/trainer/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate Management</h2>
          <p className="text-gray-600">Select a template and issue certificates to trainees</p>
        </div>

        {/* Branding Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Certificate Branding</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Company Name</label>
              <input
                type="text"
                value={brandingDetails.companyName}
                onChange={(e) => setBrandingDetails({ ...brandingDetails, companyName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your company name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Institute Name</label>
              <input
                type="text"
                value={brandingDetails.instituteName}
                onChange={(e) => setBrandingDetails({ ...brandingDetails, instituteName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your institute name"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-3">Company Logo</label>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Click to upload logo (PNG, JPG)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {brandingDetails.logoUrl && (
                <div className="relative flex-shrink-0">
                  <img
                    src={brandingDetails.logoUrl}
                    alt="Company Logo"
                    className="w-24 h-24 object-contain bg-gray-100 rounded p-2 border border-gray-300"
                  />
                  <button
                    onClick={handleRemoveLogo}
                    className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Issue Certificate Form */}
        {showIssueCertificate && selectedTemplate && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-amber-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Issue Certificate - {selectedTemplate.name}
            </h3>
            <form onSubmit={handleIssueCertificate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Select Batch *</label>
                  <select
                    required
                    value={selectedBatchForCert}
                    onChange={(e) => {
                      setSelectedBatchForCert(e.target.value);
                      const batch = myCourses.find(b => String(b.id) === e.target.value);
                      if (batch) {
                        setCertificateForm({
                          ...certificateForm,
                          course: batch.courseName || '',
                          traineeEmail: '',
                          traineeName: ''
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select batch</option>
                    {myCourses?.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.batchCode} - {batch.courseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Course *</label>
                  <input
                    type="text"
                    required
                    value={certificateForm.course}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    placeholder="Course will auto-fill from batch"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Select Trainee *</label>
                  <select
                    required
                    value={certificateForm.traineeEmail}
                    onChange={(e) => {
                      const trainee = batchTrainees.find(
                        t => (t.studentEmail || t.email) === e.target.value
                      );
                      if (trainee) {
                        setCertificateForm({
                          ...certificateForm,
                          traineeEmail: e.target.value,
                          traineeName: trainee.firstName
                            ? `${trainee.firstName} ${trainee.lastName || ''}`.trim()
                            : e.target.value
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    disabled={!selectedBatchForCert}
                  >
                    <option value="">Select trainee</option>
                    {batchTrainees.map((trainee) => (
                      <option key={trainee.studentEmail || trainee.email} value={trainee.studentEmail || trainee.email}>
                        {trainee.firstName
                          ? `${trainee.firstName} ${trainee.lastName || ''}`.trim()
                          : trainee.studentEmail || trainee.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Trainee Name *</label>
                  <input
                    type="text"
                    required
                    value={certificateForm.traineeName}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    placeholder="Name will auto-fill"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Completion Date *</label>
                  <input
                    type="date"
                    required
                    value={certificateForm.completionDate}
                    onChange={(e) =>
                      setCertificateForm({ ...certificateForm, completionDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Grade *</label>
                  <input
                    type="text"
                    required
                    value={certificateForm.grade}
                    onChange={(e) =>
                      setCertificateForm({ ...certificateForm, grade: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., A, B+, 85%"
                  />
                </div>
              </div>

              {/* Font Settings */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Certificate Appearance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Font Size</label>
                    <select
                      value={fontSettings.fontSize}
                      onChange={(e) => setFontSettings({ ...fontSettings, fontSize: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="small">Small (Compact)</option>
                      <option value="medium">Medium (Standard)</option>
                      <option value="large">Large (Spacious)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Select font size to fit content on one page</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Font Style</label>
                    <select
                      value={fontSettings.fontStyle}
                      onChange={(e) => setFontSettings({ ...fontSettings, fontStyle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="elegant">Elegant (Serif)</option>
                      <option value="modern">Modern (Sans-serif)</option>
                      <option value="classic">Classic (Traditional)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Choose typography style</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Certificate Preview (Landscape A4)</h4>
                <div
                  className={`bg-gradient-to-br ${selectedTemplate.color} border-4 ${selectedTemplate.borderColor} rounded-lg shadow-xl relative overflow-hidden`}
                  style={{ aspectRatio: '297/210', width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px' }}
                >
                  {/* Decorative background elements */}
                  <div className="absolute top-0 left-0 opacity-5 text-4xl">✨</div>
                  <div className="absolute bottom-0 right-0 opacity-5 text-4xl">✨</div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between text-center text-xs">
                    {(brandingDetails.companyName || brandingDetails.instituteName || brandingDetails.logoUrl) && (
                      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-300">
                        <div className="flex items-center gap-2">
                          {brandingDetails.logoUrl && (
                            <img
                              src={brandingDetails.logoUrl}
                              alt="Logo"
                              className="w-12 h-12 object-contain"
                            />
                          )}
                          <div>
                            {brandingDetails.companyName && (
                              <p className={`font-bold text-sm ${selectedTemplate.accentColor}`}>
                                {brandingDetails.companyName}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {brandingDetails.instituteName && (
                            <p className="text-xs text-gray-600">
                              {brandingDetails.instituteName}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-xl mb-1">🏆</div>
                      <h2 className={`text-xs font-black ${selectedTemplate.accentColor} mb-1`}>
                        Certificate of Completion
                      </h2>
                      <div className={`h-px w-8 mx-auto rounded-full mb-2`} style={{ background: selectedTemplate.hexColor }}></div>
                      
                      <p className="text-gray-700 text-xs mb-1">This is to certify that</p>
                      <h3 className={`text-xs font-black ${selectedTemplate.accentColor} mb-1 uppercase`}>
                        {certificateForm.traineeName || '[Name]'}
                      </h3>
                      <p className="text-gray-700 mb-1 text-xs">has successfully completed</p>
                      <h4 className={`text-xs font-bold ${selectedTemplate.accentColor} mb-2`}>
                        {certificateForm.course || '[Course]'}
                      </h4>
                      
                      <div className="flex justify-around items-center text-xs text-gray-700 mb-2 pt-1 border-t border-gray-400">
                        <div>
                          <p className={`font-bold ${selectedTemplate.accentColor} text-xs`}>Date</p>
                          <p className="text-xs mt-1">{certificateForm.completionDate || '[Date]'}</p>
                        </div>
                        <div>
                          <p className={`font-bold ${selectedTemplate.accentColor} text-xs`}>Grade</p>
                          <p className="text-xs mt-1">{certificateForm.grade || '[Grade]'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border border-2 text-xs font-bold ${selectedTemplate.accentColor}`} style={{ borderColor: selectedTemplate.hexColor, marginLeft: 'auto' }}>
                      ✓
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCancelCertificate}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Issue Certificate
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Template Selection */}
        {!showIssueCertificate && (
          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose a Certificate Template</h3>
              <p className="text-gray-600 mb-6">Select from 10 professionally designed templates with vibrant colors</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {CERTIFICATE_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden group"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <div className={`bg-gradient-to-br ${template.color} border-4 ${template.borderColor} p-6 h-56 flex flex-col items-center justify-center relative overflow-hidden`}>
                      {/* Decorative elements */}
                      <div className="absolute top-2 left-2 text-2xl opacity-20">✨</div>
                      <div className="absolute bottom-2 right-2 text-2xl opacity-20">✨</div>
                      
                      <div className="relative z-10 text-center">
                        <div className="text-5xl mb-3 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">🏆</div>
                        <h4 className={`text-base font-bold ${template.accentColor} text-center leading-tight mb-2`}>
                          {template.name}
                        </h4>
                        <div className={`h-0.5 w-12 mx-auto rounded-full mb-2`} style={{ background: template.hexColor }}></div>
                        <p className="text-xs text-gray-600 text-center">{template.description}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                      <button className={`w-full px-3 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-300 transform hover:shadow-lg`} style={{ background: template.hexColor }}>
                        Use Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issued Certificates Table */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Issued Certificates</h3>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {issuedCertificates.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Certificate ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Trainee Name
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Course
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Template
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                            Grade
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                            Date
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {issuedCertificates.map((cert) => {
                          const template = CERTIFICATE_TEMPLATES.find(t => t.id === cert.template);
                          return (
                            <tr key={cert.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                {cert.id}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800">
                                {cert.traineeName}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {cert.course}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-700">
                                  {template?.name}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-semibold text-gray-800">
                                {cert.grade}
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-gray-600">
                                {cert.issuedDate}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => handleViewCertificate(cert)}
                                    className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center gap-1"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View
                                  </button>
                                  <button
                                    onClick={() => certificateHelpers.downloadCertificate(cert, template, cert.branding || brandingDetails, fontSettings)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCertificate(cert.id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No certificates issued yet</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
  );
}