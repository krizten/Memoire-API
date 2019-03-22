import { ICoordinates } from './coordinates';

export interface Entry {
  id: string;
  created: Date;
  updated: Date;
  title: string;
  content: string;
  image?: string;
  location?: ICoordinates;
}
