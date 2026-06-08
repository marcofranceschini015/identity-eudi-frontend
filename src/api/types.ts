export type SessionState = 'CREATED' | 'ISSUED' | 'FAILED' | 'REVOKED';

export type PresentationState =
  | 'CREATED'
  | 'PENDING'
  | 'COMPLETE'
  | 'FAILED'
  | 'EXPIRED';

export interface CreatePresentationRequest {
  tenant: string;
}

export interface CreatePresentationResponse {
  presentationSessionId: string;
  presentationRequestUri: string;
  state: PresentationState;
}

export interface PollPresentationResponse {
  state: PresentationState;
}

export interface BankLoanUserData {
  first_name: string;
  last_name: string;
  iban: string;
}

export interface CreateSessionRequest {
  tenant: string;
  userData: BankLoanUserData;
}

export interface CreateSessionResponse {
  sessionId: string;
  state: SessionState;
  redirectUrl: string;
  oneTimePassword: string;
}

export interface PollSessionResponse {
  state: SessionState;
}
