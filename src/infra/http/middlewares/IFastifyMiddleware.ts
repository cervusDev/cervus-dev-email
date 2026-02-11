export interface IMiddlewareAdapter<TRequest = unknown, TResponse = unknown> {
  execute(request: TRequest, response: TResponse): Promise<void>;
}
