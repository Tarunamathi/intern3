// Helper functions for file handling
export const processFileUrl = (fileUrl) => {
  if (!fileUrl) return '';
  
  let processedUrl = fileUrl;
  
  // Handle legacy admin paths
  if (processedUrl.startsWith('/admin/')) {
    processedUrl = processedUrl.split('/').pop();
  }

  // If it starts with /uploads/, extract the path after it
  if (processedUrl.startsWith('/uploads/')) {
    processedUrl = processedUrl.replace('/uploads/', '');
  }
  
  // Clean up any double slashes (except after protocol)
  processedUrl = processedUrl.replace(/([^:]\/)\/+/g, '$1');
  
  // Ensure proper encoding of the filename parts
  const urlParts = processedUrl.split('/');
  const encodedParts = urlParts.map(part => encodeURIComponent(decodeURIComponent(part)));
  processedUrl = encodedParts.join('/');
  
  // Return the API endpoint URL
  return `/api/files/${processedUrl}`;
};

export const downloadFile = async (fileUrl, suggestedName) => {
  try {
    const processedUrl = processFileUrl(fileUrl);
    
    // Fetch the file from our API
    const response = await fetch(processedUrl);
    if (!response.ok) throw new Error('File not found');
    
    // Get the filename from either the content-disposition header or our suggestedName
    const contentDisposition = response.headers.get('content-disposition');
    let fileName = suggestedName;
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        fileName = matches[1].replace(/['"]/g, '');
      }
    }
    if (!fileName) {
      fileName = fileUrl.split('/').pop();
    }

    // Create a blob from the response
    const blob = await response.blob();
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link and click it
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    alert('Failed to download file. Please try again.');
  }
};

export const viewFile = async (fileUrl) => {
  try {
    const processedUrl = processFileUrl(fileUrl);
    
    // For PDFs and images, we can open directly in a new tab
    if (fileUrl.toLowerCase().endsWith('.pdf') || 
        fileUrl.toLowerCase().match(/\.(jpe?g|png|gif)$/i)) {
      window.open(processedUrl, '_blank');
      return;
    }
    
    // For other files, fetch and create a blob URL
    const response = await fetch(processedUrl);
    if (!response.ok) throw new Error('File not found');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    // Open the blob URL in a new tab
    window.open(url, '_blank');
    
    // Clean up the blob URL after the window is loaded
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    console.error('View failed:', error);
    alert('Failed to view file. Please try again.');
  }
};