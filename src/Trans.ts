import { ProgContext,
    StmtContext, Decl_stmtContext, Expr_stmtContext, Assign_stmtContext, If_stmtContext, 
    ExprContext,
    BlockContext
} from "../lang/FarmExprParser";
import FarmExprVisitor from '../lang/FarmExprVisitor';
import { ASTNode } from './ast/Ast';
import { Program } from './ast/Program';
import { Statement, ExprStatement, DeclStatment, AssignStatement, IfStatement } from './ast/Statement';
import { Block } from './ast/Block';
import { Type } from './ast/Type';
import { Expression } from './ast/Expression';


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
        const stmt = this.visitChildren(ctx) as unknown as Statement[]
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

        const type = ctx.children[0].getText() as Type;
        const name = ctx.children[1].getText();

        // If there is no initialization, expr is Null
        let expr = new Expression("Null"); 

        // assert(ctx.children.length === 2 || ctx.children.length === 4, "Decl_stmt should have 2 or 5 children");

        if (ctx.children.length > 3) {
            expr = this.visit(ctx.children[3]) as Expression;
        }
        
        return new DeclStatment(type, name, expr);
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
        const expr = new Expression();
        
        return expr;
    }
}

export function transProgram(tree: ProgContext, verbose = false): Program {
    const visitor = new TransVisitor();
    const AST = visitor.visit(tree);

    if (verbose) {
        console.log(AST.toString());
    }

    return AST as Program;
}

