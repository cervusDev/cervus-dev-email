import 'dotenv/config';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import nodemailer, { Transporter } from 'nodemailer';
import { Readable } from 'stream';
import multipart, { MultipartFile } from '@fastify/multipart';

enum EHttpCodes {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  Conflict = 409,
  UnprocessableEntity = 422,
  InternalServerError = 500,
}

const envProductionTransport = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const envDevelopmentTransport = {
  host: process.env.ETHEREAL_HOST,
  port: Number(process.env.ETHEREAL_PORT),
  secure: false,
  auth: {
    user: process.env.ETHEREAL_USERNAME,
    pass: process.env.ETHEREAL_PASSWORD,
  },
};

export function createTransport(): Transporter {
  if (process.env.NODE_ENV === 'production') {
    console.log('env transport', envProductionTransport);
    return nodemailer.createTransport(envProductionTransport);
  }

  return nodemailer.createTransport(envDevelopmentTransport);
}

interface ISendEmail {
  subject: string;
  text: string;
  attachments?: { filename: string; content: Buffer | Readable }[];
}

export async function sendEmail({ subject, text, attachments }: ISendEmail) {
  const transporter = createTransport();

  try {
    const info = await transporter.sendMail({
      from: 'MS_3fqs3K@cervusdev.com.br',
      to: 'gustavo.cervus@gmail.com',
      subject,
      text,
      attachments,
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

const server = Fastify({
  logger: true,
});

server.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
});

server.register(multipart);

const PORT = Number(process.env.PORT) || 3333;

const serverInfo = {
  name: 'Node + TypeScript',
  nodeVersion: process.version,
};

server.post('/', async (request, reply) => {
  const parts = request.parts();
  const attachments: { filename: string; content: Buffer }[] = [];
  let subject = '';
  let text = '';

  for await (const part of parts) {
    if ('file' in part) {
      const file = part as MultipartFile;
      const buffer = await file.toBuffer();
      attachments.push({ filename: file.filename || 'file', content: buffer });
    } else {
      if (part.fieldname === 'subject') subject = String(part.value);
      if (part.fieldname === 'text') text = String(part.value);
    }
  }

  sendEmail({ subject, text, attachments });

  reply.status(EHttpCodes.Ok)
});

server.get('/health', async () => {
  return {
    message: '🚀 API online com Fastify',
    server: serverInfo,
  };
});

const start = async () => {
  try {
    await server.listen({
      port: PORT,
      host: '0.0.0.0',
    });

    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
