import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { parseExpression } from './Parse';
import { runRepl } from './Repl';

function executeFile(filename: string) {
    const content = fs.readFileSync(filename, 'utf-8');
    console.log(parseExpression(content));
}

yargs(hideBin(process.argv))
  .command('$0', 'The default command', {}, (argv) => {
    if (argv._.length > 0) {
      // Execute file(s) if provided
      argv._.forEach(file => {
        executeFile(file);
      });
    } else {
      // Run the REPL if no file provided
      runRepl();
    }
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .parse();

