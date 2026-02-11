import { SendEmailDatabaseRepository } from '@application/useCases/sendEmail/DatabaseRepository';
import { SendEmailController } from '.';
import { SendEmailUseCase } from '@application/useCases/sendEmail';

function makeSendEmailController() {
  const controller = new SendEmailController({
    makeSendEmailUseCase: () => {
      const factory = new SendEmailDatabaseRepository();
      const useCase = new SendEmailUseCase(factory);
      return useCase;
    },
  });
  return controller;
}
export default makeSendEmailController;
