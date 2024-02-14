import {ASTNode} from "./Ast";
import {Result} from "./Type";
import {Context} from "../vm/Context";
import {Expression} from "./Expression";
import {Farm} from "../backend/Farm";
import {Crop} from "../backend/Crop";
import {Type} from "./Type";

export class Pair implements ASTNode {
    name: string;
    value: Expression;

    constructor(name: string, value: Expression) {
        this.name = name;
        this.value = value;
    }
}

export class Pairs implements ASTNode {
    pairs: Pair[];

    constructor() {
        this.pairs = [];
    }

    addPair(pair: Pair) {
        this.pairs.push(pair);
    }
    addPairs(pairs: Pair[]) {
        this.pairs.push(...pairs);
    }

    private validate(requiredProps: {[key: string]: {type: string; required: boolean}}): void {
        const providedProps = new Set(this.pairs.map((p) => p.name));

        for (const prop in requiredProps) {
            if (requiredProps[prop].required && !providedProps.has(prop)) {
                throw new Error(`property ${prop} is required`);
            }
        }
    }

    private buildFarm(ctx: Context): Farm {
        this.validate(Farm.propertiesMetadata);

        const farmProps = this.pairs.reduce<{
            [key: string]: Type;
        }>((acc, pair) => {
            const value = pair.value.eval(ctx);
            acc[pair.name] = value.value as Type;
            return acc;
        }, {});

        return new Farm(farmProps);
    }

    private buildCrop(ctx: Context): Crop {
        this.validate(Crop.propertiesMetadata);

        const cropProps = this.pairs.reduce<{
            [key: string]: Type;
        }>((acc, pair) => {
            const value = pair.value.eval(ctx);
            acc[pair.name] = value.value as Type;
            return acc;
        }, {});

        return new Crop(cropProps);
    }

    public eval(ctx: Context, type: "Farm" | "Crop"): Result {
        switch (type) {
            case "Farm":
                return new Result("Farm", this.buildFarm(ctx));
            case "Crop":
                return new Result("Crop", this.buildCrop(ctx));
        }
    }
}
