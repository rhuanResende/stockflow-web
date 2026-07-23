import { Environment } from '../app/core/models/environment';

export const environment: Environment = {
  production: true,
  appName: 'STOCKFLOW-WEB',
  envName: 'HOM',
  test: false,
  baseUrl: 'https://stockflow-service-homolog.up.railway.app/api/v1',
};
