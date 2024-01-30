import * as VMErr from './Error';
import { Variable } from './Variable';

export class Context {
    private globalVariables: Map<string, Variable>;

    constructor() { this.globalVariables = new Map(); }

    private addVariable(name: string, variable: Variable) {
        this.globalVariables.set(name, variable);
    }

    newVariable(name: string, variable: Variable ) {
        if (this.globalVariables.has(name)) {
            throw new VMErr.VariableError(`Variable ${name} already exists`);
        }
        this.addVariable(name, variable);
    }

    getVariable(name: string) {
        if (!this.globalVariables.has(name)) {
            throw new VMErr.VariableError(`Variable ${name} does not exist`);
        }
        return this.globalVariables.get(name);
    }

    updateVariable(name: string, value: any) {
        const variable = this.getVariable(name);
        if (variable === undefined) {
            throw new VMErr.VariableError(`Variable ${name} does not exist`);
        }
        variable.value = value;
    }
}

export const g_context = new Context();
