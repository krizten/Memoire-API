import { IError } from './error';

export interface IResponse {
  summary: string;
  success: boolean;
  status: number;
  data?: any;
  error?: IError;
}
