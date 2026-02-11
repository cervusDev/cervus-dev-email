import { ISendEmailProvider } from "@application/provider/MailProvider/ISendMail";
import { IAbstractFactory } from "./IAbstractFactory";
import { SendEmailProvider } from "@application/provider/MailProvider";

export class SendEmailDatabaseRepository implements IAbstractFactory {
  makeSendEmailProvider(): ISendEmailProvider {
    return new SendEmailProvider();
  }
}