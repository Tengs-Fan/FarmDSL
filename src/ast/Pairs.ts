import {ASTNode} from "./Ast";
import {Result} from "vm/Eval";
import {Context} from 'vm/Context'
import {Type} from "./Type";
import {Expression} from "./Expression";

export class Pair implements ASTNode {
    name: string;
    value: Expression;

    constructor(name: string, value: Expression) { this.name = name; this.value = value; }

    eval(ctx: Context): Result {
        return this.value.eval(ctx);
    }
}

export class Pairs implements ASTNode {
    pairs: Pair[];

    constructor() { this.pairs = []; }

    addPair(pair: Pair) { this.pairs.push(pair); }
    addPairs(pairs: Pair[]) { this.pairs.push(...pairs); }

    eval(ctx: Context): Result {
        return new Result("Null");
    }
}
