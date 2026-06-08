import { http, toApiError } from './http';
import type {
  CreatePresentationRequest,
  CreatePresentationResponse,
  PollPresentationResponse,
} from './types';

export async function createPresentation(
  payload: CreatePresentationRequest,
): Promise<CreatePresentationResponse> {
  try {
    const res = await http.post<CreatePresentationResponse>('/presentation', payload);
    return res.data;
  } catch (err) {
    throw toApiError(err, 'Failed to start the wallet authentication.');
  }
}

export async function pollPresentation(
  presentationSessionId: string,
): Promise<PollPresentationResponse> {
  try {
    const res = await http.get<PollPresentationResponse>(
      `/presentation/${encodeURIComponent(presentationSessionId)}`,
    );
    return res.data;
  } catch (err) {
    throw toApiError(err, 'Failed to fetch authentication state.');
  }
}
