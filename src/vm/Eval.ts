import {Program} from "../ast/Program";
import {getRootContext} from "../vm/Context";
import {Result} from "../ast/Type";

export function evalProgram(prog: Program, ctx = getRootContext()): Result {
    const result = prog.eval(ctx);
    return result;
}
