import {ASTNode} from "./Ast";
import {Result} from "./Type";
import {Context} from "../vm/Context";
import {Statement} from "./Statement";

export class Block implements ASTNode {
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
        let lastResult = new Result("Null", null);
        this.stmts.forEach((stmt) => {
            if (stmt != undefined)
                lastResult = stmt.eval(ctx);
        });

        return lastResult;
    }
}
