import fs from 'fs';
import path from 'path';
import { Table } from '../core/Table';
import { Column } from '../core/Column';

const DATA_DIR = path.join(process.cwd(), 'data');

export class FileStorage {
    static saveTable(table: Table): void {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR);
        }

        const filePath = path.join(DATA_DIR, `${table.name}.json`);

        const data = {
            name: table.name,
            columns: table.columns,
            rows: table.rows,
        };

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }

    static loadTable(fileName: string): Table {
        const filePath = path.join(DATA_DIR, fileName);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);

        const table = new Table(parsed.name, parsed.columns as Column[]);

        for (const row of parsed.rows) {
            table.insert(row);
        }

        return table;
    }

    static loadAllTables(): Table[] {
        if (!fs.existsSync(DATA_DIR)) return [];

        return fs
            .readdirSync(DATA_DIR)
            .filter(file => file.endsWith('.json'))
            .map(file => this.loadTable(file));
    }
}
