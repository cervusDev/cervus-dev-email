import { ISendInputData } from "./InputData";
import { ISendOutputData } from "./OutputData";

export interface ISendEmailProvider {
  send(inputData: ISendInputData): Promise<ISendOutputData>;
}