import {Type} from "../ast/Type";
import { FunctionError } from "../Error";

export class Farm {
    static propertiesMetadata = {
        Name: {type: "String", required: true},
        Area: {type: "Num", required: true},
        GridLength: {type: "Num", required: true},
        Polyculture: {type: "Bool", required: true},
        MaxWaterUsage: {type: "Num", required: true},
        Season: {type: "String", required: true},
    };

    static properties = Object.keys(Farm.propertiesMetadata);

    Name: string;
    Area: number;
    GridLength: number;
    Polyculture: boolean;
    MaxWaterUsage: number;
    Season: "Spring" | "Summer" | "Fall" | "Winter" | "All" | "None";

    constructor(props: {[key: string]: Type}) {
        this.Name = props.Name as string;
        this.Area = props.Area as number;
        this.GridLength = props.GridLength as number;
        this.Polyculture = props.Polyculture as boolean;
        this.MaxWaterUsage = props.MaxWaterUsage as number;
        this.Season = props.Season as "Spring" | "Summer" | "Fall" | "Winter" | "All" | "None";
    }

    call(funcName: string, args: Type[]): Type {
        if (typeof this[funcName as keyof this] === "function") {
            return (this[funcName as keyof this] as Function)(...args);
        } else {
            throw new FunctionError(`Function ${funcName} does not exist in Farm class`);
        }
    }

    OOPCallTest(): number {
        return 114514;
    }
}
