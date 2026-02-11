import { IFastifyErrorHandler } from '@infra/http/errorHandler/IFastifyErrorHandler';
import { IFastifyServer, IStartInputData } from './IFastifyServer';
import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from 'fastify';
import qs from 'qs';
import rateLimit from '@fastify/rate-limit';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import cors from '@fastify/cors';
import { generalEnv } from '@environment/general';
import { EEnvironment } from '@config/enums';
import { HostNotAllowedError } from '@infra/http/errors/HostNotAllowedError';
import { corsConfig } from '@config/cors';
import { RateLimitError } from '@infra/http/errors/RateLimitErr';
import { routes } from '@infra/http/routes';
import { FastifyRouter } from '@infra/http/routes/FastifyRoutes';
import { FastifyMiddleware } from '@infra/http/middlewares/FastifyMiddleware';

export class FastifyServer implements IFastifyServer {
  private readonly fastify: FastifyInstance;

  constructor(errorHandler: IFastifyErrorHandler) {
    this.fastify = Fastify({
      querystringParser: (value) => qs.parse(value),
    });
    this.fastify.setValidatorCompiler(validatorCompiler);
    this.fastify.setSerializerCompiler(serializerCompiler);
    this.fastify.withTypeProvider<ZodTypeProvider>();
    this.fastify.setErrorHandler(async (err, request, reply) => {
      await errorHandler.execute(err, { request, reply });
    });
  }

  public async registerMiddlewares(): Promise<void> {
    await this.fastify.register(cors, {
      origin: (origin, callback) => {
        if (generalEnv.environment === EEnvironment.DEVELOPMENT) {
          callback(null, true);
          return;
        }
        if (!origin) {
          callback(new HostNotAllowedError(), false);
          return;
        }
        const hostname = new URL(origin).hostname;
        if (corsConfig.allowedHosts.includes(hostname)) {
          callback(null, true);
          return;
        }
        callback(new HostNotAllowedError(), false);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    await this.fastify.register(rateLimit, {
      max: 60,
      timeWindow: '1 minute',
      ban: 5,
      errorResponseBuilder: () => {
        throw new RateLimitError();
      },
    });
  }

  public async registerRoutes(): Promise<void> {
    for (const route of routes) {
      const router = new FastifyRouter(route.controller);
      const middlewares = route.middlewares?.map((middleware) => {
        const adapter = new FastifyMiddleware(middleware);
        return adapter.execute.bind(adapter);
      });
      const routeOptions: RouteShorthandOptions = {
        preHandler: middlewares,
      };
      if (route.schemas) {
        routeOptions.schema = route.schemas;
      }
      const methodMap = {
        GET: this.fastify.get.bind(this.fastify),
        POST: this.fastify.post.bind(this.fastify),
        PUT: this.fastify.put.bind(this.fastify),
        PATCH: this.fastify.patch.bind(this.fastify),
        DELETE: this.fastify.delete.bind(this.fastify),
      };
      const handler = methodMap[route.method];
      if (!handler) {
        throw new Error(`Método HTTP não suportado: ${route.method}`);
      }
      handler(
        route.path,
        routeOptions,
        async (request: FastifyRequest, reply: FastifyReply) => {
          await router.execute(request, reply);
        },
      );
    }
  }

  public async start(inputData: IStartInputData): Promise<void> {
    this.fastify.listen({ port: +inputData.port, host: '0.0.0.0' });
  }
}
