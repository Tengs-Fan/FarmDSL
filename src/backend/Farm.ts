import {Type} from "../ast/Type";
import { Crop } from "./Crop";
import { FunctionError } from "../Error";

export class Farm {
    static propertiesMetadata = {
        Name: {type: "String", required: true},
        Area: {type: "Num", required: true},
        GridLength: {type: "Num", required: true},
        Polyculture: {type: "Bool", required: true},
        MaxWaterUsage: {type: "Num", required: true},
        Season: {type: "String", required: true},
        //TODO: how to state the type of crop[][] when it is not a type in the DSL
        Crops: {type: "Crop[][]", required: false},
    };

    static properties = Object.keys(Farm.propertiesMetadata);

    Name: string;
    Area: number;
    GridLength: number;
    Polyculture: boolean;
    MaxWaterUsage: number;
    Season: "Spring" | "Summer" | "Fall" | "Winter" | "All" | "None";
    Crops: Crop[][];

    constructor(props: {[key: string]: Type}) {
        this.Name = props.Name as string;
        this.Area = props.Area as number;
        this.GridLength = props.GridLength as number;
        this.Polyculture = props.Polyculture as boolean;
        this.MaxWaterUsage = props.MaxWaterUsage as number;
        this.Season = props.Season as "Spring" | "Summer" | "Fall" | "Winter" | "All" | "None";
        this.Crops = Array.from({ length: this.GridLength }, () => Array(this.GridLength).fill(null));
    }

    plantFarm(crop: Crop, quantity: number): Farm {


        //If proposed plantation would exceed farm water capacity
        const waterRequirementOfCrop: number = crop.Water * quantity;
        const remainingWaterCapacity: number = this.MaxWaterUsage - this.getWaterUsageOfFarm();
        if (waterRequirementOfCrop > remainingWaterCapacity) {
            throw new Error(`The proposed planting would exceed farm's water capacity by ${waterRequirementOfCrop - remainingWaterCapacity}`);
        }

        // If crop and farm seasonality do not match
        if (this.Season !== crop.Season) {
            throw new Error(`The farm and crop have incompatible seasons. Crop season is ${crop.Season}, Farm season is ${this.Season}`);
        }

        // If farm does not have space
        if (this.getEmptySlotCount() < quantity) {
            throw new Error(`The farm does not have enough space. There are only ${this.getEmptySlotCount()} spaces available.`);
        }

        // If polyculture is false and another crop is already planted, throw error.
        const uniqueCropsInFarm = this.getUniqueCrops();
        const CropIsAlreadyPresent: boolean = uniqueCropsInFarm.some(crop => crop.Name === crop.Name);
        if (this.Polyculture == false && CropIsAlreadyPresent) {
            throw new Error("Multiple different crops cannot be planted when polyculture is false");
        }
        // Start planting crop
        const result: Farm = this.startPlanting(crop, quantity);
        console.log(`Planting was successful`);
        return result;
    }

    AvailableSpace(): number {
        let count: number = 0;
        for (let x = 0; x < this.GridLength; x++) {
            for (let y = 0; y < this.GridLength; y++) {
                if (this.Crops[x][y] == null) {
                    count++;
                }
            }
        }
        return count;
    }

    getWaterUsageOfFarm(): number {
        let waterUsage: number = 0;
        for (let x = 0; x < this.GridLength; x++) {
            for (let y = 0; y < this.GridLength; y++) {
                if (this.Crops[x][y] != null) {
                    waterUsage += this.Crops[x][y].Water;
                }
            }
        }
        return waterUsage;
    }


    private getUniqueCrops(): Crop[] {
        const uniqueCrops: Crop[] = [];
        for (let x = 0; x < this.GridLength; x++) {
            for (let y = 0; y < this.GridLength; y++) {
                const currentCrop = this.Crops[x][y];
                if (currentCrop !== null && !uniqueCrops.some(crop => crop.Name === currentCrop.Name)) {
                    uniqueCrops.push(currentCrop);
                }
            }
        }
        return uniqueCrops;
    }

    private getEmptySlotCount(): number {
        let emptyCount: number = 0;
        for (let x = 0; x < this.GridLength; x++) {
            for (let y = 0; y < this.GridLength; y++) {
                if (this.Crops[x][y] == null) {
                    emptyCount++;
                }
                }
            }
        return emptyCount;
    }

    private plantIfEmpty(x: number, y: number, aCrop: Crop): boolean {
        if (this.Crops[x][y] === null) {
            this.Crops[x][y] = aCrop;
            console.log(`Planted ${aCrop.Name} at position (${x}, ${y}).`);
            return true;
        } else {
            console.log(`There's already a crop at position (${x}, ${y}). Skipping this space.`);
            return false;
        }
    }

    private startPlanting(myCrop: Crop, quantity: number): Farm {
        if (quantity < 0) {
            throw new Error("Crop quantity cannot be negative.");
        }
        let quantityLeft: number = quantity;
        for (let x = 0; x < this.GridLength; x++) {
            for (let y = 0; y < this.GridLength; y++) {
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

    OOPCallTest(): number {
        return 114514;
    }
}
