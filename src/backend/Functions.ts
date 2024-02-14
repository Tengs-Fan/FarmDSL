import {Function as MyFunction} from "../vm/Function";
import {Result, TypeStr} from "../ast/Type";
import {FunctionError} from "../Error";
import {Context} from "../vm/Context";
import {Farm} from "./Farm";
import {Crop} from "./Crop";

function show(obj: Farm | Crop) {
    console.log(obj);
}

function echo(num: number): number {
    return num;
}

class InlineFunction extends MyFunction {
    args: TypeStr[];
    func: Function;

    constructor(args: TypeStr[], ret: TypeStr, func: Function) {
        super(ret);
        this.args = args;
        this.func = func;
    }

    // Any argument mismatch will raise an error
    eval(ctx: Context, args: Result[]): Result {
        // Check argument count
        if (args.length !== this.args.length) {
            throw new FunctionError(`Argument count mismatch: expected ${this.args.length}, got ${args.length}`);
        }
        // Check each argument type
        for (let i = 0; i < args.length; i++) {
            if (args[i].type !== this.args[i]) {
                throw new FunctionError(`Argument type mismatch: expected ${this.args[i]}, got ${args[i].type}`);
            }
        }
        const arg_value = args.map((arg) => arg.value);

        return new Result(this.return, this.func(...arg_value));
    }
}

const functions: {
    [key: string]: InlineFunction;
} = {
    echo: new InlineFunction(
        ["Num"], // Args
        "Num", // Return
        echo,
    ),
    showFarm: new InlineFunction(
        ["Farm"], // Args
        "Null", // Return
        show,
    ),
    showCrop: new InlineFunction(
        ["Crop"], // Args
        "Null", // Return
        show,
    ),
};

export function addInlineFunctions(map: Map<string, MyFunction>): Map<string, MyFunction> {
    // Iterate over the static 'functions' object and add each Func to the map
    Object.entries(functions).forEach(([name, func]) => {
        map.set(name, func);
    });
    return map;
}
