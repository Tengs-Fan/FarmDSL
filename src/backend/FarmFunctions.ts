import {Farm} from "./Farm";
import {Crop} from "./Crop";
import {g_context} from "../vm/Context";




function plantFarm(farmName: string, cropName: string, quantity: number): number {
    // Get Crop from CropsDB
    const myCrop: Crop = g_context.getCrop(cropName);

    // Get Farm from VM
    const myFarmVariable = g_context.getVariable(farmName);
    if (myFarmVariable === undefined || myFarmVariable.value === null) {
        throw new Error("Farm not found or is null");
    }
    const myFarm: Farm = myFarmVariable.value as Farm;

    // If polyculture is false and another crop is already planted, throw error.
    const uniqueCropsInFarm = getUniqueCrops(myFarm);
    const CropIsAlreadyPresent: boolean = uniqueCropsInFarm.some(crop => crop.Name === myCrop.Name);
    if (myFarm.Polyculture == false && CropIsAlreadyPresent) {
        throw new Error("Multiple different crops cannot be planted when polyculture is false");
    }
    // Start planting crop
    const result: Farm = startPlanting(myFarm,myCrop, quantity);
    g_context.updateVariable(farmName,result);

    //If successful, return 1.
    console.log(`Planting was successful`);
    return 1;
}

function farmAvailableSpace(farmName: string): number {

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


function getUniqueCrops(myFarm: Farm): Crop[] {
    const uniqueCrops: Crop[] = [];

    for (let x = 0; x < myFarm.GridLength; x++) {
        for (let y = 0; y < myFarm.GridLength; y++) {
            const currentCrop = myFarm.Crops[x][y];

            if (currentCrop !== null && !uniqueCrops.some(crop => crop.Name === currentCrop.Name)) {
                uniqueCrops.push(currentCrop);
            }
        }
    }
    return uniqueCrops;
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
        throw new Error("Crop quantity cannot be negative.");
    }
    let quantityLeft: number = quantity;
    for (let x = 0; x < myFarm.GridLength; x++) {
        for (let y = 0; y < myFarm.GridLength; y++) {
            if (quantityLeft == 0) {
                return myFarm;
            }
            if (plantIfEmpty(myFarm, x, y, myCrop)) {
                quantityLeft--;
            }
        }
    }
    if (quantityLeft > 0) {
        throw new Error(`There are ${quantityLeft} more crops than space. Crops were not planted`);
    }
    return myFarm;
}

export { plantFarm, farmAvailableSpace };


