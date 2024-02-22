import {Result} from "./Type";
import {Context} from "../vm/Context";
import {ASTNode} from "./Ast";
import {Statement, ReturnStatement} from "./Statement";
import {Func} from "./Func";

export class Program implements ASTNode {
    stmts: Statement[];
    funcs: Func[];

    constructor() {
        this.stmts = [];
        this.funcs = [];
    }
    addStatement(stmt: Statement) {
        this.stmts.push(stmt);
    }
    addStatements(stmts: Statement[]) {
        this.stmts.push(...stmts);
    }
    addFunction(func: Func) {
        this.funcs.push(func);
    }

    eval(ctx: Context): Result {
        // Register all functions
        // TODO: this would be ok since the root program is only evaluated once,
        // but if we have a program that can be evaluated multiple times, it will
        // thow an error since the function is already registered
        this.funcs.forEach((func) => {
            ctx.newFunction(func.name, func);
        });

        let lastResult = new Result("Null", null);

        this.stmts.forEach((stmt) => {
            if (stmt instanceof ReturnStatement) {
                return stmt.eval(ctx);
            }
            lastResult = stmt.eval(ctx);
        });

        return lastResult;
    }
}
