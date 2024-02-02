import { Type } from "../ast/Type";

export class Farm {
    
    static propertiesMetadata = {
        Name: { type: "String", required: true},
        Area: { type: "Num", required: true },
        GridLength: { type: "Num", required: true },
        Polyculture: { type: "Bool", required: true },
        MaxWaterUsage: { type: "Num", required: true },
        Season: { type: "String", required: true },
    };

    static properties = Object.keys(Farm.propertiesMetadata);

    Name: string;
    Area: number;
    GridLength: number;
    Polyculture: boolean;
    MaxWaterUsage: number;
    Season: string;

    constructor(props: {[key: string]: Type}) {
        this.Name = "Test";
        this.Area = props.area as number;
        this.GridLength = props.gridLength as number;
        this.Polyculture = props.polyculture as boolean;
        this.MaxWaterUsage = props.maxWaterUsage as number
        this.Season = "Summer";
    }

}

