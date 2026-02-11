import { EEnvironment } from "@config/enums";
import { envConfig } from "@config/env";

interface IGeneralEnv {
  environment: EEnvironment;
  name: string;
  port: string;
}

export const generalEnv: IGeneralEnv = {
  environment: envConfig.NODE_ENV,
  name: 'email',
  port: envConfig.PORT,
};
