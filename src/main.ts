import { Database } from './core/Database';
import { startREPL } from './repl/repl';

const db = new Database();

console.log('Mini RDBMS loaded. Starting REPL...');
startREPL(db);
