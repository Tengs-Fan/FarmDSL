import {expect} from "chai";
import {Context} from "../../src/vm/Context";
import {parseProgram} from "../../src/frontend/Parse";
import {transProgram} from "../../src/frontend/Trans";

describe("Loop", () => {
    it("Should be able to define a function with a for loop", () => {
        const text = `
            Farm myFarm = [Name: "myFarm", Height: 10, Width: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];

            def isOkToPlant(c: Crop, f: Farm) -> Bool {
                Bool canPlant = false;
                if (c.getYield() > 3) and (c.getSeason() == f.getSeason()) {
                    canPlant = true;
                }
                return canPlant;
            }


            for c in Crops {
                if isOkToPlant(c, myFarm) {
                    myFarm.plantFarm(c, 8);
                }
            }

            Num totalYield = 0;

            for c in myFarm {
                totalYield = totalYield + c.getYield();
            }

            echo(totalYield);
            `;
        const tree = parseProgram(text, false);
        const program = transProgram(tree, false);
        const context = new Context();
        const result = program.eval(context);
        expect(result.value).to.equal(832);
    });
});
