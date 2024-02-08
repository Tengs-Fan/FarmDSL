import {Func} from "../vm/Function";
import {Farm} from "./Farm";
import {Crop} from "./Crop";
import {number} from "yargs";
import {Context, g_context} from "../vm/Context";
import {Type} from "../ast/Type";



function plantFarm(farmName: string, cropName: string, quantity: number): void {
    let myCrop: Crop = g_context.getCrop(cropName);
    let myFarmVariable = g_context.getVariable(farmName);
    if (myFarmVariable === undefined || myFarmVariable.value === null) {
        throw new Error("Farm not found or is null");
    }
    let myFarm: Farm = myFarmVariable.value as Farm;
    let result: Farm = startPlanting(myFarm,myCrop, quantity);
    g_context.updateVariable(farmName,result);
}

function farmAvailableSpace(farmName: string): number {

    let myFarmVariable = g_context.getVariable(farmName);
    if (myFarmVariable === undefined || myFarmVariable.value === null) {
        throw new Error("Farm not found or is null");
    }
    let myFarm: Farm = myFarmVariable.value as Farm;
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

function plantIfEmpty(myFarm: Farm, x: number, y: number, aCrop: Crop): boolean {
    if (myFarm.Crops[x][y] === null) {
    myFarm.Crops[x][y] = aCrop;
    console.log(`Planted ${aCrop.Name} at position (${x}, ${y}).`);
    return true;
} else {
    console.log(`There's already a crop at position (${x}, ${y}). Skipping this space.`);
    return false;
}
}

function startPlanting(myFarm: Farm, myCrop: Crop, quantity: number): Farm {
    if (quantity < 0) {
        console.log(`Crop quantity cannot be negative.`);
        return myFarm;
    }
    let quantityLeft: number = quantity;
    for (let x = 0; x < myFarm.GridLength; x++) {
        for (let y = 0; y < myFarm.GridLength; y++) {
            if (quantityLeft == 0) {
                console.log(`Planting was successful`);
                return myFarm;
            }
            if (plantIfEmpty(myFarm,x, y, myCrop)) {
                quantityLeft--;
            }
        }
    }
    if (quantityLeft > 0) {
        console.log(`The farm is full. Only ${quantity - quantityLeft} crops were planted`);
        return myFarm;
    }
    return myFarm;
}

export { plantFarm, farmAvailableSpace };


