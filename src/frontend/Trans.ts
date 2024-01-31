import { ProgContext,
    StmtContext, Decl_stmtContext, Expr_stmtContext, Assign_stmtContext, If_stmtContext, 
    ExprContext,
    BlockContext,
    ArgsContext,
    PairsContext, PairContext
} from "lang/FarmExprParser";
import FarmExprVisitor from 'lang/FarmExprVisitor';
import FarmExprLexer from "lang/FarmExprLexer";
import { TerminalNode } from "antlr4/";
import { ASTNode } from 'ast/Ast';
import { Program } from 'ast/Program';
import { Statement, ExprStatement, DeclStatment, AssignStatement, IfStatement, Tstatement } from 'ast/Statement';
import { Block } from 'ast/Block';
import { Type } from 'ast/Type';
import { Expression, BinaryExpression, ValueExpression, NameExpression } from 'ast/Expression';
import { Args } from 'ast/Args';
import { Pair, Pairs } from 'ast/Pairs';
import { assert } from "console";


export class TransVisitor extends FarmExprVisitor<ASTNode> {

    defaultResult(): ASTNode {
        console.log("defaultResult");
        return new Program();
    }

    visitProg = (ctx: ProgContext) => {
        const program = new Program();

        const statements = this.visitChildren(ctx) as unknown as Statement[];
        program.addStatements(statements);

        return program;
    }

    visitBlock = (ctx: BlockContext) => {
        const block = new Block();

        const stmts = this.visitChildren(ctx) as unknown as Statement[];
        block.addStatements(stmts);

        return block;
    }
    
    // Statement
    visitStmt = (ctx: StmtContext) => {
        const statement = new Statement();

        // Can only have one child
        const stmt = this.visitChildren(ctx) as unknown as Tstatement[]
        statement.setStatement(stmt[0]);

        return statement;
    }

    // Declararion:
    // Num x = 1; Farm y;
    visitDecl_stmt = (ctx: Decl_stmtContext) => {
        // Exmaple: Num x = 1; 
        // child0: "Num", child1: "x", child2: "=", child3: "1", child4: ";"
        // Exmaple: Farm y;
        // child0: "Farm", child1: "y", child2: ";"
        // Example: Farm myFarm = [Name: "myFarm", Area: 1200];
        // child0: "Farm", child1: "myFarm", child2: "=",  child3: [Name: "myFarm", Area: 1200], child4: ; 

        const type = ctx.children[0].getText() as Type;
        const name = ctx.children[1].getText();

        // If there is no initialization, expr is Null
        let value = new Expression("Null") as Expression | Args;

        // assert(ctx.children.length === 2 || ctx.children.length === 4, "Decl_stmt should have 2 or 5 children");
        switch (ctx.children.length) {
            // Num x = 1;
            case 3: break;
            case 5:
                if (ctx.children[3] instanceof ExprContext) {
                    value = this.visit(ctx.children[3]) as Expression;
                } else {  // instanceof ArgsContext
                    value = this.visit(ctx.children[3]) as Args; 
                }
                break;
            default: throw new Error(`Decl_stmt should have 3 or 5 children, but got ${ctx.children.length}`);
        }

        return new DeclStatment(type, name, value);
    }

    // Single expression, it does not have any side effect (do not change the virtual machine at all)
    visitExpr_stmt = (ctx: Expr_stmtContext) => {
        const expr = this.visit(ctx.children[0]) as Expression;
        return new ExprStatement(expr);
    }

    // Assignment:
    // x = 1; a = f(x);
    visitAssign_stmt = (ctx: Assign_stmtContext) => {
        const name = ctx.children[0].getText();
        const expr = this.visit(ctx.children[2]) as Expression;

        return new AssignStatement(name, expr);
    }

    // If statement
    // if (x) { ... } else { ... }
    visitIf_stmt = (ctx: If_stmtContext) => {
        // Example: if (x) { ... }
        // child0: "if", child1: "x", child2: ... 
        // Example: if (x) { ... } else { ... }
        // child0: "if", child1: "x", child2: ... , child3: "else", child4: ... 
        
        const condition = this.visit(ctx.children[1]) as Expression;
        const if_block = this.visit(ctx.children[2]) as Block;
        let else_block = new Block();

        if (ctx.children.length === 4) {
            else_block = this.visit(ctx.children[4]) as Block;
        }

        const ifstmt = new IfStatement(condition, if_block, else_block);
        return ifstmt;
    }

    visitExpr = (ctx: ExprContext) => {
        switch (ctx.getChildCount()){
            // 1. Expr op Expr
            // 2. ( Expr )
            case 3: {
                // ( Expr )
                if (ctx.children[0].getText() === "(") {
                    assert(ctx.children[2].getText() === ")", "Expr should be wrapped by ()");
                    return this.visit(ctx.children[1]) as Expression;
                }

                // Expr op Expr
                const left  = this.visit(ctx.children[0]) as Expression;
                const right = this.visit(ctx.children[2]) as Expression;
                const op = ctx.children[1].getText();
                switch (op) {
                    case "+": return new BinaryExpression("Add", left, right);
                    case "-": return new BinaryExpression("Sub", left, right);
                    case "*": return new BinaryExpression("Mul", left, right);
                    case "/": return new BinaryExpression("Div", left, right);
                    case ">": return new BinaryExpression("Gt", left, right);
                    case ">=": return new BinaryExpression("Gte", left, right);
                    case "<":  return new BinaryExpression("Lt", left, right);
                    case "<=": return new BinaryExpression("Lte", left, right);
                    case "==": return new BinaryExpression("Eq", left, right);
                    case "!=": return new BinaryExpression("Neq", left, right);
                    default: throw new Error(`Unknown operator ${op}`);
                }
            }
            // value
            case 1: {
                const child = ctx.children[0] as TerminalNode;
                switch (child.symbol.type) {
                    case FarmExprLexer.BOOL:   return new ValueExpression("Bool", child.getText() === "true");
                    case FarmExprLexer.FLOAT:  return new ValueExpression("Num", parseFloat(child.getText()));
                    case FarmExprLexer.INT:    return new ValueExpression("Num", parseInt(child.getText()));
                    case FarmExprLexer.STRING: return new ValueExpression("String", child.getText());
                    case FarmExprLexer.NAME:   return new NameExpression(child.getText());
                    default: throw new Error(`Unknown value type ${ctx.getText()}`);
                }
            }
            default: throw new Error(`Unknown expression ${ctx.getText()}`);
        }
    }

    // Args: (a, b, c), used in function call
    // composed of multiple expressions
    visitArgs = (ctx: ArgsContext) => {
        const args = new Args();
        const all_args = this.visitChildren(ctx) as unknown as Expression[];
        args.addPairs(all_args);
        return args;
    }

    // Pairs: [Name: "myFarm", Area: 1200]
    // composed of multiple pairs
    visitPairs = (ctx: PairsContext) => {
        const pairs = new Pairs();
        const all_pairs = this.visitChildren(ctx) as unknown as Pair[];
        pairs.addPairs(all_pairs);
        return pairs; 
    }

    // Pair: Name: "myFarm"
    // composed of a name and a value (expression)
    visitPair = (ctx: PairContext) => {
        const name = ctx.children[0].getText();
        const value = this.visit(ctx.children[2]) as Expression;
        return new Pair(name, value);
    }
}

export function transProgram(tree: ProgContext, verbose = false): Program {
    const visitor = new TransVisitor();
    const AST = visitor.visit(tree);

    if (verbose) {
        console.log(AST);
    }

    return AST as Program;
}

