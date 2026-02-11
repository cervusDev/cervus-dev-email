import { EHttpCode } from "@infra/http/enums/HttpCode";
import { BaseError } from "@infra/http/errors/BaseError";

export class HostNotAllowedError extends BaseError {
  constructor(context?: Record<string, unknown>) {
    super(
      'Host not allowed',
      EHttpCode.BAD_GATEWAY,
      'HostNotAllowedError',
      context,
    );
  }
}
