import { Bootstrap } from "@infra/bootstrap";
import { FastifyErrorHandler } from "@infra/http/errorHandler/FastifyErrorHandler";
import { FastifyServer } from "@infra/http/server/FastifyServer";

async function start(): Promise<void> {
  const errorHandler = new FastifyErrorHandler();
  const server = new FastifyServer(errorHandler);
  const bootstrap = new Bootstrap(server);
  await bootstrap.start();
}

start();