import {ASTNode} from "./Ast";
import {Result} from "../Eval";
import {Context} from "../vm/Context";
import {Statement} from "./Statement";

export class Program implements ASTNode {
    stmts: Statement[];

    constructor() { this.stmts = []; }
    addStatement(stmt: Statement) { this.stmts.push(stmt); }
    addStatements(stmts: Statement[]) { this.stmts.push(...stmts); }

    eval(vm: Context): Result {

        // Run in repl mode
        if (this.stmts.length == 1) {
            return this.stmts[0].eval(vm);
        }
        else // Run in file mode, a program contains multiple statements
        {
            this.stmts.forEach(
                stmt => {
                    stmt.eval(stmt, vm);
                }
            )
            return new Result("Null");
        }

    }
}

