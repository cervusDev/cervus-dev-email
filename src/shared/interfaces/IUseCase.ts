export interface IUseCase<TInput = unknown, TOutput = unknown> {
  execute(inputData: TInput): Promise<TOutput>;
}
