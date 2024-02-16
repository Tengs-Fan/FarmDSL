Farm myFarm = [Name: "myFarm", Area: 1200, GridLength: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];

myFarm.plantFarm(Blueberry, 10);

myFarm.displayFarm();

Num totalYield = 0;

for c in myFarm {
    totalYield = totalYield + c.getYield();
}

echo(totalYield);
