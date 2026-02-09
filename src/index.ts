import 'dotenv/config';
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
  subject: string;
  text: string;
}

export async function sendEmail({ subject, text }: ISendEmail) {
  const transporter = createTransport();

  try {
    const info = await transporter.sendMail({
      from: 'MS_3fqs3K@cervusdev.com.br',
      to: 'gustavo.cervus@gmail.com',
      subject,
      text,
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
  text: string;
  subject: string;
}

server.post<{ Body: EmailBody }>(
  '/',
  {
    schema: {
      body: {
        type: 'object',
        required: ['subject', "text"  ],
        properties: {
          subject: { type: 'string' },
          text: { type: 'string' }
        },
      },
    },
  },
  async (request, _) => {
    const { subject, text } = request.body;

    await sendEmail({ subject, text  });

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
