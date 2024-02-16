Use this file to commit information clearly documenting your check-ins' content. If you want to store more information/details besides what's required for the check-ins that's fine too. Make sure that your TA has had a chance to sign off on your check-in each week (before the deadline); typically you should discuss your material with them before finalizing it here.

# Check-in 5 Report Items

## Status of user study (should be completed this week at the latest)
### If you've done it, what were the findings? Did it go smoothly?
The user studies went smoothly. The findings include:
- Changing the “Water” attribute in crops to “WaterRequirement”
- To make Corn and corn and “corn” interchangeables in the names of the crops since these were common spelling variations used for users which caused frustration for them. 
- When the plantFarm function fails, the error message is not fully expressive and is not instructive as to a helpful suggestions/next step.
- Change cropQuantity() to cropCapacity() (cropQuantity feels like it should return the number of already planted crops on the farm)
- Show current water usage in displayFarm() in addition to max water usage

## What are the key elements of feedback you've learned from it?
Users liked the syntax however a number of areas of improvement were noted that are listed above.

## Are there any last changes to your design, implementation or tests?
Our 3 features are implemented. We are debating if we want to output the farm in a graphical format versus the current text format. We are also thinking of allowing users to define their own functions.

## What will these improvements enable?
A graphical farm will look more pleasing to the users. Giving users the ability to define their own functions derives from the fact that users are the ones closest to their problems/pain point and there might be use cases that we have not implemented that a user might want to implement themselves using our DSL. 

## Plans for final video (possible draft version). 
We are working on the examples of DSL that will be used in the demo video. In the video we want to present a comprehensive overview of the project's features, improvements, and user feedback. We haven’t decided which team members will record the demo.

## Who is responsible for the rest?
We are working on this as a team.

## Make sure to check it for length, working sound etc.
Okay.

## Planned timeline for the remaining days.
Finalize decision on graphical vs. text format. Implement any additional user-defined function features. Begin drafting and editing the final video. Aim for completion by the end of reading break.

## What is there left to do?
The two features mentioned above (graphical layout and user-defined functions), bug fixes, and the improvements suggested by user-study 
If you want to, you can feel free to submit early (before the break)!

--------------------
# Check-in 4 Report Items

## Status of implementation:
### Component-wise progress
- Fully implemented Farm and Crop backend functions
- Added new functionality in lexer, parser and evaluator for OOP-like functionality, specifically to call functions on Farm and crop objects. 
- Currently implementing Display Farm function

## Which tests are passing, and which not?
The backend tests for Farm functionality like plantFarm are passing.
The tests for Parse program are also passing multiple and nested statement tests.
Some of the tests for the module that converts the ANTLR parse tree to our AST are failing.

## Which extra tests still need to be written/made?
To enhance our testing coverage, we plan to develop end-to-end tests for the entire system, encompassing both positive and negative scenarios. Additionally, we aim to implement integration tests focusing on both positive and negative cases to ensure robust functionality between individual modules.

## Plans for final user study.
We plan to conduct a user study with participants who have varying levels of technical and programming literacy. This will help us gather diverse feedback and ensure that our language is accessible to a broad audience. We also plan to have a higher sample size of participants.

## Are there any major differences from the previous one? If so, what are the reasons?
Our first user study used a paper mock to simulate the DSL. This time we are using an actual working REPL of our DSL and have multiple features implemented. This will give the users a richer and authentic experience and provide us with more relevant and detailed feedback.
Make sure to find suitable users (different from the first study!)

## Planned timeline for the remaining days.
Testing: Complete and refine unit tests for parser and evaluator components.
Integration Testing: Conduct end-to-end testing for the entire language to ensure smooth interactions between components.
Bug Fixing: Dedicate time for identifying and fixing bugs or issues uncovered during testing.
Documentation: Ensure that all features, syntax changes, and error messages are well-documented for users.
Stretch goals: We might want to improve the syntax of our DSL if we have the time. We might also want to add additional functionality such as a time feature to our farm and add scheduling for watering crops etc.

## Plans for integration/end-to-end testing
Our integration and end-to-end testing plans involve concluding the system design by specifying the outputs of each module and defining the format of the returned values. We aim to complete these tests by Check-In 5, ensuring thorough coverage for regression testing to maintain the stability of our implementation.

## Be sure to test for smooth error-handling (as well as expected results working)
We're implementing and testing detailed error messages, ensuring users receive clear feedback on issues such as undefined variables or function misuse.
Make sure to schedule some time for bug-fixing!
We are allocating extra time in the last few days to address bugs discovered during testing, with priority given to critical issues that can affect our demo. We’re also hoping to get a somewhat stable and user-friendly release for the final user study.

--------------------

# Check-in 3 Report Items
## Explain a mockup of your concrete language design (as used for your first user study), including descriptions of both the syntax and what is meant to happen.
Create Farm and Crop objects:
```Farm myFarm =  Farm[Name: ‘myFarm’, Length: 100, Height: 12, Polyculture: Y, MaxWaterUsage: 1500, Season: Summer];```
Creates a farm that the user can plant crops on
```Crop myCrop = Crop[Name: ‘elderberry’, Season: Summer, Water: 45, SellPrice: 110];```
Creates a new type of crop that the user can plant on farm
if/else statements:
```If (condition) { block } else { code block }```
Allows user to execute code if the condition is true, otherwise executes the else code block. Examples of conditions below.
Pre-defined functions:
```Plant(‘corn’, 5, 10, 8, 12);```
Plants the crop ‘corn’ in the rectangle from x=5 to x=10, y=8 to y=12. x/y start from the top left corner, and the bounds are inclusive (so this would plant a 6x5 rectangle of corn).
```PossibleCrop(‘corn’, 1, 4, 5, 6)```
Returns true if corn is a possible crop in this farm region, based on seasonality and water constraints, along with if any of the spaces in that region are already planted.


### Include the example snippets you used in your user study, and their outputs.
```
Farm myFarm =  Farm[Name: ‘myFarm’, Length: 100, Height: 12, Polyculture: Y, MaxWaterUsage: 1500, Season: Summer];
Crop myCrop = Crop[Name: ‘elderberry’, Season: Summer, Water: 45, SellPrice: 110];
if (PossibleCrop(‘corn’, 5, 10, 8, 12)) {
		Plant(‘corn’, 5, 10, 8, 12);
} else {
		if (PossibleCrop(‘elderberry’, 5, 10, 8, 12)) {
			Plant(‘elderberry’, 5, 10, 8, 12);
		}
}
```

This code will define a summer farm of length 100 and 12 with max water usage of 1500 units. It then defines a new type of crop, ‘elderberry’. The first if statement checks if ‘corn’ is a possible crop. ‘Corn’ is a common crop that we have pre-defined in our compiler, as a fall crop. Since ‘Corn’ is a fall crop, the code then switches into the else block, and checks if ‘elderberry’ is a possible crop. Because its season matches the season of our farm, this returns true, and ‘elderberry’ is planted in the region from x=5 to x=10 and y=8 to y=12 (30 units).



## Notes about your first user study.
### What did they find easy/difficult?
Easy: Users liked the type system of “farm” and “crop” types which they found to be clear and understandable.
Difficult: Users were unsure which crops they could use. They also struggled with visualizing the coordinates of the farm to use in the “plant” and “possibleCrop” functions. The farm definition syntax was very long and easy to get wrong.

### What did you learn from your user(s)?
A display farm function would be necessary to implement in order to make the best use of the given functions of “possibleCrop” and “plant”. A display crops function would be useful so users know which crops are pre-defined/available in the database. This could potentially be done by adding a foreach loop functionality. The farm definition syntax could be simplified by presenting prompts, or alternatively good documentation provided to the user so it’s easier to remember.  

### Is there anything you would have done differently? Can this be done for your final user study?
We would like to survey users of varying technical levels/programming literacy so based on that feedback we can appeal to the broadest cross-section of possible users.


## What changes to your language design have you made so far, or are considering?
We are considering adding more predefined functions. For example, a function similar to plant() that just takes in a crop and a number, and just plants that number of crops anywhere available on the farm. Also a possibleAmount() function that takes in a crop, and returns the number of possible units of that crop that could be planted.


### How does this affect the example snippets you include here?
This will make the example snippet slightly more complex, allowing the user to write if statements based on the num returned by possibleAmount(), and just planting crops based on a total number of units. However, it won’t significantly impact the general structure and logic of our language.

## Any changes to your project timeline/plan that you need to make?
We are considering adding loop functionality as a stretch goal but don’t expect it to add too much additional work.


## Are there new tests you can write now, based on your current project status?
### How can your snippets be made into unit tests, and for which component(s)?
We can write unit tests for the parser, by giving the syntax as the input and checking the returned AST against the AST we desire for this input. We can also write a unit test for the evaluator, giving the AST for the snippet as input, and checking the output against a Farm object that we desire. This will essentially function as a modularized end-to-end test, since the output tested by the parser test should be the same as the input tested by the evaluator test.


### What about planned error handling in your components? Tests for these?
For types like "Farm" and "Crop", we can verify that they have all the required fields. We can also add a validation step that checks the values assigned to these fields for e.g. “Season” can only accept values of: Winter and Summer; Area and “Water requirement” can only be positive values etc. We can also add unit tests for these requirements.

We can also have dynamic checks for the parser where using a variable (crop/farm) that has not been defined, will throw an exception.

For our functions like possibleCrop and Plant, we will have “number of arguments” and argument type checking. We will also have unit tests for these.

Within the evaluator we would like to implement exceptions that give helpful error messages for example if a call to plant fails the exception should provide a reason for why it failed for e.g. water requirement exceeded or not enough space or seasonal incompatibility etc.

--------------------

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

--------------------

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
