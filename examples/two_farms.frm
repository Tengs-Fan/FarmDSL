Farm mySummerFarm = [Name: "mySummerFarm", Height: 10, Width: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];
Farm myFallFarm = [Name: "myFallFarm", Height: 10, Width: 8, Polyculture: true, MaxWaterUsage: 1500, Season: "Fall"];


if myFallFarm.isCropPlantable(Beet) {
    myFallFarm.plantFarm(Beet, 40);
} else {
    if myFallFarm.isCropPlantable(Corn) {
        myFallFarm.plantFarm(Corn, 40);
    }
}
if myFallFarm.isCropPlantable(Strawberry) {
    myFallFarm.plantFarm(Strawberry, 10);
} else {
    myFallFarm.plantFarm(Yam, 5);
}
Num pumpkinNum = myFallFarm.cropCapacity(Pumpkin);
myFallFarm.plantFarm(Pumpkin, pumpkinNum);


if mySummerFarm.isCropPlantable(Blueberry) {
    mySummerFarm.plantFarm(Blueberry, 10);
}
if mySummerFarm.isCropPlantable(Corn) {
    if mySummerFarm.isCropPlantable(Carrot) {
        mySummerFarm.plantFarm(Carrot, 20);
    } else {
        if mySummerFarm.isCropPlantable(Starfruit) {
            mySummerFarm.plantFarm(Starfruit, 15);
        }
    }
    mySummerFarm.plantFarm(Corn, 12);
}
Num melonQuant = mySummerFarm.cropCapacity(Watermelon);
if melonQuant > 10 {
    mySummerFarm.plantFarm(Watermelon, melonQuant);
}
myFallFarm.displayFarm();
mySummerFarm.displayFarm();


