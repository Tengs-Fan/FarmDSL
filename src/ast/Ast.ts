import { Result } from '../Eval'
import { Context } from '../vm/Context'

export interface ASTNode {

    eval(vm?: Context): Result;
}
