import {Result} from "vm/Eval";
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

        // Run in repl mode, a program contains only one statement
        if (this.stmts.length == 1) {
            return this.stmts[0].eval(ctx);
        }
        else // Run in file mode, a program contains multiple statements
        {
            this.stmts.forEach(
                stmt => {
                    stmt.eval(ctx);
                }
            )
            return new Result("Null");
        }

    }
}

