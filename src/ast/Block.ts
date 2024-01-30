import {ASTNode} from "./Ast";
import {Result} from "../Eval";
import {Context} from '../vm/Context'
import {Statement} from "./Statement";

export class Block implements ASTNode { 
    stmts : Statement[];

    constructor() { this.stmts = []; }
    addStatement(stmt: Statement) { this.stmts.push(stmt); }
    addStatements(stmts: Statement[]) { this.stmts.push(...stmts); }

    eval(vm: Context): Result {

        return new Result("Null");
    }
}
