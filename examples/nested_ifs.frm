Farm myFarm = [Name: "myFarm", Height: 10, Width: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Fall"];

if myFarm.isCropPlantable(Beet) {
    if myFarm.isCropPlantable(Cranberry) {
        if myFarm.isCropPlantable(Watermelon) {
            myFarm.plantFarm(Watermelon, 12);
            myFarm.plantFarm(Beet, 12);
            myFarm.plantFarm(Cranberry, 12);
        } else {
            if myFarm.isCropPlantable(Yam) {
                if myFarm.isCropPlantable(Grape) {
                    myFarm.plantFarm(Beet, 10);
                    myFarm.plantFarm(Cranberry, 10);
                    myFarm.plantFarm(Yam, 10);
                    if (myFarm.cropCapacity(Grape) > 1000) {
                        myFarm.plantFarm(Grape, myFarm.cropCapacity(Grape));
                    } else {
                        if myFarm.isCropPlantable(Pumpkin) {
                            myFarm.plantFarm(Pumpkin, myFarm.cropCapacity(Pumpkin));
                        } else {
                            myFarm.plantFarm(Yam, myFarm.cropCapacity(Yam));
                        }
                    }
            }
        }
    }
}
 }else {
    myFarm.plantFarm(Watermelon, myFarm.cropCapacity(Watermelon));
}
myFarm.displayFarm();

