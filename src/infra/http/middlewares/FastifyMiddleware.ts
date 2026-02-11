import { FastifyReply, FastifyRequest } from 'fastify';
import { IMiddlewareAdapter } from './IFastifyMiddleware';
import { IMiddleware } from '@shared/interfaces/IMiddleware';


export class FastifyMiddleware
  implements IMiddlewareAdapter<FastifyRequest, FastifyReply>
{
  private readonly middleware: IMiddleware;

  constructor(middleware: IMiddleware) {
    this.middleware = middleware;
  }

  public async execute(
    request: FastifyRequest,
    _: FastifyReply,
  ): Promise<void> {
    const response = await this.middleware.execute({
      headers: request.headers,
    });
    request.metadata = {
      ...request.metadata,
      ...response.data,
    };
  }
}
