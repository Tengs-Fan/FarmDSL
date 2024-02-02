import { expect } from "chai";
import { typeToString, Result } from "../../src/ast/Type";
import * as sinon from "sinon";

describe("Type System", () => {
    describe("typeToString", () => {
        it("should correctly identify numbers", () => {
            expect(typeToString(42)).to.equal("Num");
        });

        it("should correctly identify strings", () => {
            expect(typeToString("Hello")).to.equal("String");
        });

        it("should correctly identify boolean values", () => {
            expect(typeToString(true)).to.equal("Bool");
            expect(typeToString(false)).to.equal("Bool");
        });

        it("should handle null values", () => {
            expect(typeToString(null)).to.equal("Null");
        });

    });

    describe("Result class", () => {
        it("should store and return the correct type and value", () => {
            const numResult = new Result("Num", 123);
            expect(numResult.type).to.equal("Num");
            expect(numResult.value).to.equal(123);

            const boolResult = new Result("Bool", true);
            expect(boolResult.type).to.equal("Bool");
            expect(boolResult.value).to.equal(true);
        });

        it("should display the correct information with show()", () => {
            let spy = sinon.spy(console, "log");
            const stringResult = new Result("String", "Test");
            stringResult.show();
            expect(spy.calledWith("Test")).to.be.true;
            spy.restore(); // Clean up the spy

            spy = sinon.spy(console, "log");
            const nullResult = new Result("Null", null);
            nullResult.show();
            expect(spy.called).to.be.false; 
            spy.restore(); // Clean up the spy
        });

    });

});

