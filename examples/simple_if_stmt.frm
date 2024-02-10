Farm myFarm = [Name: "myFarm", Area: 1200, GridLength: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];
Crop myCrop = [Name: "elderberry", Season: "Summer", Water: 45, Yield: 75, SellPrice: 110];

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

Num melonQuant = myFarm.cropQuantity(Watermelon);
if melonQuant > 10 {
    myFarm.plantFarm(Watermelon, melonQuant);
}
myFarm.displayFarm();


