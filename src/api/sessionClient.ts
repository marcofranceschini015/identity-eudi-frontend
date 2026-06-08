import { http, toApiError } from './http';
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  PollSessionResponse,
} from './types';

export { ApiError } from './http';

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
