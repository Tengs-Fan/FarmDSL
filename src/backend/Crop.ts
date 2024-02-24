import {Type} from "../ast/Type";
import {FunctionError} from "../Error";

export class Crop {
    static propertiesMetadata = {
        Name: {type: "String", required: true},
        Season: {type: "String", required: true},
        WaterRequirement: {type: "Num", required: true},
        Yield: {type: "Num", required: true},
        SellPrice: {type: "Num", required: true},
    };

    static properties = Object.keys(Crop.propertiesMetadata);

    Name: string;
    Season: "Spring" | "Summer" | "Fall" | "Winter" | "All";
    WaterRequirement: number;
    Yield: number;
    SellPrice: number;

    constructor(props: {[key: string]: Type}) {
        this.Name = props.Name as string;
        this.Season = props.Season as "Spring" | "Summer" | "Fall" | "Winter" | "All";
        this.WaterRequirement = props.WaterRequirement as number;
        this.Yield = props.Yield as number;
        this.SellPrice = props.SellPrice as number;
    }

    getYield(): number {
        return this.Yield;
    }

    getName(): string {
        return this.Name;
    }

    getWater(): number {
        return this.WaterRequirement;
    }

    getPrice(): number {
        return this.SellPrice;
    }

    getSeason(): "Spring" | "Summer" | "Fall" | "Winter" | "All" {
        return this.Season;
    }

    getSellPrice(): number {
        return this.SellPrice;
    }

    call(funcName: string, args: Type[]): Type {
        if (typeof this[funcName as keyof this] === "function") {
            return (this[funcName as keyof this] as Function)(...args);
        } else {
            throw new FunctionError(`Function ${funcName} does not exist in Crop class`);
        }
    }

    OOPCallTest(): number {
        return 1919810;
    }
}
