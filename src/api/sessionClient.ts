import axios, { AxiosError } from 'axios';
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  PollSessionResponse,
} from './types';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20_000,
});

export class ApiError extends Error {
  readonly status?: number;
  readonly cause?: unknown;

  constructor(message: string, status?: number, cause?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.cause = cause;
  }
}

function toApiError(err: unknown, fallback: string): ApiError {
  if (err instanceof AxiosError) {
    const status = err.response?.status;
    const data = err.response?.data as { message?: string; error?: string } | undefined;
    const msg = data?.message ?? data?.error ?? err.message ?? fallback;
    return new ApiError(msg, status, err);
  }
  return new ApiError(fallback, undefined, err);
}

export async function createSession(
  payload: CreateSessionRequest,
): Promise<CreateSessionResponse> {
  try {
    const res = await http.post<CreateSessionResponse>('/session', payload);
    return res.data;
  } catch (err) {
    throw toApiError(err, 'Failed to create verification session.');
  }
}

export async function pollSession(sessionId: string): Promise<PollSessionResponse> {
  try {
    const res = await http.get<PollSessionResponse>(`/session/${encodeURIComponent(sessionId)}`);
    return res.data;
  } catch (err) {
    throw toApiError(err, 'Failed to fetch session state.');
  }
}
