export class AuthError extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number = 400,
    public readonly code?: string,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}