import { IListItem } from './IListItem';  
import { IAccesos } from './IAccesos';  

  
export interface INoticiasState {  
  items: IListItem[];  
  accesos: IAccesos[];
  licencia: boolean;
} 