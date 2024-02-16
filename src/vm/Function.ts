import {Result} from "../ast/Type";
import {TypeStr} from "../ast/Type";
import {Context} from "./Context";

export abstract class Function {
    return: TypeStr;

    constructor(ret: TypeStr) {
        this.return = ret;
    }

    abstract eval(ctx: Context, args: Result[]): Result;
}
