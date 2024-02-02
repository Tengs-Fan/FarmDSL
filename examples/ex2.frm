Farm myFarm = [Name: "myFarm", Area: 1200, GridLength: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];
Crop myCrop = [Name: "elderberry", Season: "Summer", Water: 45, Yield: 75, SellPrice: 110];

if PossibleCrop("corn") {
    Plant("corn", 5, 10, 8, 12);
} else {
    if PossibleCrop("strawberry") {
        Plant("strawberry", 5, 10, 8, 12);
    }
}

if PossibleCrop("corn", 5, 10, 8, 12) {
    Plant("corn", 5, 10, 8, 12);
}

Num cornQuant = CropQuantity("corn");
if cornQuant > 100 {
    Plant("corn", cornQuant);
}


