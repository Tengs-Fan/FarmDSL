import {Type} from "../ast/Type";
import {Crop} from "./Crop";
import {FunctionError} from "../Error";
import logger from "../Log";

export class Farm {
    static propertiesMetadata = {
        Name: {type: "String", required: true},
        Height: {type: "Num", required: true},
        Width: {type: "Num", required: true},
        Polyculture: {type: "Bool", required: true},
        MaxWaterUsage: {type: "Num", required: true},
        Season: {type: "String", required: true},
        //TODO: how to state the type of crop[][] when it is not a type in the DSL
        Crops: {type: "Crop[][]", required: false},
    };

    static properties = Object.keys(Farm.propertiesMetadata);

    Name: string;
    Height: number;
    Width: number;
    Polyculture: boolean;
    MaxWaterUsage: number;
    Season: "Spring" | "Summer" | "Fall" | "Winter" | "All";
    Crops: Crop[][];

    constructor(props: {[key: string]: Type}) {
        this.Name = props.Name as string;
        this.Height = props.Height as number;
        this.Width = props.Width as number;
        this.Polyculture = props.Polyculture as boolean;
        this.MaxWaterUsage = props.MaxWaterUsage as number;
        this.Season = props.Season as "Spring" | "Summer" | "Fall" | "Winter" | "All";
        this.Crops = Array.from({length: this.Height}, () => Array(this.Width).fill(null));
    }

    getSeason(): "Spring" | "Summer" | "Fall" | "Winter" | "All" {
        return this.Season;
    }

    getName(): string {
        return this.Name;
    }

    getHeight(): number {
        return this.Height;
    }

    getWidth(): number {
        return this.Width;
    }

    getPolyculture(): boolean {
        return this.Polyculture;
    }

    getMaxWaterCapacity(): number {
        return this.MaxWaterUsage;
    }

    getCrops(): Crop[][] {
        return this.Crops;
    }

    plantFarm(plantingCrop: Crop, quantity: number): Farm {
        //If proposed plantation would exceed farm water capacity
        const waterRequirementOfCrop: number = plantingCrop.WaterRequirement * quantity;
        const remainingWaterCapacity: number = this.MaxWaterUsage - this.getWaterUsageOfFarm();
        if (waterRequirementOfCrop > remainingWaterCapacity) {
            throw new Error(`The proposed planting would exceed farm's water capacity by ${waterRequirementOfCrop - remainingWaterCapacity}`);
        }

        // If crop and farm seasonality do not match
        if (this.Season !== plantingCrop.Season) {
            throw new Error(
                `The farm and crop have incompatible seasons. ${plantingCrop.Name}'s season is ${plantingCrop.Season}, ${this.Name}'s season is ${this.Season}`,
            );
        }

        // If farm does not have space
        if (this.availableSpace() < quantity) {
            throw new Error(`The farm does not have enough space. There are only ${this.availableSpace()} spaces available.`);
        }

        // If polyculture is false and another crop is already planted, throw error.
        const uniqueCropsInFarm = this.getUniqueCrops();
        const ADifferentCropIsAlreadyPresent: boolean = uniqueCropsInFarm.some((crop) => crop.Name !== plantingCrop.Name);
        if (this.Polyculture == false && ADifferentCropIsAlreadyPresent) {
            throw new Error("Multiple different crops cannot be planted when polyculture is false");
        }
        // Start planting crop
        const result: Farm = this.startPlanting(plantingCrop, quantity);
        logger.debug(`Planting was successful`);
        return result;
    }

    availableSpace(): number {
        let count: number = 0;
        for (let x = 0; x < this.Height; x++) {
            for (let y = 0; y < this.Width; y++) {
                if (this.Crops[x][y] == null) {
                    count++;
                }
            }
        }
        return count;
    }

    isCropPlantable(plantingCrop: Crop): boolean {
        // If crop and farm seasonality do not match
        if (this.Season !== plantingCrop.Season) {
            return false;
        }
        // If polyculture is false and another crop is already planted, throw error.
        const uniqueCropsInFarm = this.getUniqueCrops();
        const ADifferentCropIsAlreadyPresent: boolean = uniqueCropsInFarm.some((crop) => crop.Name !== plantingCrop.Name);
        if (this.Polyculture == false && ADifferentCropIsAlreadyPresent) {
            return false;
        }
        return true;
    }

    cropCapacity(plantingCrop: Crop): number {
        const emptySlotsAvailable = this.availableSpace();
        const remainingWaterCapacity: number = this.MaxWaterUsage - this.getWaterUsageOfFarm();
        const possibleQuantity = Math.floor(remainingWaterCapacity / plantingCrop.WaterRequirement);
        const cropQuantity = Math.min(emptySlotsAvailable, possibleQuantity);
        return cropQuantity;
    }

    getWaterUsageOfFarm(): number {
        let waterUsage: number = 0;
        for (let x = 0; x < this.Height; x++) {
            for (let y = 0; y < this.Width; y++) {
                if (this.Crops[x][y] != null) {
                    waterUsage += this.Crops[x][y].WaterRequirement;
                }
            }
        }
        return waterUsage;
    }

    private getUniqueCrops(): Crop[] {
        const uniqueCrops: Crop[] = [];
        for (let x = 0; x < this.Height; x++) {
            for (let y = 0; y < this.Width; y++) {
                const currentCrop = this.Crops[x][y];
                if (currentCrop !== null && !uniqueCrops.some((crop) => crop.Name === currentCrop.Name)) {
                    uniqueCrops.push(currentCrop);
                }
            }
        }
        return uniqueCrops;
    }

    private plantIfEmpty(x: number, y: number, aCrop: Crop): boolean {
        if (this.Crops[x][y] === null) {
            this.Crops[x][y] = aCrop;
            logger.debug(`Planted ${aCrop.Name} at position (${x}, ${y}).`);
            return true;
        } else {
            logger.debug(`There's already a crop at position (${x}, ${y}). Skipping this space.`);
            return false;
        }
    }

    private startPlanting(myCrop: Crop, quantity: number): Farm {
        if (quantity < 0) {
            throw new Error("Crop quantity cannot be negative.");
        }
        let quantityLeft: number = quantity;
        for (let x = 0; x < this.Height; x++) {
            for (let y = 0; y < this.Width; y++) {
                if (quantityLeft == 0) {
                    return this;
                }
                if (this.plantIfEmpty(x, y, myCrop)) {
                    quantityLeft--;
                }
            }
        }
        return this;
    }

    call(funcName: string, args: Type[]): Type {
        if (typeof this[funcName as keyof this] === "function") {
            return (this[funcName as keyof this] as Function)(...args);
        } else {
            throw new FunctionError(`Function ${funcName} does not exist in Farm class`);
        }
    }

    displayFarm() {
        const farmHeight: number = this.Crops.length;
        const farmWidth: number = this.Crops[0].length;

        const initialFarm: string[][] = Array.from({length: farmHeight}, () =>
            Array.from(
                {length: farmWidth + 2}, // Extra 2 cols for left-right borders
                () => "",
            ),
        );

        // Determine width of middle cells
        // Side cells will have a width of 1
        const longestCropName: number = this.Crops.map((row) => row.map((crop) => (crop === null ? 0 : crop.Name.length))).reduce(
            (longestName, row) => Math.max(longestName, ...row),
            0,
        );
        const middleCellLength = Math.max(longestCropName + 2, 3); // defaults to 3
        const padding = " ";

        // Format crop cells and left-right borders
        const formattedFarm = initialFarm
            .map((row, r) =>
                row
                    .map((col, c) => {
                        if (c === 0 || c === farmWidth + 1) {
                            return "|";
                        } else {
                            const val = this.Crops[r][c - 1] === null ? "" : this.Crops[r][c - 1]!.Name;
                            const leftPadding = padding.repeat(Math.floor((middleCellLength - val.length) / 2));
                            const rightPadding = padding.repeat(middleCellLength - val.length - leftPadding.length);
                            return leftPadding + val + rightPadding;
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
        const title: string = `Name: ${this.Name}`;
        const farmInfo: string = [
            `Available Space: ${this.availableSpace()}`,
            `Height: ${this.Height}`,
            `Width: ${this.Width}`,
            `Current Water Usage: ${this.getWaterUsageOfFarm()}`,
            `Max Water Usage: ${this.MaxWaterUsage}`,
            `Polyculture: ${this.Polyculture}`,
            `Season: ${this.Season}`,
        ].join("\n");

        // Join everything together
        console.log([title, topBottomBorder, formattedFarm, topBottomBorder, farmInfo].join("\n"));
    }

    OOPCallTest(): number {
        return 114514;
    }
}
