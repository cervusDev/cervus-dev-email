import { ZodObject } from 'zod';
import { IController } from '@shared/interfaces/IController';
import { IMiddleware } from '@shared/interfaces/IMiddleware';

export interface IRoute {
  controller: IController;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  middlewares?: IMiddleware[];
  path: string;
  schemas?: {
    body?: ZodObject<any>;
    params?: ZodObject<any>;
    query?: ZodObject<any>;
    response?: Record<number, ZodObject<any>>;
  };
}
