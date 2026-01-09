import { Table } from './Table';
import { Column } from './Column';
import { FileStorage } from '../storage/fileStorage';

export class Database {
    private tables: Map<string, Table>;

    constructor() {
        this.tables = new Map();
        this.loadTables();
    }

    private loadTables(): void {
        const tables = FileStorage.loadAllTables();
        for (const table of tables) {
            this.tables.set(table.name, table);
        }
    }

    createTable(name: string, columns: Column[]): void {
        if (this.tables.has(name)) {
            throw new Error(`Table '${name}' already exists`);
        }

        const table = new Table(name, columns);
        this.tables.set(name, table);
        FileStorage.saveTable(table);
    }

    getTable(name: string): Table {
        const table = this.tables.get(name);
        if (!table) {
            throw new Error(`Table '${name}' does not exist`);
        }
        return table;
    }

    dropTable(name: string): void {
        if (!this.tables.has(name)) {
            throw new Error(`Table '${name}' does not exist`);
        }
        this.tables.delete(name);
    }

    listTables(): string[] {
        return Array.from(this.tables.keys());
    }

    persistTable(name: string): void {
        const table = this.getTable(name);
        FileStorage.saveTable(table);
    }
}
