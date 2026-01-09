import { Column } from './Column';
import { Index } from './Index';

export class Table {
    readonly name: string;
    readonly columns: Column[];
    readonly rows: any[];

    private primaryKey?: string;
    private uniqueIndexes: Map<string, Index>;

    constructor(name: string, columns: Column[]) {
        this.name = name;
        this.columns = columns;
        this.rows = [];
        this.uniqueIndexes = new Map();

        this.initializeIndexes();
    }

    private initializeIndexes() {
        for (const column of this.columns) {
            if (column.primary) {
                this.primaryKey = column.name;
                this.uniqueIndexes.set(column.name, new Index());
            }

            if (column.unique) {
                this.uniqueIndexes.set(column.name, new Index());
            }
        }
    }

    insert(row: Record<string, any>): void {
        for (const column of this.columns) {
            if (!(column.name in row)) {
                throw new Error(`Missing value for column '${column.name}'`);
            }
        }

        for (const [columnName, index] of this.uniqueIndexes.entries()) {
            if (index.has(row[columnName])) {
                throw new Error(
                    `Unique constraint violation on column '${columnName}'`,
                );
            }
        }

        const rowIndex = this.rows.length;
        this.rows.push(row);

        for (const [columnName, index] of this.uniqueIndexes.entries()) {
            index.set(row[columnName], rowIndex);
        }
    }

    select(predicate?: (row: any) => boolean): any[] {
        return predicate ? this.rows.filter(predicate) : [...this.rows];
    }

    delete(predicate: (row: any) => boolean): number {
        let deletedCount = 0;

        for (let i = this.rows.length - 1; i >= 0; i--) {
            if (predicate(this.rows[i])) {
                for (const [columnName, index] of this.uniqueIndexes.entries()) {
                    index.delete(this.rows[i][columnName]);
                }
                this.rows.splice(i, 1);
                deletedCount++;
            }
        }

        return deletedCount;
    }
}
