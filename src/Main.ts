import * as fs from "fs";
import yargs from "yargs";
import {Arguments} from "yargs";
import {hideBin} from "yargs/helpers";
import {parseProgram} from "./frontend/Parse";
import {transProgram} from "./frontend/Trans";
import {evalProgram} from "./vm/Eval";
import {runRepl} from "./frontend/Repl";
import {setLogLevel, addConsoleOutput} from "./Log";

function executeFile(filename: string, verbose = false) {
    const programString = fs.readFileSync(filename, "utf-8");
    const parsedProgram = parseProgram(programString, verbose);
    const program = transProgram(parsedProgram, verbose);
    const result = evalProgram(program);

    switch (result.type) {
        case "Null":
        case "Num":
        case "Bool":
        case "Farm":
        case "Crop":
            result.show();
            break;
        case "String":
        default:
            throw new Error("Unknown result type: " + result.type);
    }
    process.exit(0);
}

interface MyArguments extends Arguments {
    log?: string;
    file?: string;
    verbose?: boolean;
    execute?: string;
}

yargs(hideBin(process.argv))
    .scriptName("Farm DSL")
    .usage("$0 [options]")
    .command("$0", "The default command", {}, (argv: MyArguments) => {
        setLogLevel(argv.log ? argv.log : "info");
        if (argv.file) {
            // Execute file if provided
            executeFile(argv.file, argv.verbose);
        } else {
            // Output to console in REPL mode if verbose is open
            if (argv.verbose) addConsoleOutput();
            // Run the REPL if no file option is provided
            runRepl(argv.verbose);
        }
    })
    .option("log", {
        alias: "l",
        type: "string",
        description: "Set the log level",
        requiresArg: true,
    })
    .option("file", {
        alias: "f",
        type: "string",
        description: "File to execute",
        requiresArg: true,
    })
    .option("verbose", {
        alias: "v",
        type: "boolean",
        description: "Run with verbose logging",
    })
    .option("execute", {
        alias: "e",
        type: "string",
        describe: "Execute a single line of expression",
        requiresArg: true,
    })
    .help("help")
    .alias("help", "h")
    .version("version", "0.0.1")
    .alias("version", "V")
    .showHelpOnFail(true)
    .epilog(`If you run it with no -f, it reads from stdin\n`)
    .check((argv: MyArguments) => {
        if (argv.execute) {
            parseProgram(argv.execute, true);
            process.exit(0);
        }
        return true;
    })
    .parse();
