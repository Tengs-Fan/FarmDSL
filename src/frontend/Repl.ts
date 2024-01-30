import * as readline from "readline";
import { parseProgram } from "./Parse";
import { transProgram } from "./Trans";
import { evalProgram } from "vm/Eval";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function exit() {
    console.log("Goodbye!");
    rl.close();
    process.exit(0);
}

export function runRepl(verbose = false) {
    rl.question("> ", (input) =>
    {
        switch (input) {
        case "exit":
            exit();
            break;
        default:
            try {
                const parsedTree = parseProgram(input, verbose);
                const ourTree = transProgram(parsedTree, verbose);
                const result = evalProgram(ourTree);
                result.show();
            } catch (err) {
                console.error('REPL: ', err.message);
            }
            runRepl(verbose);
        }
    });
}

