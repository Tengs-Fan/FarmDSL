import {ASTNode} from "./Ast";
import {Result} from "./Type";
import {Context} from '../vm/Context'
import {Type, ExprTypeStr} from "./Type";
import {ExprError} from "../Error";

export class Expression implements ASTNode {
    type: ExprTypeStr;

    constructor(type: ExprTypeStr = "Null") { this.type = type; }
    eval(_ctx: Context): Result {
        throw new Error("Should not eval Expression directly, use subtypes");
    }
}

export class CallExpression extends Expression {
    name: string;
    args: Expression[];

    constructor(name: string, args: Expression[]) { super(); this.name = name; this.args = args; }

    eval(ctx: Context): Result {
        const func = ctx.getFunction(this.name);
        const evaluated_args: Result[] = [];

        this.args.forEach(arg => {
            const result: Result = arg.eval(ctx);
            evaluated_args.push(result);
        });

        return func.call(evaluated_args);
    }
}

export class NameExpression extends Expression {
    name: string;
    constructor(name: string) { super(); this.name = name; }
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
    constructor(type: ExprTypeStr, value: boolean | number | string) { super(type); this.value = value; }
    eval(_ctx: Context): Result {
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

    constructor(type: ExprTypeStr, left: Expression, right: Expression) { super(type); this.left = left; this.right = right; }

    eval(vm: Context): Result {
        const leftResult = this.left.eval(vm);
        const rightResult = this.right.eval(vm);

        if (leftResult.type !== rightResult.type) {
            throw new ExprError("Binary expression should have same type on both sides");
        }

        if (leftResult.value == null || rightResult.value == null) {
            throw new ExprError("Binary expression values must not be null");
        }

        switch (this.type) {
            case "Add": return new Result("Num", leftResult.value as number + (rightResult.value as number));
            case "Sub": return new Result("Num", leftResult.value as number - (rightResult.value as number));
            case "Mul": return new Result("Num", leftResult.value as number * (rightResult.value as number));
            case "Div": return new Result("Num", leftResult.value as number / (rightResult.value as number));
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

