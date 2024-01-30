import { Result } from 'vm/Eval'
import { Context } from 'vm/Context'

export interface ASTNode {

    eval(ctx?: Context): Result;
}
