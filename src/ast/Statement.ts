import {Result} from "vm/Eval";
import {Context} from "vm/Context";
import {ASTNode} from "./Ast";
import {Variable} from "vm/Variable";

import {Expression} from "./Expression";
import {Block} from "./Block";
import {Type} from "./Type";

export class ExprStatement implements ASTNode {
    expr : Expression;

    constructor(expr: Expression) { this.expr = expr; }

    eval(vm: Context): Result {
        return this.expr.eval(vm);
    }
}

export class DeclStatment implements ASTNode {
    type : Type;
    name : string;    
    expr : Expression;  // Initialization value, can be EmptyExpression

    constructor(type: Type, name: string, expr: Expression) { this.type = type; this.name = name; this.expr = expr; }
    
    eval(ctx: Context): Result {
        const exprResult = this.expr.eval(ctx);
        const variable: Variable = {
            type: this.type,
            value: exprResult.value 
        };
        ctx.newVariable(this.name, variable);

        // It is totally a side effect to create a new variable in the VM
        return new Result("Null"); 
    }
}

export class AssignStatement implements ASTNode {
    name: string;
    expr: Expression;

    constructor(name: string, expr: Expression) { this.name = name; this.expr = expr; }

    eval(ctx: Context): Result {
        const exprResult = this.expr.eval(ctx);
        const newValue = exprResult.value;
        ctx.updateVariable(this.name, newValue);

        // Update the variable in the VM is a side effect
        return new Result("Null");
    }
}

export class IfStatement implements ASTNode {
    cond: Expression;
    if_block: Block;
    else_block: Block;

    constructor(cond: Expression, if_block: Block, else_block: Block) { this.cond = cond; this.if_block = if_block; this.else_block = else_block; }

    eval(vm: Context): Result {
        const exprResult = this.cond.eval(vm);
        if (exprResult.type !== "Bool") {
            throw new Error("Condition expression should be a boolean");
        }

        //TODO: here we face a choice, should we make the change in the block global ?
        if (exprResult.value) {
            this.if_block.eval(vm);
        } else {
            this.else_block.eval(vm);
        }

        return new Result("Null");
    }
}

type Tstatement = ExprStatement | DeclStatment | AssignStatement | IfStatement;

export class Statement implements ASTNode {
    stmt : Tstatement;
    setStatement(stmt: Tstatement) { this.stmt = stmt; }

    eval(ctx: Context): Result {
        return this.stmt.eval(ctx);
    }
}
