import { ClientMode } from './ClientMode';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ISliderProps {
  description: string;
  Color: string;
  siteUrl : any;
  clientMode: ClientMode;
  context: WebPartContext;
}
