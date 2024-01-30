import {ASTNode} from "./Ast";
import {Result} from "../Eval";
import {VirtualMachine} from "../vm/VirtualMachine";
import {ExprType} from "./Type";

export class Expression implements ASTNode {
    type: ExprType;

    constructor(type: ExprType) { this.type = type; }

    eval(node: Expression, vm: VirtualMachine): Result {
        return new Result();
    }
}

export class AddExpression extends Expression {
    left: Expression;
    right: Expression;

    constructor(type: ExprType, left: Expression, right: Expression) { super(type); this.left = left; this.right = right; }

    eval(node: AddExpression, vm: VirtualMachine): Result {
        return new Result();
    }
}

export class SubExpression extends Expression {
    left: Expression;
    right: Expression;
    constructor(type: ExprType, left: Expression, right: Expression) { super(type); this.left = left; this.right = right; }
    eval(node: SubExpression, vm: VirtualMachine): Result {
        return new Result();
    }
}

export class MulExpression extends Expression {
    left: Expression;
    right: Expression;
    constructor(type: ExprType, left: Expression, right: Expression) { super(type); this.left = left; this.right = right; }
    eval(node: MulExpression, vm: VirtualMachine): Result {
        return new Result();
    }
}

export class DivExpression extends Expression {
    left: Expression;
    right: Expression;
    constructor(type: ExprType, left: Expression, right: Expression) { super(type); this.left = left; this.right = right; }
    eval(node: DivExpression, vm: VirtualMachine): Result {
        return new Result();
    }
}

