

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

    constructor(props: {name: string, area: number, gridLength: number, polyculture: boolean, maxWaterUsage: number, season: string}) {
        this.Name = props.name;
        this.Area = props.area;
        this.GridLength = props.gridLength;
        this.Polyculture = props.polyculture;
        this.MaxWaterUsage = props.maxWaterUsage;
        this.Season = props.season;
    }

}

