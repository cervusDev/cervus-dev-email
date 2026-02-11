import { SendEmailUseCase } from '@application/useCases/sendEmail';

export interface IFactory {
  makeSendEmailUseCase(): SendEmailUseCase;
}
