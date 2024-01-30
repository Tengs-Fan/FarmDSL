import * as readline from "readline";
import { parseProgram } from "./Parse";
import { transProgram } from "./Trans";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function exit() {
    console.log("Goodbye!");
    rl.close();
    process.exit(0);
}

export function runRepl(verbose: boolean) {
    rl.question("> ", (input) =>
    {
        switch (input) {
        case "exit":
            exit();
            break;
        default:
            try {
                const tree = parseProgram(input, verbose);
                const _result = transProgram(tree);
            } catch (err) {
                console.error('Error Parsing:', err.message);
            }
            runRepl(verbose);
        }
    });
}

