import {
    FuncContext,
    ProgContext,
    StmtContext,
    Decl_stmtContext,
    Expr_stmtContext,
    Assign_stmtContext,
    If_stmtContext,
    Loop_stmtContext,
    Return_stmtContext,
    ExprContext,
    Call_exprContext,
    ParameterContext,
    ArgsContext,
    PairsContext,
    PairContext,
} from "../../lang/FarmExprParser";
import FarmExprVisitor from "../../lang/FarmExprVisitor";
import FarmExprLexer from "../../lang/FarmExprLexer";
import {TerminalNode} from "antlr4";
import {ASTNode} from "../ast/Ast";
import {Program} from "../ast/Program";
import {Statement, ExprStatement, DeclStatment, AssignStatement, IfStatement, LoopStatement, ReturnStatement, Tstatement} from "../ast/Statement";
import {TypeStr} from "../ast/Type";
import {Expression, OOPCallExpression, CallExpression, BinaryExpression, ValueExpression, NameExpression} from "../ast/Expression";
import {Args} from "../ast/Args";
import {Pair, Pairs} from "../ast/Pairs";
import {Func, FuncParam} from "../ast/Func";
import {ParseError} from "../Error";
import {assert} from "console";

export class TransVisitor extends FarmExprVisitor<ASTNode> {
    defaultResult(): ASTNode {
        throw new ParseError("defaultResult should not be called");
    }

    visitFunc = (ctx: FuncContext) => {
        assert(ctx.getChild(0).getText() === "def", "Func should start with def");
        const name = ctx.getChild(1).getText();
        assert(ctx.getChild(2).getText() === "(", `Func parameter list should start with (`);

        const params: FuncParam[] = [];

        // Get all the parameters
        let i = 3;
        if (ctx.getChild(i).getText() !== ")") {
            for (; i < ctx.getChildCount(); i += 2) {
                if (!(ctx.getChild(i) instanceof ParameterContext)) {
                    throw new ParseError("Func parameter should be ParameterContext");
                } else {
                    const parameter = ctx.getChild(i) as ParameterContext;
                    const param: FuncParam = [parameter.getChild(0).getText() as string, parameter.getChild(2).getText() as TypeStr];
                    params.push(param);
                }

                if (ctx.getChild(i + 1).getText() === ")") {
                    break;
                }
            }
        } else {
            // If there is no parameter, i should be the index of ")"
            i -= 1;
        }

        assert(ctx.getChild(i + 1).getText() === ")", `Func parameter list should end with )`);

        // Get the return type
        let returnType: TypeStr = "Null";
        if (ctx.getChild(i + 2).getText() === "->") {
            returnType = ctx.getChild(i + 3).getText() as TypeStr;
            i += 3;
        } else {
            // If there is no return type, i should be the index of ")"
            i += 1;
        }

        assert(ctx.getChild(i + 1).getText() === "{", "Func body should start with {");
        assert(ctx.getChild(i + 3).getText() === "}", "Func body should end with }");

        const program = this.visit(ctx.getChild(i + 2)) as Program;
        return new Func(name, params, returnType, program);
    };

    visitParameter = (_ctx: ParameterContext) => {
        void _ctx; // Disable unused variable warning
        throw new Error("Do not call visitParameter, directly get the text");
    };

    visitProg = (ctx: ProgContext) => {
        const program = new Program();

        if (ctx.children === null) {
            return program;
        }

        for (const child of ctx.children) {
            if (child instanceof FuncContext) {
                const func = this.visitFunc(child);
                program.addFunction(func);
            } else if (child instanceof StmtContext) {
                const stmt = this.visitStmt(child);
                program.addStatement(stmt);
            } else {
                throw new Error(`Unknown child type ${child.constructor.name}`);
            }
        }

        return program;
    };

    // Statement
    visitStmt = (ctx: StmtContext) => {
        // Can only have one child
        if (ctx.getChildCount() !== 1) {
            throw new ParseError("Stmt should have only one child");
        }

        const stmt = this.visit(ctx.getChild(0)) as Tstatement;

        return new Statement(stmt);
    };

    // Declararion:
    // Num x = 1; Farm y;
    visitDecl_stmt = (ctx: Decl_stmtContext) => {
        // Exmaple: Num x = 1;
        // child0: "Num", child1: "x", child2: "=", child3: "1", child4: ";"
        // Exmaple: Farm y;
        // child0: "Farm", child1: "y", child2: ";"
        // Example: Farm myFarm = [Name: "myFarm", Area: 1200];
        // child0: "Farm", child1: "myFarm", child2: "=",  child3: [Name: "myFarm", Area: 1200], child4: ;

        const type = ctx.getChild(0).getText() as TypeStr;
        const name = ctx.getChild(1).getText();

        // If there is no initialization, expr is Null
        let value = new Expression("Null") as Expression | Pairs;

        // assert(ctx.children.length === 2 || ctx.children.length === 4, "Decl_stmt should have 2 or 5 children");
        switch (ctx.getChildCount()) {
            // Num x = 1;
            case 3:
                break;
            case 5:
                if (ctx.getChild(3) instanceof ExprContext) {
                    value = this.visit(ctx.getChild(3)) as Expression;
                } else {
                    // instanceof ArgsContext
                    value = this.visit(ctx.getChild(3)) as Pairs;
                }
                break;
            default:
                throw new Error(`Decl_stmt should have 3 or 5 children, but got ${ctx.getChildCount()}`);
        }

        return new DeclStatment(type, name, value);
    };

    // Single expression, it does not have any side effect (do not change the virtual machine at all)
    visitExpr_stmt = (ctx: Expr_stmtContext) => {
        const expr = this.visit(ctx.getChild(0)) as Expression;
        return new ExprStatement(expr);
    };

    // Assignment:
    // x = 1; a = f(x);
    visitAssign_stmt = (ctx: Assign_stmtContext) => {
        const name = ctx.getChild(0).getText();
        const expr = this.visit(ctx.getChild(2)) as Expression;

        return new AssignStatement(name, expr);
    };

    // If statement
    // if (x) { ... } else { ... }
    visitIf_stmt = (ctx: If_stmtContext) => {
        // Example: if (x) { ... }
        // child0: "if", child1: "x", child2: ...
        // Example: if (x) { ... } else { ... }
        // child0: "if", child1: "x", child2: ... , child3: "else", child4: ...

        const condition = this.visit(ctx.getChild(1)) as Expression;
        assert(ctx.getChild(2).getText() === "{");
        const if_block = this.visit(ctx.getChild(3)) as Program;
        assert(ctx.getChild(4).getText() === "{");
        let else_block = new Program();

        if (ctx.getChildCount() === 9) {
            assert(ctx.getChild(5).getText() === "else");
            assert(ctx.getChild(6).getText() === "{");
            else_block = this.visit(ctx.getChild(7)) as Program;
            assert(ctx.getChild(8).getText() === "}");
        }

        const ifstmt = new IfStatement(condition, if_block, else_block);
        return ifstmt;
    };

    visitLoop_stmt = (ctx: Loop_stmtContext) => {
        if (ctx.getChildCount() < 5) {
            throw new ParseError("Loop_stmt should have at least 5 children");
        }

        const current = ctx.getChild(1).getText();
        const loopable = this.visit(ctx.getChild(3)) as Expression;
        const loop = new LoopStatement(current, loopable);
        void loop; // Disable unused variable warning

        throw new Error("Not implemented yet");
    };

    visitReturn_stmt = (ctx: Return_stmtContext) => {
        if (ctx.getChild(0).getText() !== "return") {
            throw new ParseError("Return_stmt should start with return");
        }

        const expr = this.visit(ctx.getChild(1)) as Expression;

        return new ReturnStatement(expr);
    };

    visitExpr = (ctx: ExprContext) => {
        switch (ctx.getChildCount()) {
            // 1. Expr op Expr        op: +, -, *, /, >, >=, <, <=, ==, !=
            // 2. ( Expr )            wrapped by ()
            // 3. name(Args)          function call
            // 4. Expr . name(Args)   OOP function call
            case 3: {
                // ( Expr )
                if (ctx.getChild(0).getText() === "(") {
                    assert(ctx.getChild(2).getText() === ")", "Expr should be wrapped by ()");
                    return this.visit(ctx.getChild(1)) as Expression;
                }

                // Expr op Expr
                const left = this.visit(ctx.getChild(0)) as Expression;
                const right = this.visit(ctx.getChild(2)) as Expression;
                const op = ctx.getChild(1).getText();
                switch (op) {
                    case "+":
                        return new BinaryExpression("Add", left, right);
                    case "-":
                        return new BinaryExpression("Sub", left, right);
                    case "*":
                        return new BinaryExpression("Mul", left, right);
                    case "/":
                        return new BinaryExpression("Div", left, right);
                    case ">":
                        return new BinaryExpression("Gt", left, right);
                    case ">=":
                        return new BinaryExpression("Gte", left, right);
                    case "<":
                        return new BinaryExpression("Lt", left, right);
                    case "<=":
                        return new BinaryExpression("Lte", left, right);
                    case "==":
                        return new BinaryExpression("Eq", left, right);
                    case "!=":
                        return new BinaryExpression("Neq", left, right);
                    case ".":
                        if (!(right instanceof CallExpression)) throw new Error("Right expression should be CallExpression");
                        return new OOPCallExpression(left, (right as CallExpression).name, (right as CallExpression).args);
                    default:
                        throw new Error(`Unknown operator ${op}`);
                }
            }
            // value
            // Call name(Args)
            case 1: {
                const child = ctx.getChild(0);
                // value
                if (child instanceof TerminalNode) {
                    switch (child.symbol.type) {
                        case FarmExprLexer.BOOL:
                            return new ValueExpression("Bool", child.getText() === "true");
                        case FarmExprLexer.FLOAT:
                            return new ValueExpression("Num", parseFloat(child.getText()));
                        case FarmExprLexer.INT:
                            return new ValueExpression("Num", parseInt(child.getText()));
                        case FarmExprLexer.STRING: {
                            const unquotedString: string = child.getText().replace(/^"|"$/g, "");
                            return new ValueExpression("String", unquotedString);
                        }
                        case FarmExprLexer.NAME:
                            return new NameExpression(child.getText());
                        default:
                            throw new Error(`Unknown value type ${ctx.getText()}`);
                    }
                }
                // Call name(Args)
                return this.visit(ctx.getChild(0)) as CallExpression;
            }
            default:
                throw new Error(`Unknown expression ${ctx.getText()}`);
        }
    };

    visitCall_expr = (ctx: Call_exprContext) => {
        // Name of the function
        const name = ctx.getChild(0).getText();
        if (ctx.getChildCount() === 4) {
            // Witharguments
            if (ctx.getChild(1).getText() !== "(" && ctx.getChild(3).getText() !== ")") {
                throw new ParseError("Call_expr should have ( and )");
            }
            const args = this.visit(ctx.getChild(2)) as Args;
            return new CallExpression(name, args.args);
        } // Without arguments
        else {
            if (ctx.getChild(1).getText() !== "(" && ctx.getChild(2).getText() !== ")") {
                throw new ParseError("Call_expr should have ( and )");
            }
            return new CallExpression(name, [] as Expression[]);
        }
    };

    // Args: (a, b, c), used in function call
    // composed of multiple expressions
    visitArgs = (ctx: ArgsContext) => {
        const args = new Args();

        // it has "," between each expression
        for (let i = 0; i < ctx.getChildCount(); i += 2) {
            const arg = this.visit(ctx.getChild(i)) as Expression;
            // if (ctx.children[i + 1].getText() !== ",") throw new Error("Args shoule be separated by ,");
            args.addArg(arg);
        }
        return args;
    };

    // Pairs: [Name: "myFarm", Area: 1200]
    // composed of multiple pairs
    visitPairs = (ctx: PairsContext) => {
        const pairs = new Pairs();

        for (let i = 1; i < ctx.getChildCount(); i += 2) {
            const pair = this.visit(ctx.getChild(i)) as Pair;
            // if (ctx.children[i + 1].getText() !== ",") throw new Error("Args shoule be separated by ,");
            pairs.addPair(pair);
        }
        return pairs;
    };

    // Pair: Name: "myFarm"
    // composed of a name and a value (expression)
    visitPair = (ctx: PairContext) => {
        const name = ctx.getChild(0).getText();
        const value = this.visit(ctx.getChild(2)) as Expression;
        return new Pair(name, value);
    };
}

export function transProgram(tree: ProgContext, verbose = false): Program {
    const visitor = new TransVisitor();
    const AST = visitor.visit(tree);

    if (verbose) {
        console.log(AST);
    }

    return AST as Program;
}
