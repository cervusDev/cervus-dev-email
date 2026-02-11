import { EHttpCode } from "@infra/http/enums/HttpCode";
import { BaseError } from "@infra/http/errors/BaseError";

export class RateLimitError extends BaseError {
  constructor(context?: Record<string, unknown>) {
    super(
      'Request limit reached',
      EHttpCode.TOO_MANY_REQUESTS,
      'RateLimitError',
      context,
    );
  }
}
