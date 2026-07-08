export interface ApiError {
  status?: number;
  message: string;
  cause?: unknown;
}
