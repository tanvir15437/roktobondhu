/**
 * RoktoBondhu Real API Client
 * Seamlessly interfaces with Next.js rewrites -> Express backend
 */

const API_BASE = '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options;

  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('roktobondhu_token') : null;
  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };
  if (token && !reqHeaders['Authorization']) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    headers: reqHeaders,
    credentials: 'include', // transmits HTTP-only cookies automatically
    ...rest,
  });

  const data = await res.json().catch(() => null);

  if (endpoint.startsWith('/auth/logout') && typeof window !== 'undefined') {
    localStorage.removeItem('roktobondhu_token');
  } else if (data?.data?.token && typeof window !== 'undefined') {
    localStorage.setItem('roktobondhu_token', data.data.token);
  }

  if (!res.ok) {
    const errorMsg = data?.message || data?.errors?.[0]?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data?.data ?? data;
}

export const api = {
  auth: {
    register: (payload: any) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (identifier: string, password: string) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request('/auth/me', { method: 'GET' }),
    demo: (role: 'donor' | 'requester') =>
      request(`/auth/demo/${role}`, { method: 'POST' }),
  },

  requests: {
    getAll: (params?: Record<string, any>) => request('/requests', { method: 'GET', params }),
    getUrgent: () => request('/requests/urgent', { method: 'GET' }),
    getById: (id: string) => request(`/requests/${id}`, { method: 'GET' }),
    create: (payload: any) =>
      request('/requests', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: any) =>
      request(`/requests/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    updateStatus: (id: string, status: string, unitsFulfilled?: number) =>
      request(`/requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, unitsFulfilled }),
      }),
    delete: (id: string) => request(`/requests/${id}`, { method: 'DELETE' }),
    my: () => request('/requests/my/requests', { method: 'GET' }),
  },

  donations: {
    getAll: () => request('/donations', { method: 'GET' }),
    add: (payload: any) =>
      request('/donations', { method: 'POST', body: JSON.stringify(payload) }),
    delete: (id: string) => request(`/donations/${id}`, { method: 'DELETE' }),
  },

  connections: {
    create: (payload: { requestId: string; contactMethod?: string; donorName?: string; donorPhone?: string }) =>
      request('/connections', { method: 'POST', body: JSON.stringify(payload) }),
    byRequest: (requestId: string) => request(`/connections/request/${requestId}`, { method: 'GET' }),
    my: () => request('/connections/my', { method: 'GET' }),
  },

  users: {
    getProfile: () => request('/users/profile', { method: 'GET' }),
    updateProfile: (payload: any) =>
      request('/users/profile', { method: 'PATCH', body: JSON.stringify(payload) }),
    updateAvailability: (isAvailable: boolean) =>
      request('/users/availability', { method: 'PATCH', body: JSON.stringify({ isAvailable }) }),
    getDonors: (params?: Record<string, any>) => request('/users/donors', { method: 'GET', params }),
  },

  notifications: {
    getAll: () => request('/notifications', { method: 'GET' }),
    markRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),
  },
};

