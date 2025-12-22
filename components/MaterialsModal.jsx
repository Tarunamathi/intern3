'use client';
import { useEffect, useState } from 'react';
import { X, Upload, FileText, Download, Image as ImageIcon, Film, FileMusic, Code, File, Archive } from 'lucide-react';

export default function MaterialsModal({ isOpen, onClose, batchId, courseId, trainerEmail }) {
  const [materials, setMaterials] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchMaterials();
  }, [isOpen]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      
      // Fetch trainee-uploaded materials
      let docsUrl = '/api/trainee-documents/list?';
      if (courseId) docsUrl += `courseId=${courseId}&`;
      if (batchId) docsUrl += `batchId=${batchId}&`;
      
      const docsRes = await fetch(docsUrl, { headers: { 'x-user-email': trainerEmail || '' } });
      let docs = [];
      if (docsRes.ok) {
        const ct = docsRes.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          docs = await docsRes.json();
        }
      }

      // Fetch course-created materials
      let courseMats = [];
      if (batchId) {
        try {
          const courseRes = await fetch(`/api/courses/list?batchId=${batchId}`);
          if (courseRes.ok) {
            const cData = await courseRes.json();
            const course = Array.isArray(cData.courses) && cData.courses.length ? cData.courses[0] : null;
            
            if (course && Array.isArray(course.materials)) {
              courseMats = course.materials.map((m, idx) => {
                let title = 'Untitled';
                let fileUrl = null;
                let mimeType = null;
                
                // Handle different material formats
                if (typeof m === 'string') {
                  try {
                    // Try parsing as JSON first (module format)
                    const parsed = JSON.parse(m);
                    if (parsed && parsed.fileUrl) {
                      title = parsed.title || parsed.fileUrl.split('/').pop();
                      fileUrl = parsed.fileUrl;
                      mimeType = getMimeTypeFromUrl(parsed.fileUrl);
                    } else if (parsed && parsed.title) {
                      // Module without file
                      title = parsed.title;
                      fileUrl = null;
                    }
                  } catch (e) {
                    // Not JSON, treat as direct file path
                    fileUrl = m;
                    title = m.split('/').pop().split('?')[0]; // Remove query params
                    mimeType = getMimeTypeFromUrl(m);
                  }
                } else if (m && typeof m === 'object') {
                  fileUrl = m.fileUrl;
                  title = m.title || m.fileUrl?.split('/').pop() || 'Untitled';
                  mimeType = m.mimeType || getMimeTypeFromUrl(m.fileUrl);
                }

                // Only return if we have a valid file URL
                if (fileUrl) {
                  // Normalize the file URL
                  const fileName = fileUrl.split('/').pop().split('?')[0];
                  const normalizedUrl = `/uploads/courses/${fileName}`;
                  
                  return { 
                    id: `course-${idx}`, 
                    title: decodeURIComponent(title), 
                    fileUrl: normalizedUrl, 
                    mimeType, 
                    source: 'course',
                    createdAt: course.createdAt
                  };
                }
                return null;
              }).filter(Boolean);
            }
          }
        } catch (e) {
          console.error('Failed to fetch course materials', e);
        }
      }

      // Merge materials, avoiding duplicates
      const combined = [];
      const seen = new Set();
      
      // Add course materials first
      for (const m of courseMats) {
        const key = `${m.fileUrl}::${m.title}`;
        if (!seen.has(key)) { 
          seen.add(key); 
          combined.push(m); 
        }
      }
      
      // Add uploaded materials
      for (const m of docs) {
        const key = `${m.fileUrl}::${m.title}`;
        if (!seen.has(key)) { 
          seen.add(key); 
          combined.push({ 
            id: m.id, 
            title: m.title, 
            fileUrl: m.fileUrl, 
            mimeType: m.mimeType, 
            createdAt: m.createdAt, 
            source: 'upload' 
          }); 
        }
      }

      setMaterials(combined);
    } catch (err) {
      console.error('Error fetching materials', err);
    } finally {
      setLoading(false);
    }
  };

  const getMimeTypeFromUrl = (url) => {
    if (!url) return 'application/octet-stream';
    const ext = url.toLowerCase().split('.').pop().split('?')[0];
    const mimeMap = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'mp4': 'video/mp4',
      'mp3': 'audio/mpeg',
      'txt': 'text/plain',
      'csv': 'text/csv',
      'json': 'application/json',
      'zip': 'application/zip',
    };
    return mimeMap[ext] || 'application/octet-stream';
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setSelectedFile(f);
      setTitle(f.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', 'courses');

      // Upload the file
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) {
        throw new Error('File upload failed');
      }

      const uploadData = await uploadRes.json();
      const fileUrl = uploadData.url || `/uploads/courses/${uploadData.fileName}`;

      // Save to database
      const payload = {
        title,
        fileUrl,
        batchId: batchId || null,
        courseId: courseId || null,
        mimeType: selectedFile.type,
        uploadedBy: trainerEmail || ''
      };

      const res = await fetch('/api/trainee-documents/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'x-user-email': trainerEmail || '' 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchMaterials();
        setSelectedFile(null);
        setTitle('');
      } else {
        const txt = await res.text();
        alert('Upload failed: ' + txt);
      }
    } catch (err) {
      console.error('Error uploading', err);
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // File viewer state
  const [viewFileUrl, setViewFileUrl] = useState(null);
  const [viewMime, setViewMime] = useState(null);
  const [viewerType, setViewerType] = useState(null);

  const getFileType = (fileUrl, mimeType) => {
    const url = fileUrl?.toLowerCase() || '';
    const mime = (mimeType || '').toLowerCase();

    if (mime.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/.test(url)) {
      return 'image';
    }
    if (mime === 'application/pdf' || url.endsWith('.pdf')) {
      return 'pdf';
    }
    if (mime.includes('document') || /\.(doc|docx|xls|xlsx|ppt|pptx)$/.test(url)) {
      return 'document';
    }
    if (mime.startsWith('video/') || /\.(mp4|webm|ogg|mov|avi|wmv)$/.test(url)) {
      return 'video';
    }
    if (mime.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac)$/.test(url)) {
      return 'audio';
    }
    if (mime.startsWith('text/') || /\.(txt|js|jsx|ts|tsx|html|css|json|md|csv)$/.test(url)) {
      return 'text';
    }
    if (/\.(zip|rar|7z|tar|gz)$/.test(url)) {
      return 'archive';
    }
    return 'other';
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'pdf': 
      case 'document': return <FileText className="w-4 h-4" />;
      case 'video': return <Film className="w-4 h-4" />;
      case 'audio': return <FileMusic className="w-4 h-4" />;
      case 'text': return <Code className="w-4 h-4" />;
      case 'archive': return <Archive className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const handleView = (fileUrl, mimeType) => {
    const type = getFileType(fileUrl, mimeType);
    setViewFileUrl(fileUrl);
    setViewMime(mimeType || 'application/octet-stream');
    setViewerType(type);
  };

  const handleDownload = (fileUrl, title) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = title || fileUrl.split('/').pop();
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-bold">Course Materials</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Upload Section */}
        <div className="p-4 border-b flex-shrink-0">
          <h4 className="font-medium mb-2">Upload New Material</h4>
          <div className="space-y-2">
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Material title" 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <input 
              type="file" 
              onChange={onFileChange} 
              className="w-full text-sm"
              accept="*/*"
            />
            <div className="flex gap-2">
              <button 
                onClick={handleUpload} 
                disabled={uploading || !selectedFile || !title} 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button 
                onClick={() => { setSelectedFile(null); setTitle(''); }} 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Materials List */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h4 className="font-medium mb-3">Available Materials ({materials.length})</h4>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading materials...</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No materials available yet.</p>
              <p className="text-sm mt-1">Upload materials using the form above.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {materials.map(m => {
                const fileType = getFileType(m.fileUrl, m.mimeType);
                return (
                  <li key={m.id} className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {getFileIcon(fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{m.title}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="capitalize px-2 py-0.5 rounded bg-gray-100">{fileType}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          {m.source === 'course' ? 'Course Material' : 'Uploaded'}
                        </span>
                        {m.createdAt && (
                          <span>• {new Date(m.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {m.fileUrl.split('/').pop()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={() => handleView(m.fileUrl, m.mimeType)} 
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm flex items-center gap-1.5"
                        title="View file"
                      >
                        <FileText className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(m.fileUrl, m.title)}
                        className="px-3 py-1.5 bg-green-50 text-green-700 rounded hover:bg-green-100 text-sm flex items-center gap-1.5"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>

      {/* File Viewer Overlay */}
      {viewFileUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4" style={{ zIndex: 60 }}>
          <div className="bg-white w-full max-w-6xl max-h-[95vh] flex flex-col rounded-lg overflow-hidden">
            {/* Viewer Header */}
            <div className="p-3 border-b flex items-center justify-between bg-gray-50 flex-shrink-0">
              <div className="font-medium text-gray-900 truncate flex-1">
                {viewFileUrl.split('/').pop()}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a 
                  href={viewFileUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                >
                  Open in new tab
                </a>
                <button 
                  onClick={() => { setViewFileUrl(null); setViewMime(null); setViewerType(null); }} 
                  className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Viewer Content */}
            <div className="flex-1 overflow-auto bg-gray-100">
              {(() => {
                switch (viewerType) {
                  case 'image':
                    return (
                      <div className="flex items-center justify-center h-full p-4">
                        <img 
                          src={viewFileUrl} 
                          alt="Preview"
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image not found</text></svg>';
                          }}
                        />
                      </div>
                    );

                  case 'pdf':
                    return (
                      <iframe
                        src={viewFileUrl}
                        className="w-full h-full border-0"
                        title="PDF preview"
                      />
                    );

                  case 'video':
                    return (
                      <div className="flex items-center justify-center h-full p-4">
                        <video 
                          controls 
                          className="max-w-full max-h-full"
                          src={viewFileUrl}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    );

                  case 'audio':
                    return (
                      <div className="flex items-center justify-center h-full p-8">
                        <div className="w-full max-w-2xl">
                          <audio 
                            controls 
                            className="w-full"
                            src={viewFileUrl}
                          >
                            Your browser does not support the audio tag.
                          </audio>
                        </div>
                      </div>
                    );

                  case 'text':
                    return (
                      <iframe
                        src={viewFileUrl}
                        className="w-full h-full border-0 bg-white"
                        title="Text preview"
                      />
                    );

                  case 'document':
                    return (
                      <div className="flex items-center justify-center h-full p-8">
                        <div className="text-center">
                          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-700 mb-4">Document preview not available</p>
                          <div className="flex justify-center gap-4">
                            <a 
                              href={viewFileUrl} 
                              download 
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </a>
                            <a 
                              href={viewFileUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Open in new tab
                            </a>
                          </div>
                        </div>
                      </div>
                    );

                  default:
                    return (
                      <div className="flex items-center justify-center h-full p-8">
                        <div className="text-center">
                          <File className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-700 mb-4">Preview not available for this file type</p>
                          <div className="flex justify-center gap-4">
                            <a 
                              href={viewFileUrl} 
                              download 
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </a>
                            <a 
                              href={viewFileUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Open in new tab
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}