import {expect} from "chai";
import {typeToString} from "../../src/ast/Type";
import {Crop} from "../../src/backend/Crop";
import {Farm} from "../../src/backend/Farm";
import {Context} from "mocha";


describe("Farm tests", () => {
    describe("plant farm successful", () => {
        it("farm planting is successful", () => {
            const corn: Crop = new Crop({Name: "corn", Season: "Summer", Water: 45, Yield: 75, SellPrice: 110});
            const farm: Farm = new Farm({Name: "farm", Area: 1200, GridLength: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"})
            const result = farm.plantFarm(corn,5);
            expect(result).to.equal(true);
            expect(farm.Crops[0][0]).to.equal(corn);
        });

        it("farm planting is successful due to polyculture being true and multiple crop types planted", () => {
            const corn: Crop = new Crop({Name: "corn", Season: "Summer", Water: 45, Yield: 75, SellPrice: 110});
            const apple: Crop = new Crop({Name: "apple", Season: "Summer", Water: 45, Yield: 75, SellPrice: 110});
            const farm: Farm = new Farm({Name: "farm", Area: 1200, GridLength: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"})
            const resultCorn = farm.plantFarm(corn,5);
            const resultApple = farm.plantFarm(apple,5);
            expect(resultCorn).to.equal(true);
            expect(resultCorn).to.equal(true);
            expect(farm.Crops[0][0]).to.equal(corn);
            expect(farm.Crops[0][6]).to.equal(apple);
        });

    });

    describe("plant farm unsuccessful", () => {

        it("farm planting is not successful due to polyculture being false and multiple crop types", () => {
            const corn: Crop = new Crop({Name: "corn", Season: "Summer", Water: 45, Yield: 75, SellPrice: 110});
            const apple: Crop = new Crop({Name: "apple", Season: "Summer", Water: 45, Yield: 75, SellPrice: 110});
            const farm: Farm = new Farm({Name: "farm", Area: 1200, GridLength: 10, Polyculture: false, MaxWaterUsage: 1500, Season: "Summer"})
            const resultCorn = farm.plantFarm(corn,5);
            const resultApple = farm.plantFarm(apple,5);
            expect(resultCorn).to.equal(true);
            expect(resultCorn).to.equal(false);
            expect(farm.Crops[0][0]).to.equal(corn);
            expect(farm.Crops[0][6]).to.equal(null);
        });
        it("farm planting is not successful due to farm and crop having incompatible seasons", () => {
            const peach: Crop = new Crop({Name: "peach", Season: "Winter", Water: 45, Yield: 75, SellPrice: 110});
            const apple: Crop = new Crop({Name: "apple", Season: "Summer", Water: 45, Yield: 75, SellPrice: 110});
            const farm: Farm = new Farm({Name: "farm", Area: 1200, GridLength: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"})
            let resultApple: boolean | Error;
            let resultPeach: boolean | Error;

            try {
                resultApple = farm.plantFarm(apple, 5);
            } catch (error: any) {
                resultApple = error;
            }

            try {
                resultPeach = farm.plantFarm(peach, 5);
            } catch (error: any) {
                resultPeach = error;
            }

            expect(resultApple).to.equal(true);
            expect(farm.Crops[0][0]).to.equal(apple);
            expect(resultPeach).to.be.an.instanceOf(Error);
            expect((resultPeach as Error).message.trim()).to.equal("The farm and crop have incompatible seasons. Crop season is Winter, Farm season is Summer");
            expect(farm.Crops[0][6]).to.equal(null);
        });


        it("farm planting is not successful due to quantity of crop greater than farm size", () => {
            const apple: Crop = new Crop({Name: "apple", Season: "Summer", Water: 45, Yield: 75, SellPrice: 110});
            const farm: Farm = new Farm({Name: "farm", Area: 1200, GridLength: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"})
            let resultApple: boolean | Error;


            try {
                resultApple = farm.plantFarm(apple, 101);
            } catch (error: any) {
                resultApple = error;
            }

            expect(resultApple).to.be.an.instanceOf(Error);
            expect((resultApple as Error).message.trim()).to.equal("The farm does not have enough space. There are only 100 spaces available.");
            expect(farm.Crops[0][0]).to.equal(null);
            expect(farm.Crops[9][9]).to.equal(null);
        });


    });
});