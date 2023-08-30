import { ITableItem, ITableItemChild } from './interfaces/table-item';

export class tableItem implements ITableItem {
  id: string;
  int: number;
  float: number;
  color: string;
  child: { id: string; color: string };

  constructor(
    id: string,
    int: number,
    float: number,
    color: string,
    child: ITableItemChild,
  ) {
    this.id = id;
    this.int = int;
    this.float = float;
    this.color = color;
    this.child = child;
  }
}
