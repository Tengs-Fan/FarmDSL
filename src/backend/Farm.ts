import {Type} from "../ast/Type";
import { Crop } from "./Crop";
import {g_context} from "../vm/Context";
import {FunctionError} from "../Error";

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

    getFunction(funcName: string): Function {
        const func = this[funcName as keyof this];
        if (typeof func === "function") {
            return func;
        } else {
            throw new FunctionError(`Function ${funcName} does not exist in Farm class`);
        }
    }

    plantFarm(farmName: string, cropName: string, quantity: number): number {
        // Get Crop from CropsDB
        const myCrop: Crop = g_context.getCrop(cropName);

        // Get Farm from VM
        const myFarmVariable = g_context.getVariable(farmName);
        if (myFarmVariable === undefined || myFarmVariable.value === null) {
            throw new Error("Farm not found or is null");
        }
        const myFarm: Farm = myFarmVariable.value as Farm;

        // If polyculture is false and another crop is already planted, throw error.
        const uniqueCropsInFarm = myFarm.getUniqueCrops();
        const CropIsAlreadyPresent: boolean = uniqueCropsInFarm.some(crop => crop.Name === myCrop.Name);
        if (myFarm.Polyculture == false && CropIsAlreadyPresent) {
            throw new Error("Multiple different crops cannot be planted when polyculture is false");
        }
        // Start planting crop
        const result: Farm = this.startPlanting(myCrop, quantity);
        g_context.updateVariable(farmName,result);

        //If successful, return 1.
        console.log(`Planting was successful`);
        return 1;
    }

    farmAvailableSpace(farmName: string): number {
        const myFarmVariable = g_context.getVariable(farmName);
        if (myFarmVariable === undefined || myFarmVariable.value === null) {
            throw new Error("Farm not found or is null");
        }
        const myFarm: Farm = myFarmVariable.value as Farm;
        let count: number = 0;

        for (let x = 0; x < myFarm.GridLength; x++) {
            for (let y = 0; y < myFarm.GridLength; y++) {
                if (myFarm.Crops[x][y] == null) {
                    count++;
                }
            }
        }
        return count;
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
        if (quantityLeft > 0) {
            throw new Error(`There are ${quantityLeft} more crops than space. Crops were not planted`);
        }
        return this;
    }
}
