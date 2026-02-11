export class BaseError extends Error {
  constructor(
    public readonly message: string,

    public readonly statusCode: number,

    public readonly name = 'BaseError',

    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
