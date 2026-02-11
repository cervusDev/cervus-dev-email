import { rootPath } from './config';
import { IRoute } from '../IRoute';
import makeSendEmailController from '@application/controller/sendEmail/factory';


export const sendEmailRouteSchema = {
  consumes: ['multipart/form-data'],
};

export const sendEmailRoutes: IRoute[] = [
  {
    method: 'POST',
    path: rootPath,
    schema: {
      consumes: ['multipart/form-data']
    },
    controller: makeSendEmailController(),
  },
];
