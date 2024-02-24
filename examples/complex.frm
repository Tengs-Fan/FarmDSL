// I want to make a farm for a summer planting
Farm myFarm = [Name: "myFarm", Height: 100, Width: 20, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];
Num totalYield = 0;
Num totalIncome = 0;
Crop firstPlantedCrop;
Crop secondCrop;
Crop secondPlantedCrop;

// I want to plant two kinds of crops in my summer farm. I want to make sure the planted crops are seasonally compatible with the farm
// and I want to have low water usage but still make a decent income. My strategy will therefore be to use
// half of my farm's capacity to plant the low water usage crop and fill the rest with a high yield crop.

// To start I define my own function that looks through the saved crop database "Crops" to find crops with lowest water usage that are seasonally compatible with my farm,
// however, since I don't like Strawberries, I don't want to plant strawberries.

def lowestWaterCropForMyFarm(myFarm2: Farm) -> Crop {
    Num waterUsage = 1000;
    Crop leastWaterCrop;
    for c in Crops {
        if (c.getWater() < waterUsage) {
            if (myFarm2.getSeason() == c.getSeason()) {
                if (c != Strawberry) {
                    waterUsage = c.getWater();
                    leastWaterCrop = c;
                }
            }
        }
    }
    //showCrop(leastWaterCrop);
    return leastWaterCrop;
}

// Now I use my custom function and the pre-defined functions in the DSL to plant the "least water usage crop" in my farm.
// The pre-defined functions in the DSL also check if the crop found is compatible with my farm in terms of water usage/space/seasonality/polyculture requirements.

if (myFarm.availableSpace() > 0) {
    Crop lowWaterCrop = lowestWaterCropForMyFarm(myFarm);
    if (myFarm.isCropPlantable(lowWaterCrop)) {
        Num quantityOfLowYieldCrop = myFarm.cropCapacity(lowWaterCrop)/2;
        myFarm.plantFarm(lowWaterCrop,quantityOfLowYieldCrop);
        firstPlantedCrop = lowWaterCrop;
    }
}


// Now I want to define a function that finds the highest yield crop that is different from the crop I have already planted
// and is compatible with my farm in all other respects.
def HighestYieldCropForMyFarm(myFarm: Farm) -> Crop {
    Num currentYield = 0;
    Crop HighestYieldCrop;
    for c in Crops {
        if (c.getYield() > currentYield) {
            if (myFarm.getSeason() == c.getSeason()) {
                if (c != firstPlantedCrop) {
                    currentYield = c.getYield();
                    HighestYieldCrop = c;
                }
            }
        }
    }
    return HighestYieldCrop;
}


// Plant the remaining capacity on my farm with the crop that has the most yield
// and is seasonally compatible with my farm and can be planted on my farm
if (myFarm.availableSpace() > 0) {
    Crop HighYieldCrop = HighestYieldCropForMyFarm(myFarm);
    if (myFarm.isCropPlantable(HighYieldCrop)) {
        if (HighYieldCrop != Coffee) {
            Num quantity2 = myFarm.cropCapacity(HighYieldCrop);
            secondCrop = HighYieldCrop;
        }
    }
}


// Now I calculate the total yield of my farm
for crop in myFarm {
    totalYield = totalYield + crop.getYield();
}

// Now I calculate the total income of my farm
for crop in myFarm {
    totalIncome = totalIncome + (crop.getYield() * crop.getPrice());
}

// Now I printout my farm's total yield, total income and total water usage.
showStr("The farm yield is: ");
showNum(totalYield);

showStr("The farm total income is: ");
showNum(totalIncome);

showStr("The farm total water usage is: ");
showNum(myFarm.getWaterUsageOfFarm());

// Now I display the farm
myFarm.displayFarm();
