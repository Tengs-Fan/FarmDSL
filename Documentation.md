# Installation

## Prerequisites

Before installing the FarmDSL project, you need to install some system-level dependencies.

### MacOS

If you are on macOS, use Homebrew to install the required packages:

```sh
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

### Linux (Ubuntu/Debian)

For Linux users on a Debian-based system like Ubuntu, use `apt-get` to install the necessary libraries:

```sh
sudo apt-get update
sudo apt-get install pkg-config libcairo2-dev libpango1.0-dev libpng-dev libjpeg-dev giflib-dev librsvg2-dev
```

## Steps

After installing the system-level dependencies, follow these steps to set up the FarmDSL project:

1. **Clone the repository**

   ```sh
   git clone git@github.students.cs.ubc.ca:CPSC410-2023W-T2/Group12Project1.git
   cd Group12Project1
   ```

2. **Install dependencies**

   ```sh
   yarn install
   ```

   This will install all necessary dependencies
3. **Install and set up ANTLR**
    
    ```sh
    yarn setup-antlr 
    yarn lang
    ```

4. **Build the project**

   ```sh
   yarn build
   ```

# Running

After installation, you can use the following commands within the project directory:

- **Start the main application**

  ```sh
  yarn start
  ```

- **Run tests**

  ```sh
  yarn test
  ```

- **Check code coverage**

  ```sh
  yarn cover
  ```

- **Lint the project**

  ```sh
  yarn lint
  ```

- **Automatically fix linting issues**

  ```sh
  yarn fix
  ```

- **Prettify the code**

  ```sh
  yarn pretty
  ```

# Additional Information

- The project's output, including any generated images, will be located in the `output` directory.
- Logs are written to `application.log` and `error.log` in the project root.
- The grammar file for the DSL is `FarmExpr.g4` in the project root.
- Generated parser and lexer files from ANTLR are located in the `lang` directory.

Make sure to check out the `package.json` for additional scripts and project details.

# Git Hooks

This project uses custom Git hooks located in the `.githooks` directory. These are set up automatically when you install the project. Ensure they are executable:

```sh
chmod +x .githooks/*
```

The hooks include:

- `post-checkout`: Triggered after a successful `git checkout`.
- `pre-push`: Runs before pushing changes to the repository.

# Farm Planner DSL
This DSL allows farmers to plan out their farm and easily experiment with different layouts. Using our DSL, farmers can test out 
different crop combinations, water requirements, and farm shapes. With our unique displayFarm() feature, they even get to see a visual
representation of their farm, based on the crops they planted using the DSL.

# Type System and Variable Management
The DSL employs a static type system. This means that the type of every variable is determined at compile time, reducing runtime errors and increasing code clarity.

## Variables
Variables must be declared with a specific type, which tells the DSL what kind of data the variable will hold. This makes our code easier to understand and debug.

### Declaration
* To declare a variable without assigning a value immediately, use the following syntax:
```
<Type> <VariableName>;
```
* To declare a variable and assign it a value at the same time, use this syntax:
```
<Type> <VariableName> = <Value>;
```
### Assignment
After declaring a variable, you can assign or reassign its value using the equals (`=`) operator.

Example:
- `totalYield = 100; // Reassigns the value of totalYield`

## Types
- `Num` for numerical values,
  - `Num totalYield = 0;`
- `Bool` for boolean values,
  - `Bool isPlantable = true;`
- `Farm` for farm objects, 
  See [Farm](#Farm) for more details
- `Crop` for crop objects.
  See [Crop](#Crop) for more details

# Functions 
In the Farm Planner DSL, functions are a versatile tool for performing operations, managing farm and crop data, and customizing your farm planning experience. Functions in this DSL are categorized into three types to cater to various needs and preferences.

## 1. Inline Functions
Inline functions are built directly into the DSL and can be invoked from any part of your code. These functions are designed for general-purpose tasks such as outputting information to the console, making them highly accessible and easy to use.

Examples of inline functions include:
- `showBool(Bool b)`: Displays the value of a boolean variable `b` in the console.
- `showNum(Num n)`: Prints the numerical value `n` to the console.
- `showStr(String s)`: Outputs the string `s` to the console.
- `showFarm(Farm f)`: Visualizes the current state of farm `f`, showing its layout and crops.
- `showCrop(Crop c)`: Presents details about crop `c`, such as its type, season, and water requirements.

## 2. Object-Oriented Programming (OOP) Style Functions
These functions behave similarly to methods in object-oriented programming, where each function is associated with a specific class (e.g., `Farm` or `Crop`) and operates on the instance of that class. These pre-defined functions allow for direct manipulation and querying of farm and crop objects, facilitating a more intuitive and structured approach to managing your farm's data.

Examples include:
- `Farm.getSeason()`: Retrieves the season associated with a farm.
- `Crop.getYield()`: Returns the yield of a specific crop.
- `Farm.isCropPlantable(Crop c)`: Determines if crop `c` can be planted on the farm considering various factors like season and water requirements.
- `Farm.plantFarm(Crop c, Num quantity)`: Plants a specified quantity of crop `c` on the farm.

## 3. User-Defined Functions
User-defined functions offer the flexibility to replace any repetitive code with a simple function call. These functions can encapsulate any logic you define, from calculating optimal planting strategies to filtering crops based on custom criteria.

Defining a function:
```dsl
def <functionName>(<arguments>) -> <returnType> {
    // Function implementation
    return <value>;
}
```
- Arguments are declared with their type, and multiple arguments are separated by commas.
- The return type specifies what type of value the function will return.

Example:
```dsl
def isOkToPlant(c: Crop, f: Farm) -> Bool {
    Bool canPlant = false;
    if (c.getYield() > 3 and c.getSeason() == f.getSeason()) {
        canPlant = true;
    }
    return canPlant;
}
```
To invoke a user-defined function:
```dsl
Bool b = isOkToPlant(Blueberry, myFarm);
```

This categorization of functions enhances the DSL's usability, allowing users to interact with and manipulate farm data effectively, whether through direct method calls on objects, convenient inline functions, or the creation of bespoke functions for more complex logic.

# Farm & Crop

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
- **displayFarm()**: Returns a graphical representation of the farm, based on the crops planted so far. Generated image can be found in `./out`
  - `myFarm.displayFarm();` -> Pops up an image representing the farm layout
- **displayFarmConsole()**: Outputs text-representation of farm to console. Also includes statistical info about the farm.


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
- **displayCrop()**: Returns a graphical representation of this crop. Custom crops will be given a default image.
  - `myCrop.displayCrop();` -> Pops up a window displaying a picture of the given crop.


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

