import { IError } from './error.interface';

export interface IResponse {
  summary: string;
  success: boolean;
  status: number;
  data?: any;
  error?: IError;
}
