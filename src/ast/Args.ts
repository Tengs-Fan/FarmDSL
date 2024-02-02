import {ASTNode} from "./Ast";
import {Result} from "./Type";
import {Expression} from "./Expression";

export class Args implements ASTNode {
    args: Expression[];

    constructor() { this.args = []; }
    addArg(pair: Expression) { this.args.push(pair); }
    addArgs(pairs: Expression[]) { this.args.push(...pairs); }

    eval(): Result {
        throw new Error("Should not eval Args, it is a list of expressions");
    }
}
