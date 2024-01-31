import { Result } from "vm/Eval";
import { Type } from "../ast/Type";

export interface Function {
    args: Type[];

    // Function call will return
    // Any argument mismatch will raise an error
    call(args: any[]): Result;
}
