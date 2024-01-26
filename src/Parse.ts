import * as antlr from 'antlr4';
import FarmExprLexer from '../lang/FarmExprLexer';
import FarmExprParser from '../lang/FarmExprParser';
import { ExprContext } from '../lang/FarmExprParser';

export function parseStatement(input: string, verbose: boolean): ExprContext 
{
    const chars = antlr.CharStreams.fromString(input);
    const lexer = new FarmExprLexer(chars);
    const tokens = new antlr.CommonTokenStream(lexer); 
    const parser = new FarmExprParser(tokens);

    const tree = parser.expr();
    if (verbose) {
        console.log(tree.toStringTree(parser.ruleNames, parser));
    }

    return tree;
}
