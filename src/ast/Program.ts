import {Result} from "./Type";
import {Context} from "../vm/Context";
import {ASTNode} from "./Ast";
import {Statement} from "./Statement";

export class Program implements ASTNode {
    stmts: Statement[];

    constructor() {
        this.stmts = [];
    }
    addStatement(stmt: Statement) {
        this.stmts.push(stmt);
    }
    addStatements(stmts: Statement[]) {
        this.stmts.push(...stmts);
    }

    eval(ctx: Context): Result {
        // Register all functions
        // TODO: this would be ok since the root program is only evaluated once,
        // but if we have a program that can be evaluated multiple times, it will
        // thow an error since the function is already registered

        let lastResult = new Result("Null", null);

        this.stmts.forEach((stmt) => {
            lastResult = stmt.eval(ctx);
        });

        return lastResult;
    }
}
