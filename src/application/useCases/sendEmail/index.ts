import { IUseCase } from '@shared/interfaces/IUseCase';
import { IInputData } from './InputData';
import { ISendEmailProvider } from '@application/provider/MailProvider/ISendMail';
import { IAbstractFactory } from './IAbstractFactory';
import { MultipartFile } from '@fastify/multipart';

export class SendEmailUseCase implements IUseCase<IInputData, void> {
  private readonly sendEmailProvider: ISendEmailProvider;
  constructor(factory: IAbstractFactory) {
    this.sendEmailProvider = factory.makeSendEmailProvider();
  }
  public async execute({ parts }: IInputData): Promise<void> {
    const attachments = [];
    let subject = '';
    let text = '';

    for await (const part of parts) {
      if ('file' in part) {
        const file = part as MultipartFile;
        const buffer = await file.toBuffer();
        attachments.push({
          filename: file.filename || 'file',
          content: buffer,
        });
      } else {
        if (part.fieldname === 'subject') subject = String(part.value);
        if (part.fieldname === 'text') text = String(part.value);
      }
    }

    await this.sendEmailProvider.send({ subject, text, attachments });
  }
}
