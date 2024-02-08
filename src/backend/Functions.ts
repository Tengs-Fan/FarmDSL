import {Func} from "../vm/Function";
import {Farm} from "./Farm";
import {Crop} from "./Crop";
import {number} from "yargs";
import {farmAvailableSpace, plantFarm} from "./FarmFunctions";

function echo(num: number): number {
    return num;
}

export class DefaultFunctions {
    private static functions: {
        [key: string]: Func;
    } = {
        echo: new Func(
            ["Num"], // Args
            "Num", // Return
            echo,
        ),
        plantFarm: new Func(
            ["String", "String", "Num"], // Args
            "Num", // Return
            plantFarm,
        ),
        farmAvailableSpace: new Func(
            ["String"], // Args
            "Num", // Return
            farmAvailableSpace,
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
