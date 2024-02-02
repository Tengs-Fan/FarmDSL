import { Func } from '../vm/Function';

function echo(num: number): number {
    return num;
}

export class DefaultFunctions {
    
    private static functions: { [key: string]: Func } = {
        echo: new Func(
            ["Num"],  // Args
            "Num",    // Return
            echo,
        ),
    };

    static addDefaultFunctions(): Map<string, Func> {
        const map = new Map<string, Func>();

        // Iterate over the static 'functions' object and add each Func to the map
        Object.entries(DefaultFunctions.functions).forEach(([name, func]) => {
            map.set(name, func);
        });

        return map;
    }
}
