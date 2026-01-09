import { Database } from '../core/Database';
import { Column } from '../core/Column';

export function executeSQL(db: Database, query: string): any {
    const tokens = query.trim().split(/\s+/);
    const command = tokens[0].toUpperCase();

    switch (command) {
        case 'CREATE':
            return handleCreateTable(db, query);
        case 'INSERT':
            return handleInsert(db, query);
        case 'SELECT':
            return handleSelect(db, query);
        case 'DELETE':
            return handleDelete(db, query);
        default:
            throw new Error(`Unknown SQL command: ${command}`);
    }
}

function handleCreateTable(db: Database, query: string) {
    // Example: CREATE TABLE users (id INT PRIMARY, email STRING UNIQUE, name STRING)
    const match = query.match(/CREATE TABLE (\w+) \((.+)\)/i);
    if (!match) throw new Error('Invalid CREATE TABLE syntax');

    const tableName = match[1];
    const colsRaw = match[2].split(',');

    const columns: Column[] = colsRaw.map(col => {
        const parts = col.trim().split(/\s+/);
        return {
            name: parts[0],
            type: parts[1] as 'INT' | 'STRING' | 'BOOLEAN',
            primary: parts.includes('PRIMARY'),
            unique: parts.includes('UNIQUE'),
        };
    });

    if (!db.listTables().includes(tableName)) {
        db.createTable(tableName, columns);
    }

    return `Table '${tableName}' created or already exists.`;
}

function handleInsert(db: Database, query: string) {
    // Example: INSERT INTO users VALUES (1, "a@test.com", "Alice")
    const match = query.match(/INSERT INTO (\w+) VALUES \((.+)\)/i);
    if (!match) throw new Error('Invalid INSERT syntax');

    const tableName = match[1];
    const valuesRaw = match[2].split(',');

    const table = db.getTable(tableName);

    const row: Record<string, any> = {}; // <-- TS-safe

    table.columns.forEach((col, i) => {
        let val: any = valuesRaw[i].trim(); // <-- TS-safe
        if (col.type === 'INT') val = parseInt(val);
        if (col.type === 'BOOLEAN') val = val.toLowerCase() === 'true';
        if (col.type === 'STRING') val = val.replace(/^"|"$/g, '');
        row[col.name] = val;
    });

    table.insert(row);
    db.persistTable(tableName);
    return `1 row inserted into '${tableName}'.`;
}

function handleSelect(db: Database, query: string) {
    // Example: SELECT * FROM users
    const match = query.match(/SELECT \* FROM (\w+)/i);
    if (!match) throw new Error('Invalid SELECT syntax');

    const tableName = match[1];
    const table = db.getTable(tableName);

    return table.select();
}

function handleDelete(db: Database, query: string) {
    // Example: DELETE FROM users WHERE id = 1
    const match = query.match(/DELETE FROM (\w+) WHERE (\w+) = (.+)/i);
    if (!match) throw new Error('Invalid DELETE syntax');

    const tableName = match[1];
    const col = match[2];
    let val: any = match[3].trim(); // <-- TS-safe

    const table = db.getTable(tableName);
    const columnDef = table.columns.find(c => c.name === col);
    if (!columnDef) throw new Error(`Column '${col}' not found`);

    if (columnDef.type === 'INT') val = parseInt(val);
    if (columnDef.type === 'BOOLEAN') val = val.toLowerCase() === 'true';
    if (columnDef.type === 'STRING') val = val.replace(/^"|"$/g, '');

    const deletedCount = table.delete(row => row[col] === val);
    db.persistTable(tableName);
    return `${deletedCount} row(s) deleted from '${tableName}'.`;
}
