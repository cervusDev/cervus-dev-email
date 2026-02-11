import { IncomingHttpHeaders } from 'http';

export interface IMiddlewareRequest {
  headers: IncomingHttpHeaders;
}

export interface IMiddlewareResponse {
  data: Record<string, any>;
}

export interface IMiddleware {
  execute(request: IMiddlewareRequest): Promise<IMiddlewareResponse>;
}
