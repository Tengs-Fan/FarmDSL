import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { parseProgram } from './Parse';
import { transProgram } from './Trans';
import { runRepl } from './Repl';

function executeFile(filename: string, verbose = false) 
{
    const content = fs.readFileSync(filename, 'utf-8');
    const parsedProgram = parseProgram(content, verbose);
    const program = transProgram(parsedProgram);
    process.exit(0);
}

interface MyArguments extends yargs.Arguments {
    file?: string;
    verbose?: boolean;
    execute?: string;
}

yargs(hideBin(process.argv))
    .scriptName("Farm DSL")
    .usage('$0 [options]')
    .command('$0', 'The default command', {}, (argv: MyArguments) => {
        if (argv.file) {
            // Execute file if provided
            executeFile(argv.file, argv.verbose);
        } else {
            // Run the REPL if no file option is provided
            runRepl(argv.verbose);
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
    .check((argv: MyArguments) => {
        if (argv.execute)
        {
            parseProgram(argv.execute, argv.verbose);
            process.exit(0);
        }
        return true;
    })
    .parse();
