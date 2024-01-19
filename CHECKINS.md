Use this file to commit information clearly documenting your check-ins' content. If you want to store more information/details besides what's required for the check-ins that's fine too. Make sure that your TA has had a chance to sign off on your check-in each week (before the deadline); typically you should discuss your material with them before finalizing it here.

# Check-in 1 Report Items

## Provide a brief description of your planned DSL:
### What is the high-level purpose of your DSL? What kind of users is it aimed at? What will it enable users to do?
- Idea: Agriculture and Farming DSL
- High-level Purpose: Our DSL will allow farmers to plan out their farm organization by defining crops and animals, and when they run the code, we will return a graph showing a possible layout for their farm. Our algorithm will take into account watering and feeding schedules and seasonality.
- Target Users: Farmers looking to arrange their farm, or players of the stardew valley video game
- Enable Users to: drastically reduce time spent planning out their farm and save them the headache of doing so


### What are the 2-3 rich features of your DSL? A rich feature should be more complex than a choice in a set (e.g., the ability to choose between colours for a title is not a “rich” feature). 
- Define dimensions of their farm 
- Define a crop/animal by name
- Define number of units of each crop/animal to add to farm 
- Define a watering/feeding schedule for a crop/plant
- For a crop, define its seasonality
- For an animal, in addition to its feeding schedule, define its:
- Relationship with other animals
i.e. chicken.doesNotPlayWellWith(cow) == CANNOT position chickens/cows next to each other. If this property is not defined, defaults to canPlayWellWith == True.
How much space it prefers
i.e. `chicken.requiresSpace(2) == each chicken requires >=2 units of space`
Whether it prefers to be in groups or alone 
i.e. `chicken.requiresFriends(3) == each chicken requires >=3` other chickens to be around it. Therefore, must position chickens in groups of 4+ on the farm. 
Given these constraints, when the user runs the code, they will get a potential farm layout
Will issue a warning/error to the farmer if their specifications are unable to be met
i.e. farmer has a 2x2 farm (4 units of space), but wants to plant 6 tomatoes → “Error: Not enough space to plant 6 tomatoes. Amount of available space remaining: 4”  

### What customisation will each feature enable? Which features can be combined to interact in useful or creative ways?
Because our objects each have a string-defined name, you can define any kind of crop or animal you want
The watering and feeding schedule enables users to note the care differences between objects. When the layout is generated, these schedules will be taken into account, by placing crops with similar watering schedules next to each other, for example.
The crop seasonality enables users to note the important fact that most crops are not year round. As a result, we hope to give the user multiple layouts for when different crops are in season.
Example snippets of your DSL that illustrate at least each rich feature, and any interesting interaction between those.

```
Var farm = Farm(‘My Farm’, 10, 10) // name, width, height
Var corn = Crop(“Corn”);
corn.water(“1W”);
corn.season(“fall”);
If ‘fall’:
	plant(corn)
For animal in animals
farm.add(corn, 4) // add 4 units of corn to the farm 
Var peach = Crop(“Peach”);
peach.water(“3D”)
peach.season(“summer”);
farm.add(peach, 4) // add 4 units of peaches to the farm

Var cow = Animal(“Cow”);
cow.feed(“2”);
cow.vet(“4”);
cow.requiresSpace(2) // each cow requires >= 2 units of space
farm.add(cow, 2) 
Var chicken = Animal(“Chicken”)
chicken.feed(“1D”)
chicken.requiresSpace(1)
chicken.doesNotPlayWellWith(cow) // do not position chickens next to cows 
farm.add(chicken, 6)
```


### Note any important changes/feedback from TA discussion. 
The TA gave us useful feedback that is summarized below:
1. The focus of the project should be on designing and implementing the DSL. If our program has complex functionality (for e.g. space optimization algorithms) we should ideally make use of an external graphing library for it. 
2. That implementing a complex graphical output will look nice but might have the consequence of using up too much of our time which would be better spent on implementing the DSL itself.
3. Clarified the concept of a DSL feature to us. All of our suggested features were declarative and we need to add some features that are dynamic for e.g. by incorporating control flow like Loops/IF statements. 

### Note any planned follow-up tasks or features still to design.
Our first feature which provides a data structure for crop/animals was accepted. We need to design two additional features that will need to be more complex, specifrically not declarative but dynamic. We will also add more detail to our proposal including code examples of the two new features we are designing.

