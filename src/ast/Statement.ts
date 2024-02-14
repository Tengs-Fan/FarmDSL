import {Result} from "./Type";
import {Context} from "../vm/Context";
import {ASTNode} from "./Ast";
import {Variable} from "../vm/Variable";
import {Type, TypeStr} from "./Type";

import {Expression} from "./Expression";
import {Pairs} from "./Pairs";
import {Program} from "./Program";

import {assert} from "console";

export class ExprStatement implements ASTNode {
    expr: Expression;

    constructor(expr: Expression) {
        this.expr = expr;
    }

    eval(vm: Context): Result {
        return this.expr.eval(vm);
    }
}

export class DeclStatment implements ASTNode {
    type: TypeStr;
    name: string;
    initValue: Expression | Pairs; // Initialization value, can be EmptyExpression

    constructor(type: TypeStr, name: string, expr: Expression | Pairs) {
        this.type = type;
        this.name = name;
        this.initValue = expr;
    }

    eval(ctx: Context): Result {
        let value: Result;
        if (this.initValue instanceof Pairs) {
            switch (this.type) {
                case "Farm":
                    value = this.initValue.eval(ctx, "Farm");
                    break;
                case "Crop":
                    value = this.initValue.eval(ctx, "Crop");
                    break;
                default:
                    throw new Error(`Unkown type of variable ${this.name}`);
            }
        } else {
            assert(this.initValue instanceof Expression, "Initialization value should be an expression");
            value = this.initValue.eval(ctx);
        }

        const variable: Variable = {
            type: this.type,
            value: value.value as Type,
        };
        ctx.newVariable(this.name, variable);

        // It is totally a side effect to create a new variable in the VM
        return new Result("Null", null);
    }
}

export class AssignStatement implements ASTNode {
    name: string;
    expr: Expression;

    constructor(name: string, expr: Expression) {
        this.name = name;
        this.expr = expr;
    }

    eval(ctx: Context): Result {
        const exprResult = this.expr.eval(ctx);
        const newValue = exprResult.value;
        if (newValue !== undefined) {
            ctx.updateVariable(this.name, newValue);
        }

        // Update the variable in the VM is a side effect
        return new Result("Null", null);
    }
}

export class IfStatement implements ASTNode {
    cond: Expression;
    if_block: Program;
    else_block: Program;

    constructor(cond: Expression, if_block: Program, else_block: Program) {
        this.cond = cond;
        this.if_block = if_block;
        this.else_block = else_block;
    }

    eval(ctx: Context): Result {
        const exprResult = this.cond.eval(ctx);
        if (exprResult.type !== "Bool") {
            throw new Error("Condition expression should be a boolean");
        }

        //TODO: here we face a choice, should we make the change in the block global ?
        if (exprResult.value) {
            this.if_block.eval(ctx);
        } else {
            this.else_block.eval(ctx);
        }

        return new Result("Null", null);
    }
}

export class LoopStatement implements ASTNode {
    current: string; // Name of the current variable
    loopable: Expression;

    constructor(current: string, loopable: Expression) {
        this.current = current;
        this.loopable = loopable;
    }

    eval(_ctx: Context): Result {
        void _ctx; // Disable unused variable warning
        throw new Error("Method not implemented.");
    }
}

export class ReturnStatement implements ASTNode {
    value: Expression;

    constructor(value: Expression) {
        this.value = value;
    }

    eval(ctx: Context): Result {
        return this.value.eval(ctx);
    }
}

export type Tstatement = ExprStatement | DeclStatment | AssignStatement | IfStatement | LoopStatement | ReturnStatement;

export class Statement implements ASTNode {
    stmt: Tstatement;
    constructor(stmt: Tstatement) {
        this.stmt = stmt;
    }

    eval(ctx: Context): Result {
        return this.stmt.eval(ctx);
    }
}
