
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  console.log('Making API call to:', `${API_BASE_URL}${endpoint}`);
  console.log('Token present:', token ? 'Yes' : 'No');
  console.log('Token value (first 50 chars):', token ? token.substring(0, 50) + '...' : 'No token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Only add Authorization header if token exists and is not empty
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  }

  console.log('Request headers:', headers);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error: ${response.status} - ${errorText}`);
    
    // If 401 error, clear invalid token
    if (response.status === 401) {
      console.log('401 error - clearing potentially invalid token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const uploadFile = async (file: File) => {
  const token = localStorage.getItem('auth_token');
  
  console.log('=== PDF UPLOAD START ===');
  console.log('Uploading file:', file.name);
  console.log('File size:', file.size, 'bytes');
  console.log('File type:', file.type);
  console.log('Token present for upload:', token ? 'Yes' : 'No');
  console.log('Token value (first 50 chars):', token ? token.substring(0, 50) + '...' : 'No token');

  if (!token || token.trim() === '') {
    console.error('No valid token available for upload');
    throw new Error('Authentication required. Please login again.');
  }

  const formData = new FormData();
  formData.append('file', file);

  console.log('FormData created with file:', file.name);

  const headers: HeadersInit = {
    'Authorization': `Bearer ${token.trim()}`
  };

  console.log('Upload headers:', headers);

  try {
    const response = await fetch(`${API_BASE_URL}/upload-and-process`, {
      method: 'POST',
      headers,
      body: formData,
    });

    console.log('Upload response status:', response.status);
    console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Upload Error: ${response.status} - ${errorText}`);
      
      // If 401 error, clear invalid token
      if (response.status === 401) {
        console.log('401 error during upload - clearing potentially invalid token');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        throw new Error('Authentication failed. Please login again.');
      }
      
      throw new Error(`Upload Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Upload successful! Response:', result);
    console.log('=== PDF UPLOAD END ===');
    return result;
    
  } catch (error) {
    console.error('Upload request failed:', error);
    console.log('=== PDF UPLOAD FAILED ===');
    throw error;
  }
};

export const scrapeUrl = async (url: string) => {
  const token = localStorage.getItem('auth_token');
  
  console.log('=== URL SCRAPE START ===');
  console.log('Making scrape request for URL:', url);
  console.log('Token present for scrape:', token ? 'Yes' : 'No');
  console.log('Token value (first 50 chars):', token ? token.substring(0, 50) + '...' : 'No token');
  
  if (!token || token.trim() === '') {
    console.error('No valid token available for scraping');
    throw new Error('Authentication required. Please login again.');
  }
  
  try {
    const result = await apiCall('/scrape-and-ingest', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
    console.log('Scrape successful! Response:', result);
    console.log('=== URL SCRAPE END ===');
    return result;
  } catch (error) {
    console.error('Scrape URL error details:', error);
    console.log('=== URL SCRAPE FAILED ===');
    throw error;
  }
};

export const getTaskStatus = (taskId: string) => {
  const token = localStorage.getItem('auth_token');
  const url = new URL(`${API_BASE_URL}/process-status/${taskId}`, window.location.origin);
  if (token) {
    url.searchParams.append('token', token);
  }
  return new EventSource(url.toString());
};

export const askQuestion = async (question: string, collectionName: string) => {
  return apiCall('/ask', {
    method: 'POST',
    body: JSON.stringify({ question, collection_name: collectionName }),
  });
};

export const saveChatbotConfig = async (config: any) => {
  return apiCall('/chatbot-config', {
    method: 'POST',
    body: JSON.stringify(config),
  });
};

export const getChatbotConfig = async (userId: string) => {
  return apiCall(`/chatbot-config/${userId}`, {
    method: 'GET',
  });
};
