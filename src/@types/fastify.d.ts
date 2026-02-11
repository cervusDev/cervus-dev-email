/* eslint-disable @typescript-eslint/naming-convention */
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    metadata: {
    };
  }
}
