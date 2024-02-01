export class Crop {
    
    static propertiesMetadata = {
        Name: { type: "String", required: true},
        Season: { type: "String", required: true},
        Water: { type: "Num", required: true},
        Yield: { type: "Num", required: true},
        SellPrice: { type: "Num", required: true}
    };

    Name: string;
    Season: "Spring" | "Summer" | "Fall" | "Winter" | "All" | "None";
    Water: number;
    Yield: number;
    SellPrice: number;

    constructor(props: {name: string, season: "Spring" | "Summer" | "Fall" | "Winter" | "All" | "None", water: number, yield: number, sellPrice: number}) {
        this.Name = props.name;
        this.Season = props.season;
        this.Water = props.water;
        this.Yield = props.yield;
        this.SellPrice = props.sellPrice;
    }

}



