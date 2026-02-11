import { EEnvironment } from '@config/enums';
import { envConfig } from '@config/env';
import { helperLogger } from '@infra/helper/logger';
import { EHttpCode } from '@infra/http/enums/HttpCode';
import { BaseError } from '@infra/http/errors/BaseError';
import { IFastifyErrorHandler } from './IFastifyErrorHandler';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

type FastifyContext = {
  reply: FastifyReply;
  request: FastifyRequest;
};

export class FastifyErrorHandler implements IFastifyErrorHandler<
  FastifyError,
  FastifyContext
> {
  public async execute(
    err: FastifyError,
    context: FastifyContext,
  ): Promise<void> {
    if (err instanceof BaseError) {
      if (envConfig.NODE_ENV === EEnvironment.DEVELOPMENT) {
        helperLogger.error({
          name: err.name,
          message: err.message,
          context: err.context,
          stack: err.stack,
        });
      }
      return context.reply
        .code(err.statusCode)
        .send(this.formatErrorResponse(err));
    }

    return context.reply
      .code(EHttpCode.INTERNAL_SERVER_ERROR)
      .send(this.formatErrorResponse(err));
  }

  private formatErrorResponse(err: FastifyError) {
    return {
      name: err.name,
      message: err.message || 'Internal server error',
      context: (err as BaseError)?.context,
    };
  }
}
