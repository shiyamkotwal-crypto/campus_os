const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');

function buildUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  if (API_BASE_URL.endsWith('/api/v1')) {
    if (cleanEndpoint.startsWith('/api/v1/')) {
      return `${API_BASE_URL.replace(/\/api\/v1$/, '')}${cleanEndpoint}`;
    }
    return `${API_BASE_URL}${cleanEndpoint}`;
  }
  
  if (cleanEndpoint.startsWith('/api/v1/')) {
    return `${API_BASE_URL}${cleanEndpoint}`;
  }
  return `${API_BASE_URL}/api/v1${cleanEndpoint}`;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('campus_os_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = buildUrl(endpoint);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If not on login page, redirect or clear token
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
      localStorage.removeItem('campus_os_token');
      localStorage.removeItem('campus_os_user');
      window.location.href = '/login';
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `HTTP ${response.status} Request failed`;
    throw new Error(errorMsg);
  }

  return data as T;
}

