import {Type} from "../ast/Type";

export class Crop {
    static propertiesMetadata = {
        Name: {
            type: "String",
            required: true
        },
        Season: {
            type: "String",
            required: true,
        },
        Water: {
            type: "Num",
            required: true,
        },
        Yield: {
            type: "Num",
            required: true,
        },
        SellPrice: {
            type: "Num",
            required: true,
        },
    };

    Name: string;
    Season: "Spring" | "Summer" | "Fall" | "Winter" | "All" | "None";
    Water: number;
    Yield: number;
    SellPrice: number;

    constructor(props: {[key: string]: Type}) {
        this.Name = "test";
        this.Season = "Spring";
        this.Water = props.water as number;
        this.Yield = props.yield as number;
        this.SellPrice = props.sellPrice as number;
    }
}
