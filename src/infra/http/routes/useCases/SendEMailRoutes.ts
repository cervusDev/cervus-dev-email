import { rootPath } from './config';
import { IRoute } from '../IRoute';
import makeSendEmailController from '@application/controller/sendEmail/factory';

export const sendEmailRoutes: IRoute[] = [
  {
    method: 'POST',
    path: rootPath,
    controller: makeSendEmailController(),
  },
];
