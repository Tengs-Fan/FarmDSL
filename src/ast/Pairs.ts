import {ASTNode} from "./Ast";
import {Result} from "./Type";
import {Context} from 'vm/Context'
import {Expression} from "./Expression";
import {Farm} from "backend/Farm";
import {Crop} from "backend/Crop";

export class Pair implements ASTNode {
    name: string;
    value: Expression;

    constructor(name: string, value: Expression) { this.name = name; this.value = value; }
}

export class Pairs implements ASTNode {
    pairs: Pair[];

    constructor() { this.pairs = []; }

    addPair(pair: Pair) { this.pairs.push(pair); }
    addPairs(pairs: Pair[]) { this.pairs.push(...pairs); }

    private buildFarm() : Farm {
        return new Farm();
    }

    private buildCrop() : Crop {
        return new Crop();
    }

    public eval(type: "Farm" | "Crop"): Result {
        switch(type) {
            case "Farm":
                return new Result("Farm", this.buildFarm());
            case "Crop":
                return new Result("Crop", this.buildCrop());
        }
    }
}
