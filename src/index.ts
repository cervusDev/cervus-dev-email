import 'dotenv/config';
import path from 'path';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import nodemailer, { Transporter } from 'nodemailer';

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
  toAddress: string[];
}

export async function sendEmail({ toAddress }: ISendEmail) {
  const transporter = createTransport();

  const imagePath = path.resolve(__dirname, '../assets/image.jpeg');

  try {
    const info = await transporter.sendMail({
      from: 'MS_3fqs3K@cervusdev.com.br',
      to: toAddress.join(', '),
      subject: 'Obrigado por apoiar o CervusDev! Aproveite seu pôster 🎁',
      text: `
Olá!

Queremos agradecer por apoiar o projeto CervusDev 💙  
Como forma de agradecimento, preparamos este pôster exclusivo para você.

Esperamos que goste!
Equipe CervusDev
  `,
      attachments: [
        {
          filename: 'poster-cervusdev.jpg',
          path: imagePath,
          contentType: 'image/jpeg',
        },
      ],
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

const PORT = Number(process.env.PORT) || 3333;

const serverInfo = {
  name: 'Node + TypeScript',
  nodeVersion: process.version,
};

interface EmailBody {
  email: string;
}

server.post<{ Body: EmailBody }>(
  '/',
  {
    schema: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
    },
  },
  async (request, _) => {
    const { email } = request.body;

    await sendEmail({ toAddress: [email] });

    return {
      statusCode: 200,
      message: 'Email enviado com sucesso.',
    };
  },
);

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
