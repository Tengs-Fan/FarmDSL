Use this file to commit information clearly documenting your check-ins' content. If you want to store more information/details besides what's required for the check-ins that's fine too. Make sure that your TA has had a chance to sign off on your check-in each week (before the deadline); typically you should discuss your material with them before finalizing it here.

---
# Check-in 2 Report Items

## Planned division of main responsibilities between team members, considering how to enable working in parallel as much as possible. Consider the following points:

### Modular design for the software system: what is the input, output of each component? Who is responsible for each component? Do you want to be jointly responsible for some components?
- Components:
  - **Parser:** Input is the DSL text, output is the parsed AST
  - **Interpreter:** Input is the AST, output is a series of global variables
  - **Visualizer:** This is our ‘stretch goal’, so if we have the time to implement it, we will. It will be a React frontend translate the matrix farm layout into a visual, color representation of the farm.
- Responsibilities:
  - Parser → Tengs
  - Interpreter and Visualizer work will be divided amongst the remaining team members once there is more clarity as to what work is required at each component. Team members can also assist Tengs if the Parser workload is heavier than expected.

### What is the data at each interface point? Are there invariants over the data other than the class structure?
- Data at each interface point:
  - Parser → Evaluator:
    - Data: List of valid ASTs
  - Evaluator → Visualizer
    - Data: TypeScript objects representing the farm layout
- At the moment, it is unclear as to whether or not there’ll be invariants over the data other than the class structure
  - Left-to-right interpretation of the AST (tentative)

### How will you be able to build component X independently? Can you write tests for component X independently of its dependent components?
- Yes, as long as we agree on the interface for each component. For example, if we agree on what a ‘farm’ object looks like, the tests for the interpreter can be written before the parser is finished, because we already know the structure of the object we are testing on. We will make use of stubs/mocks in order to test components independently without the need for a different component to be complete. We will also try to have clear documentation for each modular component so others working on different components can reference that and always have clarity about expected behavior/output.

### Who will be responsible for writing which tests, and when (will the same people write the tests as the code)?
- Two ideas (TBD):
  - We have enough people where we can have separate people who write tests vs. the code. One person can write parser tests, another can begin implementing the parser. When the test-writer is finished with tests, they can move over and help in the implementation.
    Similarly, one person can write the interpreter tests, while 2 others work on implementing the interpreter backend.
    This will also ensure test-driven development, which is the best for eliminating bugs.
  - The people who are working on a module/sub-module will be responsible for writing the relevant tests.

### Are there design or other project tasks (possibly including team management), other than these components, that need to be assigned/completed?
- Ensure that team members are maintaining updated documentation about the components they are working on so it can be referenced by others during asynchronous development work.
- We also need to do two small user studies for the DSL.

### Roadmap/timeline(s) for what should be done when, and how you will synchronise/check-in with each other to make sure progress is on-track. Talk clearly with your team members about your expectations for communication and progress, and what you will do as a team if someone falls behind.
* **Jan 29th:**
  - Finalize generic AST
  - Use AST to create an initial mockup of concrete language design
* **Jan 31st:**
  - Conduct first user study
* **Feb 2nd:**
  * Check-In 3 deliverables:
    * Mockup of concrete language design (as used for your first user study). 
    * Notes about first user study. Any changes to original language design, timeline/plan. Revision of project tests. 
    * Start implementation of modules
* **Feb 9th:**
  * Check-In 4 deliverables:
    * Submit status of implementation. 
    * Plans for final user study. 
    * Planned timeline for the remaining days.
* **Feb 16th:**
  * Check-In 5 deliverables:
    * Status of user study. 
    * Last changes to your design, implementation or tests. 
    * Plans for final video (possible draft version). 
    * Planned timeline for the remaining days.
* **Feb 19th:**
  * Completion of code 
* **Feb 26th:**
  * Submit project deliverables 
  * Final demo

### Summary of progress so far
* Decided on our two initial features based on TA feedback from Check-In 1
  * Feature #1: declarations
    * i.e. `Farm myFarm =  Farm[Name: ‘myFarm’, Area: 1200, GridLength: 10, Polyculture: Y, MaxWaterUsage: 1500, Season: Summer]`
  * Feature #2: conditionals
    * i.e. `IF PossibleCrop(‘corn’) { Plant(‘corn’, 5, 10, 8, 12) }`
* Determined the three main components of our DSL
* Determined the interface between each component at a general level (i.e. Parser → Evaluator: AST)

### TA Feedback
* Further clarified the concept of DSL features. The TA helped us recognize that one of our features was still considered declarative. Based on that feedback, we have decided to focus on two features for now, with the third feature being a stretch goal.
* Gave us suggestions on how to progress. As of right now, it is difficult to determine a concrete roadmap or divide responsibilities as we are not experienced with building DSLs and are unsure as to what kind of work is required at each stage. The TA suggested that we begin scaffolding our AST and start implementing it as soon as possible to help clarify these points.

---

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
