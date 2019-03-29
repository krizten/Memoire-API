import { ICoordinates } from './coordinates.interface';

export interface IEntry {
  id: string;
  created: Date;
  updated: Date;
  title: string;
  content: string;
  image?: string;
  geolocation?: ICoordinates;
}
