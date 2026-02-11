import type { Multipart } from '@fastify/multipart';

export interface IInputData {
  parts: AsyncIterableIterator<Multipart>;
}
