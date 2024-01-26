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

num cornQuant = CropQuantity("corn");
if cornQuant > 100 {
    Plant("corn", cornQuant);
}


