import { SendEmailUseCase } from '@application/useCases/sendEmail';
import {
  IController,
  IControllerRequest,
  IControllerResponse,
} from '@shared/interfaces/IController';
import { IFactory } from './IFactory';
import { EHttpCode } from '@infra/http/enums/HttpCode';

export class SendEmailController implements IController {
  private readonly sendEmailUseCase: SendEmailUseCase;
  constructor(factory: IFactory) {
    this.sendEmailUseCase = factory.makeSendEmailUseCase();
  }
  public async execute(
    request: IControllerRequest,
  ): Promise<IControllerResponse> {
    await this.sendEmailUseCase.execute({
      parts: request.parts,
    });
    const response: IControllerResponse = {
      body: null,
      statusCode: EHttpCode.NO_CONTENT,
    };
    return response;
  }
}
