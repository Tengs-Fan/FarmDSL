Farm myFarm = [Name: "myFarm", Height: 100, Width: 20, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];

def isOkToPlant(c: Crop, f: Farm) -> Bool {
    Bool canPlant = false;
    if (c.getYield() > 3) and (c.getSeason() == f.getSeason()) {
        canPlant = true;
    }
    return canPlant;
}


for c in Crops {
    if isOkToPlant(c, myFarm) {
        myFarm.plantFarm(c, 8);
    }
}

Num totalYield = 0;

for c in myFarm {
    totalYield = totalYield + c.getYield();
}

echo(totalYield);

myFarm.displayFarm();
