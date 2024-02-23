Farm myFarm = [Name: "myFarm", Area: 100000, GridLength: 10, Polyculture: false, MaxWaterUsage: 25000, Season: "Summer"];

Num max = myFarm.cropQuantity(Starfruit)
if myFarm.isCropPlantable(Starfruit) {
    myFarm.plantFarm(Starfruit, max);
}

myFarm.displayFarm();