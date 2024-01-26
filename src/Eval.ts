import { ExprContext } from "../lang/FarmExprParser";
import FarmExprVisitor from '../lang/FarmExprVisitor';

class Result {

}

export class EvalVisitor extends FarmExprVisitor<Result> {

    defaultResult(): Result {
        console.log("defaultResult");
        return new Result();
    }

    visitExpr = (ctx: ExprContext) => {
        // Your implementation here
        // console.log(ctx);

        return new Result();
    }
}

export function evalStatement(tree: ExprContext) {
    const visitor = new EvalVisitor();
    visitor.visit(tree);
}

