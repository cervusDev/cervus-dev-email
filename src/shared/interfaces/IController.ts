import { Multipart } from "@fastify/multipart";

export interface IControllerRequest<
  TBody = unknown,
  TParams = Record<string, string> | unknown,
  TQuery = Record<string, string | string[]> | unknown,
> {
  body: TBody;
  params: TParams;
  query: TQuery;
  parts: AsyncIterableIterator<Multipart>;
}

export interface IControllerResponse<TBody = unknown> {
  body: TBody;
  statusCode: number;
}

export interface IController {
  execute(request: IControllerRequest): Promise<IControllerResponse>;
}
