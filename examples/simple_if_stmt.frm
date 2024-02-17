Farm myFarm = [Name: "myFarm", Height: 10, Width: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];
Crop myCrop = [Name: "elderberry", Season: "Summer", WaterRequirement: 45, Yield: 75, SellPrice: 110];

if myFarm.isCropPlantable(Beet) {
    myFarm.plantFarm(Beet, 40);
} else {
    if myFarm.isCropPlantable(Corn) {
        myFarm.plantFarm(Corn, 40);
    }
}

if myFarm.isCropPlantable(Blueberry) {
    myFarm.plantFarm(Blueberry, 10);
}

Num cropQuant = myFarm.cropCapacity(myCrop);
if cropQuant > 10 {
    myFarm.plantFarm(myCrop, cropQuant);
}
myFarm.displayFarm();


