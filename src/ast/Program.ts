import {Result} from "./Type";
import {Context} from "vm/Context";
import {ASTNode} from "./Ast";
import {Statement} from "./Statement";

export class Program implements ASTNode {
    stmts: Statement[];
    local_context : Context;

    constructor() { this.stmts = []; this.local_context = new Context(); }
    addStatement(stmt: Statement) { this.stmts.push(stmt); }
    addStatements(stmts: Statement[]) { this.stmts.push(...stmts); }

    eval(ctx: Context): Result {
        let lastResult = new Result("Null");

        this.stmts.forEach(
            stmt => {
                lastResult = stmt.eval(ctx);
            }
        )

        return lastResult;
    }
}

