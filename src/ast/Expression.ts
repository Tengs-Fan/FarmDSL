import {ASTNode} from "./Ast";
import {Result} from "vm/Eval";
import {Context} from '../vm/Context'
import {ExprType} from "./Type";
import {ExprError} from "../Error";

export class Expression implements ASTNode {
    type: ExprType;

    constructor(type: ExprType) { this.type = type; }

    eval(vm: Context): Result {
        return new Result("Null");
    }
}

export class NameExpression extends Expression {
    name: string;
    constructor(name: string) { super("Name"); this.name = name; }
    eval(ctx: Context): Result {
        const value = ctx.getVariable(this.name);
        switch (value.type) {
            case "Num":
            case "Bool":
            case "Farm":
            case "Crop": return new Result(value.type, value.value);
            default: throw new ExprError("Unknown variable type: " + value.type);
        }
    }
}

export class ValueExpression extends Expression {
    value: boolean | number | string;
    constructor(type: ExprType, value: boolean | number | string) { super(type); this.value = value; }
    eval(vm: Context): Result {
        switch (this.type) {
            case "Bool":    return new Result("Bool",  this.value as boolean);
            case "Num":     return new Result("Num",   this.value as number);
            case "String":  return new Result("String", this.value as string);
            default: throw new ExprError("Unknown value expression type: " + this.type);
        }
    }
}

export class BinaryExpression extends Expression {
    left: Expression;
    right: Expression;

    constructor(type: ExprType, left: Expression, right: Expression) { super(type); this.left = left; this.right = right; }

    eval(vm: Context): Result {
        const leftResult = this.left.eval(vm);
        const rightResult = this.right.eval(vm);

        if (leftResult.type !== rightResult.type) {
            throw new ExprError("Binary expression should have same type on both sides");
        }

        switch (this.type) {
            case "Add": return new Result("Num", leftResult.value + rightResult.value);
            case "Sub": return new Result("Num", leftResult.value - rightResult.value);
            case "Mul": return new Result("Num", leftResult.value * rightResult.value);
            case "Div": return new Result("Num", leftResult.value / rightResult.value);
            case "Eq":  return new Result("Bool", leftResult.value === rightResult.value);
            case "Neq": return new Result("Bool", leftResult.value !== rightResult.value);
            case "Gt":  return new Result("Bool", leftResult.value > rightResult.value);
            case "Gte": return new Result("Bool", leftResult.value >= rightResult.value);
            case "Lt":  return new Result("Bool", leftResult.value < rightResult.value);
            case "Lte": return new Result("Bool", leftResult.value <= rightResult.value);
            default: throw new ExprError("Unknown binary expression type: " + this.type);
        }
    }
}

