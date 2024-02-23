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

    it("Should be able to define a function with no arguments", () => {
        const text = `
            def foo() -> Num {
                return 1;
            }
            foo();
            `;
        const tree = parseProgram(text, false);
        const program = transProgram(tree, false);
        const context = new Context();
        const result = program.eval(context);
        expect(result.value).to.equal(1);
    });

    it("Should be able to define a function with multiple arguments", () => {
        const text = `
            def foo(x: Num, y: Num) -> Num {
                return x + y;
            }
            foo(1, 2);
            `;
        const tree = parseProgram(text, false);
        const program = transProgram(tree, false);
        const context = new Context();
        const result = program.eval(context);
        expect(result.value).to.equal(3);
    });

    it("Should be able to define a function with multiple arguments and use them in a nested call", () => {
        const text = `
            def foo(x: Num, y: Num) -> Num {
                return x + y;
            }
            def bar(x: Num, y: Num) -> Num {
                return foo(x, y);
            }
            bar(1, 2);
            `;
        const tree = parseProgram(text, false);
        const program = transProgram(tree, false);
        const context = new Context();
        const result = program.eval(context);
        expect(result.value).to.equal(3);
    });

    it("Should be able to define a function with multiple arguments and use them in a nested call with a literal", () => {
        const text = `
            def foo(x: Num, y: Num) -> Num {
                return x + y;
            }
            def bar(x: Num) -> Num {
                return foo(x, 2);
            }
            bar(1);
            `;
        const tree = parseProgram(text, false);
        const program = transProgram(tree, false);
        const context = new Context();
        const result = program.eval(context);
        expect(result.value).to.equal(3);
    });
});
