import { FastifyReply, FastifyRequest } from 'fastify';

import { IController } from '@shared/interfaces/IController.js';
import { IRouterAdapter } from './IFastifyRoutes.js';

export class FastifyRouter
  implements IRouterAdapter<FastifyRequest, FastifyReply>
{
  private readonly controller: IController;

  constructor(controller: IController) {
    this.controller = controller;
  }

  public async execute(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const result = await this.controller.execute({
      body: request.body,
      params: request.params as Record<string, string>,
      query: request.query as Record<string, string>,
      adminId: request.metadata.adminId,
      parts: request.parts()
    });
    return reply.code(result.statusCode).send(result.body || undefined);
  }
}
