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
  .scriptName("Farm DSL")
  .usage('$0 [options]')
  .command('$0', 'The default command', {}, (argv) => {
    if (argv.file) {
      // Execute file if provided
      executeFile(argv.file);
    } else {
      // Run the REPL if no file option is provided
      runRepl();
    }
  })
  .option('file', {
    alias: 'f',
    type: 'string',
    description: 'File to execute',
    requiresArg: true
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .option('execute', {
    alias: 'e',
    type: 'string',
    describe: 'Execute a single line of expression',
    requiresArg: true
  })
  .help('help')
  .alias('help', 'h')
  .version('version', '0.0.1')
  .alias('version', 'V')
  .showHelpOnFail(true)
  .epilog('Author: Group 12')
  .check((argv) => {
    if (argv.execute) {
      console.log(parseExpression(argv.execute));
      process.exit(0);
    }
    return true;
  })
  .parse();
