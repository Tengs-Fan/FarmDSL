Farm myFarm = [Name: "myFarm", Height: 10, Width: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];
Crop myCrop = [Name: "elderberry", Season: "Summer", WaterRequirement: 45, Yield: 75, SellPrice: 110];

if (myFarm.isCropPlantable(myCrop)) {
    myFarm.plantFarm(myCrop, 1);
    Num a = myFarm.getWaterUsageOfFarm();
}
a;
