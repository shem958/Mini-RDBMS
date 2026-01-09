import readline from 'readline';
import { Database } from '../core/Database';
import { executeSQL } from '../parser/parser';

export function startREPL(db: Database) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'mini-rdbms> ',
    });

    console.log('Welcome to Mini RDBMS REPL!');
    console.log('Type SQL commands, or "exit" to quit.');
    rl.prompt();

    rl.on('line', (line) => {
        const trimmed = line.trim();
        if (trimmed.toLowerCase() === 'exit') {
            rl.close();
            return;
        }

        if (trimmed.length === 0) {
            rl.prompt();
            return;
        }

        try {
            const result = executeSQL(db, trimmed);
            console.log(result);
        } catch (err: any) {
            console.error('Error:', err.message);
        }

        rl.prompt();
    });

    rl.on('close', () => {
        console.log('Goodbye!');
        process.exit(0);
    });
}
