import * as VMErr from '../Error';
import { Variable } from './Variable';
import { Function } from './Function';

export class Context {
    private variables: Map<string, Variable>;
    private functions: Map<string, Function>;

    constructor() { this.variables = new Map(); }

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
}

export const g_context = new Context();
