import { Program } from './ast/Program'
import { g_context, Context } from './vm/Context'
import { Type } from './ast/Type'

export type ResultType =
    "Null" |
    Type   |
    "String" | "Name"
;

export class Result {
    type  : ResultType;
    value?: any;

    constructor(type : ResultType, value:any = null) { this.type = type; this.value = value; }

    show() {
        switch (this.type) {
            case "Null": break;
            case "Bool":   
            case "Num":  
            case "String":  console.log(this.value); break;
            case 'Name':
            default:  throw new Error("Unknown result type: " + this.type);
        }
    }
}

export function evalProgram(prog: Program): Result 
{
    const result = prog.eval(g_context);
    return result;
}
