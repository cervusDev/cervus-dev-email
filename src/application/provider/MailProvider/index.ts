import { ISendInputData } from './InputData';
import { ISendEmailProvider } from './ISendMail';
import { EEnvironment } from '@config/enums';
import { generalEnv } from '@environment/general';
import {
  envDevelopmentTransport,
  envProductionTransport,
} from '@environment/transport';
import nodemailer, { Transporter } from 'nodemailer';

export class SendEmailProvider implements ISendEmailProvider {
  public async send(inputData: ISendInputData): Promise<void> {
    const transporter = this.createTransport();

    try {
      await transporter.sendMail({
        from: envProductionTransport.from,
        to: envProductionTransport.to,
        subject: inputData.subject,
        text: inputData.text,
        attachments: inputData.attachments,
      });
    } catch (error) {
      console.error('Erro ao enviar email com imagem:', error);
      throw error;
    }
  }

  private createTransport(): Transporter {
    if (generalEnv.environment === EEnvironment.PRODUCTION) {
      return nodemailer.createTransport(envProductionTransport);
    }

    return nodemailer.createTransport(envDevelopmentTransport);
  }
}
