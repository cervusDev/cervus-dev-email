import { ISendInputData } from "./InputData";

export interface ISendEmailProvider {
  send(inputData: ISendInputData): Promise<void>;
}