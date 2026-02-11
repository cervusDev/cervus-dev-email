import { Readable } from 'stream';

export interface ISendInputData {
  subject: string;
  text: string;
  attachments?: { filename: string; content: Buffer | Readable }[];
}
