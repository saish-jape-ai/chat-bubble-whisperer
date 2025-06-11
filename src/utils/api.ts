
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

export const uploadFile = async (file: File) => {
  const token = localStorage.getItem('auth_token');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload-and-process`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload Error: ${response.status}`);
  }

  return response.json();
};

export const scrapeUrl = async (url: string) => {
  return apiCall('/scrape-and-ingest', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
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
