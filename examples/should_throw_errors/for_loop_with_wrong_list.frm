Farm myFarm = [Name: "myFarm", Height: 10, Width: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];

for c in Cropss {
    if myFarm.isCropPlantable(c) {
        myFarm.plantFarm(c, 1);
    }

}