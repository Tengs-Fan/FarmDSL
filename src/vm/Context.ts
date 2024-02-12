import {VariableError, FunctionError} from "../Error";
import {Variable} from "./Variable";
import {Func} from "./Function";
import {DefaultFunctions} from "../backend/Functions";
import {Type} from "../ast/Type";
import {Crop} from "../backend/Crop";
import * as fs from "fs";
import * as path from 'path';
import logger from "../Log";


export class Context {
    private parent?: Context;
    private variables: Map<string, Variable>;
    private functions: Map<string, Func>;

    constructor(parent? : Context) {
        this.parent = parent;
        this.variables = new Map();
        this.functions = new Map();

        if (this.parent === undefined) {
            this.addStoredCropsFromJSONFile();
            this.functions = DefaultFunctions.addDefaultFunctions(this.functions);
        }
    }

    private addStoredCropsFromJSONFile(): void {
        try {
            // Read the contents of the crops.json file
            const fileContent = fs.readFileSync(path.join(__dirname, './crops.json'), 'utf-8');

            // Parse the JSON content
            const cropsData: Crop[] = JSON.parse(fileContent);

            // Populate this.variables map with crops
            cropsData.forEach(crop => {
                const cropVariable: Variable = {
                    type: "Crop",  // Assuming "Crop" is a valid type string
                    value: crop,
                };

                // Use crop name as the key in variables map
                this.variables.set(crop.Name, cropVariable);
            });

            logger.verbose('Crops data loaded successfully.');
        } catch (error) {
            logger.error('Error reading crops file:', (error as Error).message);
        }
    }

    private addVariable(name: string, variable: Variable) {
        this.variables.set(name, variable);
    }

    newVariable(name: string, variable: Variable) {
        if (this.variables.has(name)) {
            throw new VariableError(`Variable ${name} already exists`);
        }
        this.addVariable(name, variable);
    }

    getVariable(name: string) : Variable {
        const variable = this.variables.get(name);
        if (variable === undefined ) {
            if (this.parent !== undefined) { 
                // This is a recursive call to getVariable to check the parent context
                return this.parent.getVariable(name);
            } else {
                throw new VariableError(`Variable ${name} does not exist`);
            }
        }
        return variable;
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
        variable.value = value;
    }

    private addFunction(name: string, func: Func) {
        this.functions.set(name, func);
    }

    newFunction(name: string, func: Func) {
        if (this.functions.has(name)) {
            if (this.parent !== undefined) { 
                this.parent.newFunction(name, func);
            } else {
                throw new FunctionError(`Function ${name} already exists`);
            }
        }
        this.addFunction(name, func);
    }

    getFunction(name: string): Func {
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

export const g_context = new Context();
