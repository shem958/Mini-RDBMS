export type ColumnType = 'INT' | 'STRING' | 'BOOLEAN';

export interface Column {
    name: string;
    type: ColumnType;
    primary?: boolean;
    unique?: boolean;
}
