# Farm Planner DSL
This DSL allows farmers to plan out their farm and easily experiment with different layouts. Using our DSL, farmers can test out 
different crop combinations, water requirements, and farm shapes. With our unique displayFarm() feature, they even get to see a visual
representation of their farm, based on the crops they planted using the DSL.
# Variable Declaration
- This is a statically typed language. 
- Variables are declared by: **\<Type> \<Variable Name> = \<Value>;**
  - `Num totalYield = 0;`
  - `Bool isPlantable = true;`
  - `Farm myFarm = [Name: "myFarm", Height: 10, Width: 20, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];`

# Classes

### Num, Bool, Farm, Crop
## Num
- `Num <name> = <numerical value>;`
  - `Num totalYield = 0;`

## Bool
- `Bool <name> = <true/false>;`
  - `Bool isPlantable = false;`

###
## Farm
### Parameters
- **Name** (String): The string name of the farm
- **Height** (Integer): The height of your farm's plot, in plantable tiles
- **Width** (Integer): The width of your farm's plot, in plantable tiles
- **Polyculture** (Boolean): True if your farm can have multiple different crops, false if your farm can only contain one type of crop
- **MaxWaterUsage** (Number): The maximum amount of water your farm can use in one day
- **Season** (String): The season of your farm, either "Spring", "Summer", "Fall", "Winter", "All"

### Constructor
- `Farm <name> = [Name: <String>, Height: <Integer>, Width: <Integer>, Polyculture: <true/false>, MaxWaterUsage: <Num>, Season: <String>];`
- Example: 
  - `Farm myFarm = [Name: "myFarm", Height: 10, Width: 20, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];`

### Functions
- **getSeason()**: returns the season of your farm
  - `myFarm.getSeason();` -> "Summer"
- **getName()**: returns name of farm
  - `myFarm.getName()` -> 'myFarm'
- **getHeight()**: returns height of farm
  - `myFarm.getHeight()` -> 10
- **getWidth()**: returns width of farm
  - `myFarm.getWidth()` -> 20
- **getPolyculture()**: returns whether farm is polycultural
  - `myFarm.getPolyculture()` -> true
- **getMaxWaterCapacity()**: returns max water usage of farm
  - `myFarm.getMaxWaterCapacity()` -> 1500
- **getCrops()**: returns array of crops on the farm
  - `myFarm.getCrops()` -> 2D array of the crops
- **availableSpace()**: returns the number of unplanted tiles on the farm
  - `myFarm.availableSpace();` -> 200
- **isCropPlantable(Crop c)**: returns true if the Crop c is the same season as the farm and takes into account polyculture constraints
  - `myFarm.isCropPlantable(Blueberry);` -> true
  - `myFarm.isCropPlantable(Strawberry);` -> false (wrong season)
- **cropCapacity(Crop c)**: returns the total number of tiles on the farm where Crop c can be planted, based on number of open tiles and water constraints
  - `myFarm.cropCapacity(Blueberry);` -> 200
- **getWaterUsageOfFarm()**: Returns the total amount of water usage on the farm, summing the water requirements of every planted crop
  - `myFarm.getWaterUsageOfFarm();` -> 1240
- **plantFarm(Crop c, Num quantity)**: Plants the Crop c on \<quantity> number of tiles
  - `myFarm.plantFarm(Blueberry, 10);` -> Plants 10 blueberry crops on myFarm
- **displayFarm()**: Returns a graphical representation of the farm, based on the crops planted so far. Also includes statistical info about the farm.
  - `myFarm.displayFarm();` -> Pops up an image representing the farm layout, and logs farm information to the console


## Crop
### Parameters
- **Name** (String): The string name of the crop
- **Season** (String): The season the crop grows in, either "Spring", "Summer", "Fall", "Winter", "All"
- **WaterRequirement** (Number): The amount of water that the crop requires per day
- **Yield** (Number): The number of units of this crop yielded at harvest time, per tile
- **SellPrice** (Number): The selling price of one unit of this crop

### Constructor
- `Crop <name> = [Name: <String>, Season: <String>, WaterRequirement: <Number>, Yield: <Number, SellPrice: <Number];`
- Example:
  - `Crop myCrop = [Name: "elderberry", Season: "Summer", WaterRequirement: 45, Yield: 75, SellPrice: 110];`

### Functions
- **getYield()**: Returns the yield of this crop
  - `myCrop.getYield();` -> 75
- **getName()**: Returns name of crop
  - `myCrop.getName();` -> 'elderberry'
- **getWater()**: Returns water requirement for crop
  - `myCrop.getWater();` -> 45
- **getSeason()**: Returns the season of this crop
  - `myCrop.getSeason();` -> "Summer"
- **getPrice()**: Returns the sell price of this crop
  - `myCrop.getSellPrice();` -> 110


# If/Else Statements
- `if <condition> { <if block> } else { <else block> }`
  - The 'if block' gets executed if the 'condition' is true, and if it is false, the 'else block' gets executed
  - The else block is optional, it is not required
### Conditions
- A condition can be anything that evalutes to a boolean.
- This includes function calls, such as `myFarm.isPlantable()`
- This also includes comparators, which are !=, == , >=, <=, >, <, 
- "and" and "or" can be used to create a condition containing multiple sub-conditions

# For Loops
- Can be used to loop through a list of items, performing the same operation on each item
- You can loop through the list of every single crop, as well as the list of crops planted on your farm
  - The list for all crops is "Crops", the list for crops on your farm is \<farm name>
- `for \<name> in \<list> { \<code block> }`
  - `for c in Crops {
    if myFarm.isCropPlantable(c) {
    myFarm.plantFarm(c, 8);
    }
    }` -> plants each viable crop in 8 tiles
  - `for d in myFarm {
    totalYield = totalYield + d.getYield();
    }` -> sums the yield of every planted crop on myFarm

# Self-defined Functions
- You can define your own functions to replace any repetitive code with a simple function call.
- `def <function name> (<arguments>) -> <return type> { <function implementation> }`
  - The arguments are formatted as: `<name> : <type>`, with different arguments separated by a comma
    - `def isOkToPlant(c: Crop, f: Farm)`
  - The return type is one of the classes defined above
  - The function implementation must include a return statement in it
    - return true;
- Full example:
  - `def isOkToPlant(c: Crop, f: Farm) -> Bool {
              Bool canPlant = false;
              if (c.getYield() > 3) and (c.getSeason() == f.getSeason()) {
              canPlant = true;
              }
              return canPlant;
              }`
- When calling the function, use `<function name>(<parameters>)`
  - `Bool b = isOkToPlant(Blueberry, myFarm);`
# Show Function
- These are pre-defined functions allowing users to log variables to the console
- `showBool(Bool b)` -> prints the value of b to the console
- `showFarm(Farm f)` -> prints the backend representation of the farm f to the console
- `showCrop(Crop c)` -> prints the backend representation of crop c to the console
- `showNum(Num n)` -> prints the number n to the console
- `showStr(String s)` -> prints the string s to the console

