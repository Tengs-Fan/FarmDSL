import * as antlr from 'antlr4';
import FarmExprLexer from '../lang/FarmExprLexer';
import FarmExprParser from '../lang/FarmExprParser';
import { ProgContext } from '../lang/FarmExprParser';

export function parseProgram(input: string, verbose: boolean): ProgContext 
{
    const chars = antlr.CharStreams.fromString(input);
    const lexer = new FarmExprLexer(chars);
    const tokens = new antlr.CommonTokenStream(lexer); 
    const parser = new FarmExprParser(tokens);

    const tree = parser.prog();
    if (verbose) {
        console.log(tree.toStringTree(parser.ruleNames, parser));
    }

    return tree;
}
