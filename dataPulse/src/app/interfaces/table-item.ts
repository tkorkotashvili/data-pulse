export interface ITableItemChild {
    id: string;
    color: string;
}

export interface ITableItem {
    id: string;
    int: number;
    float: number;
    color: string;
    child: ITableItemChild;
}
