Farm myFarm = [Name: "myFarm", Height: 2, Width: 15, Polyculture: true, MaxWaterUsage: 1500, Season: "Spring"];

def plantCrops(f: Farm) -> Bool {
    if myFarm.isCropPlantable(Watermelon) {
        myFarm.plantFarm(Watermelon, 10);
    } else {
        if myFarm.isCropPlantable(Yam) {
            myFarm.plantFarm(Yam, 20);
        }

        if myFarm.isCropPlantable(Strawberry) {
            myFarm.plantFarm(Strawberry, 25);
        }
    }
    return true;
}

plantCrops(myFarm);
myFarm.displayFarm();
