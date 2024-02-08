import {Type} from "../ast/Type";
import { FunctionError } from "../Error";

export class Crop {
    static propertiesMetadata = {
        Name: { type: "String", required: true },
        Season: { type: "String", required: true },
        Water: { type: "Num", required: true },
        Yield: { type: "Num", required: true },
        SellPrice: { type: "Num", required: true },
    };

    static properties = Object.keys(Crop.propertiesMetadata);

    Name: string;
    Season: "Spring" | "Summer" | "Fall" | "Winter" | "All" | "None";
    Water: number;
    Yield: number;
    SellPrice: number;

    constructor(props: {[key: string]: Type}) {
        this.Name = props.Name as string;
        this.Season = props.Season as "Spring" | "Summer" | "Fall" | "Winter" | "All" | "None";
        this.Water = props.Water as number;
        this.Yield = props.Yield as number;
        this.SellPrice = props.SellPrice as number;
    }

    getFunction(funcName: string): Function {
        const func = this[funcName as keyof this];
        if (typeof func === "function") {
            return func;
        } else {
            throw new FunctionError(`Function ${funcName} does not exist in Crop class`);
        }
    }

    OOPCallTest(): number {
        return 1919810;
    }
}
