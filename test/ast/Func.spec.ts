import {expect, use} from "chai";
import {Context} from "../../src/vm/Context";
import {parseProgram} from "../../src/frontend/Parse";
import {transProgram} from "../../src/frontend/Trans";

describe("transProgram", () => {
    it("Should be able to define a function", () => {
        const text = `
            def foo(x: Num) -> Num {
                return x + 1;
            }
            def bar(x: Num) -> Num { 
                return x * 2;
            }
            foo(foo(2) + bar(1));
            `;
        const tree = parseProgram(text, false);
        const program = transProgram(tree, false);
        const context = new Context();
        const result = program.eval(context);
        expect(result.value).to.equal(6);
    });
});
