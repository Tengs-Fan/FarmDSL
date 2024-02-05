import {Program} from "../ast/Program";
import {g_context} from "../vm/Context";
import {Result} from "../ast/Type";

export function evalProgram(prog: Program): Result {
    const result = prog.eval(g_context);
    return result;
}
