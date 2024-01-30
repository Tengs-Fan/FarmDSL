import {ASTNode} from "./Ast";
import {Result} from "../Eval";
import {VirtualMachine} from "../vm/VirtualMachine";
import {Statement} from "./Statement";

export class Program implements ASTNode {
    stmts: Statement[];

    constructor() { this.stmts = []; }
    addStatement(stmt: Statement) { this.stmts.push(stmt); }
    addStatements(stmts: Statement[]) { this.stmts.push(...stmts); }

    eval(node: Program, vm: VirtualMachine): Result {
        this.stmts.forEach(
            stmt => {
                console.log(stmt);
            }
        )

        return new Result();
    }
}

