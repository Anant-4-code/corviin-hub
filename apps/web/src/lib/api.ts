import { REQUEST_HEADERS } from '@corviin-hub/shared';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  statusCode: number;
  code: string;
  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const raw = localStorage.getItem('corviin-hub-state');
    if (raw) {
      const parsed = JSON.parse(raw);
      const s = parsed?.state;
      if (s?.selectedProfileId) headers[REQUEST_HEADERS.profileId] = s.selectedProfileId;
      if (s?.selectedWorkspaceId) headers[REQUEST_HEADERS.workspaceId] = s.selectedWorkspaceId;
    }
  } catch { /* ignore */ }
  return headers;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.code || 'UNKNOWN', err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

