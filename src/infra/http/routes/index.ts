import { IRoute } from './IRoute';
import { sendEmailRoutes } from './useCases/SendEMailRoutes';

export const routes: IRoute[] = [...sendEmailRoutes];
