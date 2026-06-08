import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const http = axios.create({
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

export function toApiError(err: unknown, fallback: string): ApiError {
  if (err instanceof AxiosError) {
    const status = err.response?.status;
    const data = err.response?.data as { message?: string; error?: string } | undefined;
    const msg = data?.message ?? data?.error ?? err.message ?? fallback;
    return new ApiError(msg, status, err);
  }
  return new ApiError(fallback, undefined, err);
}
