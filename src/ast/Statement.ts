import {ASTNode} from "./Ast";
import {Result} from "../Eval";
import {VirtualMachine} from "../vm/VirtualMachine";
import {Expression} from "./Expression";
import {Block} from "./Block";
import {Type} from "./Type";

export class ExprStatement implements ASTNode {
    expr : Expression;

    constructor(expr: Expression) { this.expr = expr; }

    eval(node: ExprStatement, vm: VirtualMachine): Result {
        return new Result();
    }
}

export class DeclStatment implements ASTNode {
    type : Type;
    name : string;    
    expr : Expression;  // Initialization value, can be EmptyExpression

    constructor(type: Type, name: string, expr: Expression) { this.type = type; this.name = name; this.expr = expr; }
    
    eval(node: DeclStatment, vm: VirtualMachine): Result {
        return new Result();
    }
}

export class AssignStatement implements ASTNode {
    name: string;
    expr: Expression;

    constructor(name: string, expr: Expression) { this.name = name; this.expr = expr; }

    eval(node: AssignStatement, vm: VirtualMachine): Result {
        return new Result();
    }
}

export class IfStatement implements ASTNode {
    cond: Expression;
    if_block: Block;
    else_block: Block;

    constructor(cond: Expression, if_block: Block, else_block: Block) { this.cond = cond; this.if_block = if_block; this.else_block = else_block; }

    eval(node: IfStatement, vm: VirtualMachine): Result {
        return new Result();
    }
}

type Tstatement = ExprStatement | DeclStatment | AssignStatement | IfStatement;

export class Statement implements ASTNode {
    stmt : Tstatement;
    setStatement(stmt: Tstatement) { this.stmt = stmt; }

    eval(node: Statement, vm: VirtualMachine): Result {
        switch (this.stmt.constructor.name) {

        }
        return new Result();
    }
}
