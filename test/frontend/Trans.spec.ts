import {expect} from "chai";
import fs from "fs";
import path from "path";
import {FunctionError} from "../../src/Error";
import {Context} from "../../src/vm/Context";
import {parseProgram} from "../../src/frontend/Parse";
import {transProgram} from "../../src/frontend/Trans";
import {string} from "yargs";

describe("transProgram", () => {
    it("Default function call is ok", () => {
        const input = "add(1, 2);";
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(() => result.eval(new Context())).to.not.throw();
    });

    it("Function call with no arguments is ok", () => {
        const input = "FunctionwithNoArgs();";
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(() => result.eval(new Context())).to.throw(FunctionError);
    });

    it("Function call with one argument is ok", () => {
        const input = "FunctionwithOneArg(1);";
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(() => result.eval(new Context())).to.throw(FunctionError);
    });

    it("Instantiate a farm with valid parameters", () => {
        const input = 'Farm farm = [Name: "myFarm", Height: 100, Width: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];';
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        const context = new Context();
        result.eval(context);
        expect(context.getVariable("farm")).to.be.an("object");
    });

    it("Instantiate a farm with missing Name", () => {
        const input = 'Farm farm = [Height: 100, Width: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];';
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(() => result.eval(new Context())).to.throw(/property Name is required/);
    });

    it("Instantiate a farm with missing Height", () => {
        const input = 'Farm farm = [Name: "myFarm", Width: 10, MaxWaterUsage: 1500, Season: "Summer"];';
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(() => result.eval(new Context())).to.throw(/property Height is required/);
    });

    it("Instantiate a farm with missing Width", () => {
        const input = 'Farm farm = [Name: "myFarm", Height: 120, MaxWaterUsage: 1500, Season: "Summer"];';
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(() => result.eval(new Context())).to.throw(/property Width is required/);
    });

    it("Instantiate a farm with missing Polyculture", () => {
        const input = 'Farm farm = [Name: "myFarm", Height: 100, Width: 10, MaxWaterUsage: 1500, Season: "Summer"];';
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(() => result.eval(new Context())).to.throw(/property Polyculture is required/);
    });

    it("Instantiate a farm with missing MaxWaterUsage", () => {
        const input = 'Farm farm = [Name: "myFarm", Height: 100, Width: 10, Polyculture: true, Season: "Summer"];';
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(() => result.eval(new Context())).to.throw(/property MaxWaterUsage is required/);
    });

    it("Instantiate a farm with missing Season", () => {
        const input = 'Farm farm = [Name: "myFarm", Height: 100, Width: 10, Polyculture: true, MaxWaterUsage: 1500];';
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(() => result.eval(new Context())).to.throw(/property Season is required/);
    });

    it("Instantiate a crop with valid parameters", () => {
        const input = 'Crop crop = [Name: "elderberry", Season: "Summer", WaterRequirement: 45, Yield: 75, SellPrice: 110];';
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        const context = new Context();
        result.eval(context);
        expect(context.getVariable("crop")).to.be.an("object");
    });

    it("OOP function call for Farm and Crop is ok", () => {
        const input = `
        Farm farm = [Name: \"myFarm\", Height: 10, Width: 10, Polyculture: true, MaxWaterUsage: 1500, Season: \"Summer\"];
        farm.OOPCallTest();
        `;
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(result.eval(new Context()).value).to.equal(114514);

        const input2 = `
        Crop crop = [Name: "elderberry", Season: "Summer", WaterRequirement: 45, Yield: 75, SellPrice: 110];
        crop.OOPCallTest();
        `;
        const tree2 = parseProgram(input2, false);
        const result2 = transProgram(tree2, false);
        expect(result2.eval(new Context()).value).to.equal(1919810);
    });

    it("OOP function call for function not exist isn't ok", () => {
        const input = `
        Farm farm = [Name: \"myFarm\", Height: 10, Width: 10, Polyculture: true, MaxWaterUsage: 1500, Season: \"Summer\"];
        farm.noThisFunction();
        `;
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(() => result.eval(new Context())).to.throw(/Function * does not exist in Farm class/);

        const input2 = `
        Crop crop = [Name: "elderberry", Season: "Summer", WaterRequirement: 45, Yield: 75, SellPrice: 110];
        crop.noThisFunction();
        `;
        const tree2 = parseProgram(input2, false);
        const result2 = transProgram(tree2, false);
        expect(() => result2.eval(new Context())).to.throw(/Function * does not exist in Crop class/);
    });

    it("OOP function fro other type isn't ok ", () => {
        const input = `
        Num a = 1;
        a.OOPCallTest();
        `;
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(() => result.eval(new Context())).to.throw("The object is not a Farm or Crop");

        const input2 = `
        Bool a = true;
        a.OOPCallTest();
        `;
        const tree2 = parseProgram(input2, false);
        const result2 = transProgram(tree2, false);
        expect(() => result2.eval(new Context())).to.throw("The object is not a Farm or Crop");
    });

    it("Double Quote around string should be removed", () => {
        const input = '"Summer";';
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(result.eval(new Context()).value).to.equal("Summer");
    });

    it("All passing examples should pass", () => {
        // read input from examples folder
        const foldernames = fs.readdirSync("examples/should_pass/");
        var filenames: string[] = [];
        foldernames.forEach((foldername) => {
            const filesInFolder = fs.readdirSync(path.join("examples/should_pass/", foldername));
            filesInFolder.forEach((filename) => {
                filenames.push(path.join("examples/should_pass/", foldername, filename));
            });
        });

        filenames.forEach((filename) => {
            if (fs.statSync(filename).isFile()) {
                const content = fs.readFileSync(filename, "utf8");
                const tree = parseProgram(content, false);
                expect(() => transProgram(tree, false)).to.not.throw();
            }
        });
    });
});
