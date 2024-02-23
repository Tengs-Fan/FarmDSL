Farm myFarm = [Name: "myFarm", Height: 10, Width: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];

myFarm.plantFarm(Blueberry, 10);


Num totalYield = 0;

for c in Crops {
    if (c.getSellPrice() > 10) {
        if myFarm.isCropPlantable(c) {
            myFarm.plantFarm(c, 10);
        }
    }
}

myFarm.displayFarm();
