import { ISendInputData } from './InputData';
import { ISendEmailProvider } from './ISendMail';
import { EEnvironment } from '@config/enums';
import { generalEnv } from '@environment/general';
import {
  envDevelopmentTransport,
  envProductionTransport,
} from '@environment/transport';
import nodemailer, { Transporter } from 'nodemailer';
import { ISendOutputData } from './OutputData';

export class SendEmailProvider implements ISendEmailProvider {
  public async send(inputData: ISendInputData): Promise<ISendOutputData> {
    const transporter = this.createTransport();

    try {
      const info = await transporter.sendMail({
        from: 'MS_3fqs3K@cervusdev.com.br',
        to: 'gustavo.cervus@gmail.com',
        subject: inputData.subject,
        text: inputData.text,
        attachments: inputData.attachments,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
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
