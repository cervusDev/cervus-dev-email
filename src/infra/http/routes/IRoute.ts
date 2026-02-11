import { ZodObject } from 'zod';
import { IController } from '@shared/interfaces/IController';
import { IMiddleware } from '@shared/interfaces/IMiddleware';
import { RouteShorthandOptions } from 'fastify';

export interface IRoute {
  controller: IController;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  middlewares?: IMiddleware[];
  path: string;
  schema?: RouteShorthandOptions['schema'];
  schemas?: {
    body?: ZodObject<any>;
    params?: ZodObject<any>;
    query?: ZodObject<any>;
    response?: Record<number, ZodObject<any>>;
  };
}
