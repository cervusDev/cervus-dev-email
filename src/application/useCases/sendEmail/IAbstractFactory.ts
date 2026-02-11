import { ISendEmailProvider } from '@application/provider/MailProvider/ISendMail';

export interface IAbstractFactory {
  makeSendEmailProvider(): ISendEmailProvider;
}
