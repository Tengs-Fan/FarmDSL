import {ASTNode} from "./Ast";
import {Result} from "../Eval";
import {Context} from '../vm/Context'
import {ExprType} from "./Type";
import { assert } from "console";

export class Expression implements ASTNode {
    type: ExprType;

    constructor(type: ExprType) { this.type = type; }

    eval(vm: Context): Result {
        return new Result("Expression");
    }
}

export class AddExpression extends Expression {
    left: Expression;
    right: Expression;

    constructor(type: ExprType, left: Expression, right: Expression) { super(type); this.left = left; this.right = right; }

    eval(vm: Context): Result {
        return new Result("Expression");
    }
}

export class SubExpression extends Expression {
    left: Expression;
    right: Expression;
    constructor(type: ExprType, left: Expression, right: Expression) { super(type); this.left = left; this.right = right; }
    eval(ctx: Context): Result {
        return new Result();
    }
}

export class MulExpression extends Expression {
    left: Expression;
    right: Expression;
    constructor(type: ExprType, left: Expression, right: Expression) { super(type); this.left = left; this.right = right; }
    eval(vm: Context): Result {
        return new Result();
    }
}

export class DivExpression extends Expression {
    left: Expression;
    right: Expression;
    constructor(type: ExprType, left: Expression, right: Expression) { super(type); this.left = left; this.right = right; }
    eval(vm: Context): Result {
        return new Result();
    }
}

