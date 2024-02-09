import {Type} from "../ast/Type";
import {FunctionError} from "../Error";
import {Crop} from "./Crop";

const corn = new Crop({Name: "Corn", Season: "Winter", Water: 45, Yield: 75, SellPrice: 110});
const strawberries = new Crop({Name: "Straw", Season: "Winter", Water: 45, Yield: 75, SellPrice: 110});
const crops: (Crop | null)[][] = [
    [corn, corn, null, corn],
    [corn, corn, null, corn],
    [corn, corn, null, null],
    [null, null, strawberries, strawberries],
];

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

    getFunction(funcName: string): Function {
        const func = this[funcName as keyof this];
        if (typeof func === "function") {
            return func;
        } else {
            throw new FunctionError(`Function ${funcName} does not exist in Farm class`);
        }
    }

    displayFarm(): string {
        const farmLength: number = crops[0].length;
        const farmWidth: number = crops.length;

        const initialFarm: string[][] = Array.from({length: farmWidth}, () =>
            Array.from(
                {length: farmLength + 2}, // Extra 2 cols for left-right borders
                () => "",
            ),
        );

        // Determine width of middle cells
        // Side cells will have a width of 1
        const longestCropName: number = crops
            .map((row) => row.map((crop) => (crop === null ? 0 : crop.Name.length)))
            .reduce((longestName, row) => Math.max(longestName, ...row), 0);
        const middleCellLength = longestCropName + 2;
        const padding = " ";

        // Format crop cells and left-right borders
        const formattedFarm = initialFarm
            .map((row, r) =>
                row
                    .map((col, c) => {
                        if (c === 0 || c === farmWidth + 1) {
                            return "|";
                        } else {
                            const val = crops[r][c - 1] === null ? "" : crops[r][c - 1]!.Name;
                            const rightPadding = padding.repeat(middleCellLength - val.length - padding.length);
                            return padding + val + rightPadding;
                        }
                    })
                    .join(""),
            )
            .join("\n");

        // Format top-bottom borders
        const topBottomBorder: string = Array.from({length: farmWidth + 2}, (row, i) => {
            const val = "\u2014";
            if (i !== 0 && i !== farmWidth + 1) {
                return padding + val.repeat(middleCellLength - 2) + padding;
            } else {
                return padding; // Empty corners
            }
        }).join("");

        // Format farm metadata
        const title: string = this.Name;
        const farmInfo: string = [
            `Area: ${this.Area}`,
            `Grid Length: ${this.GridLength}`,
            `Max Water Usage: ${this.MaxWaterUsage}`,
            `Polyculture: ${this.Polyculture}`,
            `Season: ${this.Season}`,
        ].join("\n");

        // Join everything together
        return [title, topBottomBorder, formattedFarm, topBottomBorder, farmInfo].join("\n");
    }

    OOPCallTest(): number {
        return 114514;
    }
}
