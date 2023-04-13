import { type Item } from './Item.interface';

export interface CategoryType {
  id: number;
  name: string;
  items: Item[];
}
