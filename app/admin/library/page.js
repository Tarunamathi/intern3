"use client";
import { useState, useEffect, useMemo } from "react";

export default function AdminLibraryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newResource, setNewResource] = useState({ title: "", category: "", status: "Active", resourceType: "file", link: "" });
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerData, setViewerData] = useState(null);

  // Dynamic features state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/library');
      const json = await res.json();
      // normalize uploadDate to readable string
      const normalized = json.map(r => ({
        ...r,
        uploadDate: r.uploadDate ? new Date(r.uploadDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''
      }));
      setData(normalized);
    } catch (e) {
      console.error('Failed to fetch resources', e);
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const cats = [...new Set(data.map(item => item.category).filter(Boolean))];
    return ["All", ...cats.sort()];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === "All" || item.category === filterCategory;
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [data, searchQuery, filterCategory, filterStatus]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;

  const handleSort = (key) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  function openEdit(resource) {
    setEditRow(resource);
    setModalOpen(true);
  }

  async function saveEdit() {
    if (!editRow) return;
    try {
      const res = await fetch(`/api/admin/library/${editRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editRow),
      });
      if (!res.ok) throw new Error('Failed to update');
      await fetchResources();
      setModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Failed to update resource');
    }
  }

  async function deleteResource(id) {
    if (!confirm('Delete this resource?')) return;
    try {
      const res = await fetch(`/api/admin/library/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete failed');
      setData(d => d.filter(x => x.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete resource');
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!newResource.title) setNewResource(n => ({ ...n, title: file.name.replace(/\.[^/.]+$/, '') }));
    }
  };

  async function handleUpload() {
    if (!newResource.title || !newResource.category) {
      alert('Please fill title and category');
      return;
    }

    if (newResource.resourceType === 'link' && !newResource.link) {
      alert('Please enter a valid link URL');
      return;
    }

    if (newResource.resourceType === 'file' && !selectedFile) {
      alert('Please select a file');
      return;
    }

    try {
      let fileUrl = null;
      let fileName = null;

      if (newResource.resourceType === 'file' && selectedFile) {
        const fd = new FormData();
        fd.append('file', selectedFile);
        const uploadRes = await fetch('/api/admin/library/upload', { method: 'POST', body: fd });
        if (!uploadRes.ok) throw new Error('upload failed');
        const uploadJson = await uploadRes.json();
        fileUrl = uploadJson.fileUrl;
        fileName = uploadJson.fileName;
      } else if (newResource.resourceType === 'link') {
        fileUrl = newResource.link;
        fileName = new URL(newResource.link).hostname;
      }

      const createRes = await fetch('/api/admin/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newResource.title,
          category: newResource.category,
          status: newResource.status,
          resourceType: newResource.resourceType,
          link: newResource.resourceType === 'link' ? newResource.link : null,
          fileName: fileName || newResource.fileName || '',
          fileUrl,
        }),
      });

      if (!createRes.ok) throw new Error('create failed');
      await fetchResources();
      setSelectedFile(null);
      setNewResource({ title: '', category: '', status: 'Active', resourceType: 'file', link: '' });
      setUploadModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Upload failed');
    }
  }

  function handleDownload(row) {
    if (row.fileUrl) {
      const a = document.createElement('a');
      a.href = row.fileUrl;
      a.download = row.fileName || '';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert('No file available for this resource');
    }
  }

  function handleView(row) {
    setViewerData(row);
    setViewerOpen(true);
  }

  function canView(row) {
    if (!row.fileUrl && !row.link) return false;
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const docExts = ['.pdf', '.txt'];
    const ext = (row.fileName || row.fileUrl || '').toLowerCase();
    return imageExts.some(e => ext.includes(e)) || docExts.some(e => ext.includes(e)) || row.resourceType === 'link';
  }

  function getResourceIcon(row) {
    if (row.resourceType === 'link') return '🔗';
    const ext = (row.fileName || row.fileUrl || '').toLowerCase();
    if (ext.includes('.pdf')) return '📄';
    if (ext.includes('.doc') || ext.includes('.docx')) return '📝';
    if (ext.includes('.jpg') || ext.includes('.jpeg') || ext.includes('.png') || ext.includes('.gif') || ext.includes('.webp')) return '🖼️';
    return '📦';
  }

  function resetFilters() {
    setSearchQuery('');
    setFilterCategory('All');
    setFilterStatus('All');
    setSortConfig({ key: null, direction: 'asc' });
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 font-sans">
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-10 shadow-lg flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">📚 Admin Library Management</h1>
      </div>

      <div className="w-full px-8 py-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search by title, file name, or category..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
            </select>

            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Archived">Archived</option>
            </select>

            <button onClick={resetFilters} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">Reset</button>
          </div>
        </div>

        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <span>Total: <strong>{data.length}</strong></span>
          <span>Showing: <strong>{sortedData.length}</strong></span>
          <span>Active: <strong>{data.filter(d => d.status === 'Active').length}</strong></span>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center px-8 py-6">
        <div className="w-full">
          <table className="w-full text-base text-black border-separate border-spacing-y-2">
            <thead>
              <tr className="font-semibold text-center border-b-2 border-gray-300">
                <th className="py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('title')}>Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th className="py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('category')}>Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th className="py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('uploadDate')}>Upload Date {sortConfig.key === 'uploadDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th className="py-3">File Name</th>
                <th className="py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : (paginatedData.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No resources found.</td></tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr key={row.id} className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-center hover:shadow-md transition-shadow">
                    <td className="py-3 font-semibold text-blue-700">{row.title}</td>
                    <td className="py-3">{row.category}</td>
                    <td className="py-3 text-gray-600">{row.uploadDate}</td>
                    <td className="py-3 text-sm text-gray-500">{row.fileName}</td>
                    <td className="py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.status === 'Active' ? 'bg-green-100 text-green-700' : row.status === 'Inactive' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'}`}>{row.status}</span></td>
                    <td className="py-3 flex justify-center gap-2">
                      <button onClick={() => handleDownload(row)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-200">Download</button>
                      {canView(row) && (
                        <button onClick={() => handleView(row)} className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-200">View</button>
                      )}
                      <button onClick={() => openEdit(row)} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-md text-sm font-semibold hover:bg-amber-200">Edit</button>
                      <button onClick={() => deleteResource(row.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-200">Delete</button>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Items per page:</span>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed">Previous</button>
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button onClick={() => setUploadModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg font-semibold transition-colors">+ Upload Resource</button>
          </div>
        </div>
      </div>

      {modalOpen && editRow && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-40">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-blue-700 text-center">Edit Resource</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Title</label>
                <input type="text" value={editRow.title} onChange={(e) => setEditRow({...editRow, title: e.target.value})} className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Category</label>
                <input type="text" value={editRow.category} onChange={(e) => setEditRow({...editRow, category: e.target.value})} className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Status</label>
                <select value={editRow.status} onChange={(e) => setEditRow({...editRow, status: e.target.value})} className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Archived">Archived</option></select>
              </div>
              {editRow.resourceType === 'link' && (
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Link</label>
                  <input type="url" value={editRow.link || ''} onChange={(e) => setEditRow({...editRow, link: e.target.value})} placeholder="https://example.com" className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setModalOpen(false)} className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">Cancel</button>
              <button onClick={saveEdit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-40">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-blue-700 text-center">Upload New Resource</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Resource Type</label>
                <select value={newResource.resourceType} onChange={(e) => { setNewResource({...newResource, resourceType: e.target.value, link: ''}); setSelectedFile(null); }} className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="file">File (PDF, Doc, Image)</option>
                  <option value="link">External Link</option>
                </select>
              </div>

              {newResource.resourceType === 'file' ? (
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Select File</label>
                  <input type="file" onChange={handleFileSelect} accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp" className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {selectedFile && (<p className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</p>)}
                </div>
              ) : (
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Link URL</label>
                  <input type="url" value={newResource.link} onChange={(e) => setNewResource({...newResource, link: e.target.value})} placeholder="https://example.com/resource" className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-1 font-medium">Title</label>
                <input type="text" value={newResource.title} onChange={(e) => setNewResource({...newResource, title: e.target.value})} placeholder="Resource title" className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Category</label>
                <input type="text" value={newResource.category} onChange={(e) => setNewResource({...newResource, category: e.target.value})} placeholder="e.g., Programming, Database, Images" className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Status</label>
                <select value={newResource.status} onChange={(e) => setNewResource({...newResource, status: e.target.value})} className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="Active">Active</option><option value="Inactive">Inactive</option></select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => { setUploadModalOpen(false); setSelectedFile(null); setNewResource({ title: '', category: '', status: 'Active', resourceType: 'file', link: '' }); }} className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">Cancel</button>
              <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Upload</button>
            </div>
          </div>
        </div>
      )}

      {viewerOpen && viewerData && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
              <h2 className="text-xl font-bold text-white">{viewerData.title}</h2>
              <button onClick={() => setViewerOpen(false)} className="text-white hover:bg-blue-800 p-2 rounded-full text-2xl">×</button>
            </div>
            <div className="flex-1 overflow-auto">
              {viewerData.resourceType === 'link' ? (
                <div className="p-6 flex flex-col items-center justify-center min-h-96">
                  <div className="text-6xl mb-4">🔗</div>
                  <p className="text-gray-600 mb-4 text-center">External Link</p>
                  <a
                    href={viewerData.fileUrl || viewerData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Open Link in New Tab
                  </a>
                  <p className="text-xs text-gray-500 mt-4 max-w-lg break-all text-center">{viewerData.fileUrl || viewerData.link}</p>
                </div>
              ) : (
                (() => {
                  const ext = (viewerData.fileName || viewerData.fileUrl || '').toLowerCase();
                  const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(e => ext.includes(e));
                  const isPdf = ext.includes('.pdf');

                  if (isImage) {
                    return (
                      <div className="p-6 flex items-center justify-center min-h-96">
                        <img src={viewerData.fileUrl} alt={viewerData.title} className="max-w-full max-h-96 rounded-lg shadow-lg" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22sans-serif%22 font-size=%2216%22 fill=%22%23999%22%3EImage Failed to Load%3C/text%3E%3C/svg%3E'; }} />
                      </div>
                    );
                  } else if (isPdf) {
                    return (
                      <div className="p-6 bg-gray-100 min-h-96 flex items-center justify-center">
                        <iframe
                          src={`${viewerData.fileUrl}#toolbar=1`}
                          className="w-full h-[600px] rounded-lg border-2 border-gray-300"
                          title={viewerData.title}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="p-6 flex flex-col items-center justify-center min-h-96">
                        <div className="text-6xl mb-4">📄</div>
                        <p className="text-gray-600 mb-4">Document Preview</p>
                        <a
                          href={viewerData.fileUrl}
                          download={viewerData.fileName}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                          Download Document
                        </a>
                        <p className="text-xs text-gray-500 mt-4">{viewerData.fileName}</p>
                      </div>
                    );
                  }
                })()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
