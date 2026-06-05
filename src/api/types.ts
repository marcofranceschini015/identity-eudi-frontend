export type SessionState = 'CREATED' | 'ISSUED' | 'FAILED' | 'REVOKED';

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
