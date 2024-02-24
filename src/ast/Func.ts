import {Result, TypeStr} from "./Type";
import {Context} from "../vm/Context";
import {ASTNode} from "./Ast";
import {Program} from "./Program";
import {FunctionError} from "../Error";
import {Function} from "../vm/Function";

export type FuncParam = [name: string, type: TypeStr];

export class Func extends Function implements ASTNode {
    name: string;
    params: FuncParam[];
    // In parent class: return: TypeStr;
    program: Program;

    constructor(name: string, params: FuncParam[], ret: TypeStr, program: Program) {
        super(ret);
        this.name = name;
        this.params = params;
        this.program = program;
    }

    eval(ctx: Context, args: Result[]): Result {
        const localContext = new Context(ctx);

        // Check argument count
        if (args.length !== this.params.length) {
            throw new FunctionError(`Argument count mismatch: expected ${this.params.length}, got ${args.length}`);
        }

        // Check each argument type
        for (let i = 0; i < args.length; i++) {
            const value = args[i].value;
            if (args[i].type !== this.params[i][1]) {
                throw new FunctionError(`Argument type mismatch: expected ${this.params[i][1]}, got ${args[i].type}`);
            }
            if (args[i].value === undefined) {
                throw new FunctionError(`Argument ${this.params[i][1]} value is null`);
            }
            localContext.newVariable(this.params[i][0], {type: this.params[i][1], value: value});
        }

        const result = this.program.eval(localContext);

        if (result.type !== this.return) {
            throw new FunctionError(`Return type mismatch: expected ${this.return}, got ${result.type}`);
        }

        return result;
    }
}
