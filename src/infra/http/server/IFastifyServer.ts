export interface IStartInputData {
  port: string;
}

export interface IFastifyServer {
  registerMiddlewares(): Promise<void>;
  registerRoutes(): Promise<void>;
  start(inputData: IStartInputData): Promise<void>;
}
