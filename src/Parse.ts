import * as antlr from 'antlr4';
import FarmExprLexer from '../lang/FarmExprLexer';
import FarmExprParser from '../lang/FarmExprParser';

export function parseExpression(input: string) {
    const chars = antlr.CharStreams.fromString(input);
    const lexer = new FarmExprLexer(chars);
    const tokens = new antlr.CommonTokenStream(lexer); 
    const parser = new FarmExprParser(tokens);

    const tree = parser.expr();
    console.log(tree.toStringTree(parser.ruleNames, parser));
}
