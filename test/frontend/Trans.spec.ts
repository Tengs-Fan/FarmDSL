import {expect, use} from "chai";

import {FunctionError} from "../../src/Error";
import {Context} from "../../src/vm/Context";
import {parseProgram} from "../../src/frontend/Parse";
import {transProgram} from "../../src/frontend/Trans";

describe("transProgram", () => {

    it("Default function call is ok", () => {
        const input = "echo(1);";
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

    it("OOP function call for Farm and Crop is ok", () => {
        const input =
        `
        Farm farm = [Name: \"myFarm\", Area: 1200, GridLength: 10, Polyculture: true, MaxWaterUsage: 1500, Season: \"Summer\"];
        farm.OOPCallTest();
        ` ;
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(result.eval(new Context()).value).to.equal(114514);

        const input2 =
        `
        Crop crop = [Name: "elderberry", Season: "Summer", Water: 45, Yield: 75, SellPrice: 110];
        crop.OOPCallTest();
        ` ;
        const tree2 = parseProgram(input2, false);
        const result2 = transProgram(tree2, false);
        expect(result2.eval(new Context()).value).to.equal(1919810);
    });

    it("OOP function fro other type isn't ok ", () => {
        const input =
        `
        Num a = 1;
        a.OOPCallTest();
        ` ;
        const tree = parseProgram(input, false);
        const result = transProgram(tree, false);
        expect(() => result.eval(new Context())).to.throw();
    });

});
