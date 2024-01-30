import * as antlr from 'antlr4';
import FarmExprLexer from '../lang/FarmExprLexer';
import FarmExprParser from '../lang/FarmExprParser';
import { ProgContext } from '../lang/FarmExprParser';

export function parseProgram(input: string, verbose: boolean): ProgContext 
{
    // read the input as a stream of characters
    const chars = antlr.CharStreams.fromString(input);

    // tokenize the input stream
    const lexer = new FarmExprLexer(chars);
    const tokens = new antlr.CommonTokenStream(lexer); 

    // parse it to default AST tree
    const parser = new FarmExprParser(tokens);
    const tree = parser.prog();

    if (verbose) {
        console.log(tree.toStringTree(parser.ruleNames, parser));
    }

    // The tree is a ProgContext object, directly from the generated parser.
    return tree;
}
