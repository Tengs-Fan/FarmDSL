import { Result } from '../Eval'
import { VirtualMachine } from '../vm/VirtualMachine'

export interface ASTNode {

    eval(node: ASTNode, vm: VirtualMachine): Result;
}
