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

});
