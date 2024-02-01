import * as VMErr from '../Error';
import { Variable } from './Variable';
import { Func } from './Function';
import { DefaultFunctions } from 'backend/Functions';

export class Context {
    private variables: Map<string, Variable>;
    private functions: Map<string, Func>;

    constructor() {
        this.variables = new Map(); 
        this.functions = DefaultFunctions.addDefaultFunctions();
    }

    private addVariable(name: string, variable: Variable) {
        this.variables.set(name, variable);
    }

    newVariable(name: string, variable: Variable ) {
        if (this.variables.has(name)) {
            throw new VMErr.VariableError(`Variable ${name} already exists`);
        }
        this.addVariable(name, variable);
    }

    getVariable(name: string) {
        if (!this.variables.has(name)) {
            throw new VMErr.VariableError(`Variable ${name} does not exist`);
        }
        return this.variables.get(name);
    }

    updateVariable(name: string, value: any) {
        const variable = this.getVariable(name);
        if (variable === undefined) {
            throw new VMErr.VariableError(`Variable ${name} does not exist`);
        }
        variable.value = value;
    }

    private addFunction(name: string, func: Func) {
        this.functions.set(name, func);
    }

    newFunction(name: string, func: Func) {
        if (this.functions.has(name)) {
            throw new VMErr.FunctionError(`Function ${name} already exists`);
        }
        this.addFunction(name, func);
    }

    getFunction(name: string) {
        if (!this.functions.has(name)) {
            throw new VMErr.FunctionError(`Function ${name} does not exist`);
        }
        return this.functions.get(name);
    }
}

export const g_context = new Context();
