import {Type, TypeStr} from "../ast/Type";

export interface Variable {
    type: TypeStr;
    value: Type;
}
