import * as readline from "readline";
import { parseExpression } from "./Parse";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export function runRepl() {
    rl.question("> ", (input) =>
    {
        switch (input) {
        case "exit":
            rl.close();
            break;
        default:
            try {
                parseExpression(input);
            } catch (err) {
                console.error('Error:', err.message);
            }
            runRepl();
        }
    });
}

