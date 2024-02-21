Farm myFarm = [Name: "myFarm", Height: 10, Width: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];

myFarm.plantFarm(Blueberry, 10);

myFarm.displayFarm();

Num totalYield = 0;

for c in myFarm {
    totalYield = totalYield + c.getYield();
}

echo(totalYield);
