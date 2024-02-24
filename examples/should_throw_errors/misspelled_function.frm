Farm myFarm = [Name: "myFarm", Height: 10, Width: 20, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];

def plant(c: Crop, f: Farm) -> Bool {
    Bool canPlant = false;
    if (c.getYield() > 3) and (c.getSeason() == f.getSeason()) {
        canPlant = true;
    }
    return canPlant
}
plantt(Blueberry, myFarm);