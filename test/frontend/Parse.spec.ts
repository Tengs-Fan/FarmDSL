import {expect} from "chai";

import {parseProgram} from "../../src/frontend/Parse";

describe("parseProgram", () => {
    it("should correctly parse a simple expression", () => {
        const input = "a = 1 + 2;";
        const tree = parseProgram(input, false);
        // Adjust the assertions based on your actual parse tree structure
        expect(tree).to.not.be.null;
        expect(tree.getText()).to.equal("a=1+2;");
    });

    it("should handle nested expressions correctly", () => {
        const input = "b = (1 + 2) * 3;";
        const tree = parseProgram(input, false);
        expect(tree.getText()).to.equal("b=(1+2)*3;");
    });

    it("should parse multiple statements correctly", () => {
        const input = "x = 5; y = x * 2;";
        const tree = parseProgram(input, false);
        expect(tree.getText()).to.include("x=5;");
        expect(tree.getText()).to.include("y=x*2;");
    });

    it("should handle boolean expressions", () => {
        const input = "isTrue = false == true;";
        const tree = parseProgram(input, false);
        expect(tree.getText()).to.equal("isTrue=false==true;");
    });

    it("should parse a crop declaration", () => {
        const input = 'Crop crop = [Name: "elderberry", Season: "Summer", Water: 45, Yield: 75, SellPrice: 110];';
        const tree = parseProgram(input, false);
        expect(tree.getText()).to.equal('Cropcrop=[Name:"elderberry",Season:"Summer",Water:45,Yield:75,SellPrice:110];');
    });

    it("should parse a farm declaration", () => {
        const input = 'Farm farm = [Name: "myFarm", Area: 1200, GridLength: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];';
        const tree = parseProgram(input, false);
        expect(tree.getText()).to.equal('Farmfarm=[Name:"myFarm",Area:1200,GridLength:10,Polyculture:true,MaxWaterUsage:1500,Season:"Summer"];');
    });

    // it('should parse complex program with functions', () => {
    //     const input = `
    //         define max(a, b) {
    //             if (a > b) {
    //                 return a;
    //             }
    //             return b;
    //         }
    //         result = max(5, 10);
    //     `;
    //     const tree = parseProgram(input, false);
    //     expect(tree.getText()).to.include('define max(a,b)');
    //     expect(tree.getText()).to.include('result=max(5,10);');
    // });
});
