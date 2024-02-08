import {Func} from "../vm/Function";
import {Farm} from "./Farm";
import {Crop} from "./Crop";
import {number} from "yargs";
import {Context, g_context} from "../vm/Context";


function plantFarm(farm: Farm, cropName: string, quantity: number): number {
    let myCrop: Crop = g_context.getCrop(cropName);
    return startPlanting(farm,myCrop, quantity);
}

function availableSpace(farm: Farm): number {
    let count: number = 0;
    for (let x = 0; x < farm.GridLength; x++) {
        for (let y = 0; y < farm.GridLength; y++) {
            if (farm.Crops[x][y] == null) {
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

function startPlanting(myFarm: Farm, myCrop: Crop, quantity: number): number {
    if (quantity < 0) {
        console.log(`Crop quantity cannot be negative.`);
        return -1;
    }
    let quantityLeft: number = quantity;
    for (let x = 0; x < myFarm.GridLength; x++) {
        for (let y = 0; y < myFarm.GridLength; y++) {
            if (quantityLeft == 0) {return 1;}
            if (plantIfEmpty(myFarm,x, y, myCrop)) {
                quantityLeft--;
            }
        }
    }
    if (quantityLeft > 0) {
        console.log(`The farm is full. Only ${quantity - quantityLeft} crops were planted`);
        return 1;
    }
    // this is an error code but should never be returned.
    return 0;
}

export { plantFarm, availableSpace };


