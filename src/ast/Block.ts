import {ASTNode} from "./Ast";
import {Result} from "../Eval";
import {VirtualMachine} from "../vm/VirtualMachine";
import {Statement} from "./Statement";

export class Block implements ASTNode { 
    stmts : Statement[];

    constructor() { this.stmts = []; }
    addStatement(stmt: Statement) { this.stmts.push(stmt); }
    addStatements(stmts: Statement[]) { this.stmts.push(...stmts); }

    eval(node: Block, vm: VirtualMachine): Result {

        return new Result();
    }
}
