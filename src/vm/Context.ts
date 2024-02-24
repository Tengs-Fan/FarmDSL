import {VariableError, FunctionError} from "../Error";
import {Variable} from "./Variable";
import {Function as MyFunction} from "../vm/Function";
import {parseProgram} from "../frontend/Parse";
import {transProgram} from "../frontend/Trans";
import {evalProgram} from "./Eval";
import {Type, TypeStr, typeToString} from "../ast/Type";
import {Farm} from "../backend/Farm";
import {Crop} from "../backend/Crop";
import {addInlineFunctions} from "../backend/Functions";
import * as fs from "fs";
import * as path from "path";
import logger from "../Log";

export class Context {
    private parent?: Context;
    private variables: Map<string, Variable>;
    private functions: Map<string, MyFunction>;

    constructor(parent?: Context, empty = false) {
        this.parent = parent;
        this.variables = new Map();
        this.functions = new Map();
        this.functions = addInlineFunctions(this.functions);

        if (parent !== undefined && empty === true) {
            throw new Error("Context can only be empty if it is the root context");
        }

        if (this.parent === undefined && empty === false) {
            this.addStandardLibrary();
        }
    }

    private addStandardLibrary() {
        if (this.parent !== undefined) {
            throw new Error("Standard library can only be added to the root context");
        }

        try {
            const filenames = fs.readdirSync("lib/");

            filenames.forEach((filename) => {
                const filePath = path.join("lib", filename);
                if (fs.statSync(filePath).isFile()) {
                    const content: string = fs.readFileSync(filePath, "utf8");
                    const tree = parseProgram(content, false);
                    const program = transProgram(tree, false);
                    /*const result = */ evalProgram(program, this);
                }
            });
        } catch (error) {
            console.log(error);
            logger.error(`Error reading standard library: ${error}, continue with partial standard library`);
        }
    }

    private addVariable(name: string, variable: Variable) {
        this.variables.set(name, variable);
    }

    newVariable(name: string, variable: Variable) {
        if (
            variable.type !== typeToString(variable.value) && // Check if the type of the variable matches the value
            variable.value !== null // but the type can be Null
        ) {
            throw new VariableError(`Type mismatch for variable ${name}, should be ${variable.type}, get ${typeToString(variable.value)}`);
        }
        if (this.variables.has(name)) {
            throw new VariableError(`Variable ${name} already exists`);
        }
        this.addVariable(name, variable);
    }

    getVariable(name: string): Variable {
        const variable = this.variables.get(name);
        if (variable === undefined) {
            if (this.parent !== undefined) {
                // This is a recursive call to getVariable to check the parent context
                return this.parent.getVariable(name);
            } else {
                throw new VariableError(`Variable ${name} does not exist`);
            }
        }
        return variable;
    }

    removeVariable(name: string) {
        const variable = this.variables.get(name);
        if (variable === undefined) {
            throw new VariableError(`The Variable ${name} to be deleted does not exist`);
        }
        this.variables.delete(name);
    }

    private getAllInstaceOfType(type: TypeStr): Type[] {
        const allVarOfType: Type[] = [];

        for (const [, variable] of this.variables) {
            if (variable.type === type && variable.value !== null) {
                allVarOfType.push(variable.value);
            }
        }

        if (this.parent !== undefined) {
            const allVarOfTypeParent = this.parent.getAllInstaceOfType(type);
            allVarOfType.push(...allVarOfTypeParent);
        }

        return allVarOfType;
    }

    getAllCrops(): Crop[] {
        return this.getAllInstaceOfType("Crop") as Crop[];
    }

    getAllFarms(): Type[] {
        return this.getAllInstaceOfType("Farm") as Farm[];
    }

    updateVariable(name: string, value: Type) {
        const variable = this.getVariable(name);
        if (variable === undefined) {
            if (this.parent !== undefined) {
                this.parent.updateVariable(name, value);
            } else {
                throw new VariableError(`Variable ${name} does not exist`);
            }
        }
        if (variable.type !== typeToString(value) && variable.value != null) {
            throw new VariableError(`Type mismatch for variable ${name}, should be ${variable.type}, get ${typeToString(value)}`);
        }
        variable.value = value;
    }

    private addFunction(name: string, func: MyFunction) {
        this.functions.set(name, func);
    }

    newFunction(name: string, func: MyFunction) {
        if (this.functions.has(name)) {
            if (this.parent !== undefined) {
                this.parent.newFunction(name, func);
            } else {
                throw new FunctionError(`Function ${name} already exists`);
            }
        }
        this.addFunction(name, func);
    }

    getFunction(name: string): MyFunction {
        const func = this.functions.get(name);
        if (func === undefined) {
            if (this.parent !== undefined) {
                return this.parent.getFunction(name);
            } else {
                throw new FunctionError(`Function ${name} does not exist`);
            }
        }
        return func;
    }
}

let g_context: Context;

export function getRootContext(): Context {
    if (g_context === undefined) {
        g_context = new Context(undefined);
    }
    return g_context;
}
