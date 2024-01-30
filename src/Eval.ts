import { Program } from './ast/Program'
import { g_vm, VirtualMachine } from './vm/VirtualMachine'

export type ResultType =
    "Null" |
    "Expression" | 
    "Bool"
;

export class Result {
    type : ResultType;
    value: any;

    constructor(type : ResultType) { this.type = type; }

    show() {
        switch (this.type) {
            case "Null": {};
            default: {
                console.log("unknown type: ", this.type);
            }
        }
    }
}

export function evalProgram(prog: Program, vm = g_vm): Result 
{
    return prog.eval(vm);
}
