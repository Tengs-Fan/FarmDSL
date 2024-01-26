import { ExprContext as progContext } from "../lang/FarmExprParser";
import FarmExprVisitor from '../lang/FarmExprVisitor';

class Result {

}

export class EvalVisitor extends FarmExprVisitor<Result> {

    defaultResult(): Result {
        console.log("defaultResult");
        return new Result();
    }

    visitProg = (ctx: progContext) => {
        // console.log(ctx);

        return new Result();
    }
}

export function evalProgram(tree: progContext) {
    const visitor = new EvalVisitor();
    visitor.visit(tree);
}

