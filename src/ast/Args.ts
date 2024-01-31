import {ASTNode} from "./Ast";
import {Result} from "vm/Eval";
import {Context} from 'vm/Context'
import {Expression} from "./Expression";

export class Args implements ASTNode {
    args: Expression[];

    addPair(pair: Expression) { this.args.push(pair); }
    addPairs(pairs: Expression[]) { this.args.push(...pairs); }

    eval(ctx: Context): Result {
        return new Result("Null");
    }
}
