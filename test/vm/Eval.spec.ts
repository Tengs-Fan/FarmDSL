import {expect} from "chai";
import {Context} from "../../src/vm/Context";
import {parseProgram} from "../../src/frontend/Parse";
import {transProgram} from "../../src/frontend/Trans";

describe("transProgram", () => {
    it("First branch of if should be evaluated", () => {
        const text: string = `
            Num a = 1;
            if (true) {
                a = 2;
            } else {
                a = 3;
            }
            `;
        const tree = parseProgram(text, false);
        const program = transProgram(tree, false);
        const context = new Context();
        program.eval(context);

        const tree2 = parseProgram("a;", false);
        const program2 = transProgram(tree2, false);
        const secondResult = program2.eval(context);
        expect(secondResult.value).to.equal(2);
    });

    it("Second branch of if should be evaluated", () => {
        const text: string = `
            Num a = 1;
            if (false) {
                a = 2;
            } else {
                a = 3;
            }
            `;
        const tree = parseProgram(text, false);
        const program = transProgram(tree, false);
        const context = new Context();
        program.eval(context);

        const tree2 = parseProgram("a;", false);
        const program2 = transProgram(tree2, false);
        const secondResult = program2.eval(context);
        expect(secondResult.value).to.equal(3);
    });

    it("Nested if should be evaluated", () => {
        const text: string = `
            Num a = 1;
            if (false) {
                a = 4;
            } else {
                if (false) {
                    a = 2;
                } else {
                    a = 3;
                }
            }
            `;
        const tree = parseProgram(text, false);
        const program = transProgram(tree, false);
        const context = new Context();
        program.eval(context);

        const tree2 = parseProgram("a;", false);
        const program2 = transProgram(tree2, false);
        const secondResult = program2.eval(context);
        expect(secondResult.value).to.equal(3);
    });
});
