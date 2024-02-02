import { Result } from "../ast/Type";
import { FunctionError } from "../Error";
import { TypeStr } from "../ast/Type";

export class Func {
    args: TypeStr[];
    return: TypeStr;
    func: Function;

    constructor(args: TypeStr[], ret: TypeStr, func: Function) {
        this.args = args; this.return = ret; this.func = func;
    }

    // Any argument mismatch will raise an error
    call(args: Result[]): Result {
        // Check argument count
        if (args.length !== this.args.length) {
            throw new FunctionError(`Argument count mismatch: expected ${this.args.length}, got ${args.length}`);
        }
        // Check each argument type
        for (let i = 0; i < args.length; i++) { 
            if (args[i].type !== this.args[i]) {
                throw new FunctionError(`Argument type mismatch: expected ${this.args[i]}, got ${args[i].type}`);
            }
        }
        const arg_value = args.map(arg => arg.value);

        return new Result(this.return, this.func(...arg_value));
    }
}
