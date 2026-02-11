export interface IFastifyErrorHandler<TError = unknown, TContext = unknown> {
  execute(err: TError, context: TContext): Promise<void>;
}