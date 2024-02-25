import {Type} from "../ast/Type";

import {Crop} from "./Crop";
import {FunctionError} from "../Error";
import logger from "../Log";
import mergeImages from "merge-images";
import {Canvas, Image} from "canvas";
import {openImage} from "../Util";
import fs from "fs";
import path from "path";

export type MergeImageSrc = {
    src: string;
    x: number;
    y: number;
};

export type DisplayFarmDimensions = {
    farmHeight: number;
    farmWidth: number;
    barnOffset: number;
    fenceOffset: number;
    outputWidth: number;
    outputHeight: number;
};

export class Farm {
    static propertiesMetadata = {
        Name: {type: "String", required: true},
        Height: {type: "Num", required: true},
        Width: {type: "Num", required: true},
        Polyculture: {type: "Bool", required: true},
        MaxWaterUsage: {type: "Num", required: true},
        Season: {type: "String", required: true},
        //TODO: how to state the type of crop[][] when it is not a type in the DSL
        Crops: {type: "Crop[][]", required: false},
    };

    static properties = Object.keys(Farm.propertiesMetadata);

    Name: string;
    Height: number;
    Width: number;
    Polyculture: boolean;
    MaxWaterUsage: number;
    Season: "Spring" | "Summer" | "Fall" | "Winter" | "All";
    Crops: Crop[][];

    constructor(props: {[key: string]: Type}) {
        this.Name = props.Name as string;
        this.Height = props.Height as number;
        this.Width = props.Width as number;
        this.Polyculture = props.Polyculture as boolean;
        this.MaxWaterUsage = props.MaxWaterUsage as number;
        if (props.Season !== "Spring" && props.Season !== "Summer" && props.Season !== "Fall" && props.Season !== "Winter" && props.Season !== "All") {
            throw new Error("Season must be one of Spring, Summer, Fall, Winter, or All");
        }
        this.Season = props.Season as "Spring" | "Summer" | "Fall" | "Winter" | "All";
        this.Crops = Array.from({length: this.Height}, () => Array(this.Width).fill(null));
    }

    getSeason(): "Spring" | "Summer" | "Fall" | "Winter" | "All" {
        return this.Season;
    }

    getName(): string {
        return this.Name;
    }

    getHeight(): number {
        return this.Height;
    }

    getWidth(): number {
        return this.Width;
    }

    getPolyculture(): boolean {
        return this.Polyculture;
    }

    getMaxWaterCapacity(): number {
        return this.MaxWaterUsage;
    }

    getCrops(): Crop[][] {
        return this.Crops;
    }

    plantFarm(plantingCrop: Crop, quantity: number): Farm {
        //If proposed plantation would exceed farm water capacity
        const waterRequirementOfCrop: number = plantingCrop.WaterRequirement * quantity;
        const remainingWaterCapacity: number = this.MaxWaterUsage - this.getWaterUsageOfFarm();
        if (waterRequirementOfCrop > remainingWaterCapacity) {
            throw new Error(`The proposed planting would exceed farm's water capacity by ${waterRequirementOfCrop - remainingWaterCapacity}`);
        }

        // If crop and farm seasonality do not match
        if (this.Season !== plantingCrop.Season) {
            throw new Error(
                `The farm and crop have incompatible seasons. ${plantingCrop.Name}'s season is ${plantingCrop.Season}, ${this.Name}'s season is ${this.Season}`,
            );
        }

        // If farm does not have space
        if (this.availableSpace() < quantity) {
            throw new Error(`The farm does not have enough space. There are only ${this.availableSpace()} spaces available.`);
        }

        // If polyculture is false and another crop is already planted, throw error.
        const uniqueCropsInFarm = this.getUniqueCrops();
        const ADifferentCropIsAlreadyPresent: boolean = uniqueCropsInFarm.some((crop) => crop.Name !== plantingCrop.Name);
        if (this.Polyculture == false && ADifferentCropIsAlreadyPresent) {
            throw new Error("Multiple different crops cannot be planted when polyculture is false");
        }
        // Start planting crop
        const result: Farm = this.startPlanting(plantingCrop, quantity);
        logger.debug(`Planting was successful`);
        return result;
    }

    availableSpace(): number {
        let count: number = 0;
        for (let x = 0; x < this.Height; x++) {
            for (let y = 0; y < this.Width; y++) {
                if (this.Crops[x][y] == null) {
                    count++;
                }
            }
        }
        return count;
    }

    isCropPlantable(plantingCrop: Crop): boolean {
        // If crop and farm seasonality do not match
        if (this.Season !== plantingCrop.Season) {
            return false;
        }
        // If polyculture is false and another crop is already planted, throw error.
        const uniqueCropsInFarm = this.getUniqueCrops();
        const ADifferentCropIsAlreadyPresent: boolean = uniqueCropsInFarm.some((crop) => crop.Name !== plantingCrop.Name);
        if (this.Polyculture == false && ADifferentCropIsAlreadyPresent) {
            return false;
        }
        return true;
    }

    cropCapacity(plantingCrop: Crop): number {
        const emptySlotsAvailable = this.availableSpace();
        const remainingWaterCapacity: number = this.MaxWaterUsage - this.getWaterUsageOfFarm();
        const possibleQuantity = Math.floor(remainingWaterCapacity / plantingCrop.WaterRequirement);
        const cropQuantity = Math.min(emptySlotsAvailable, possibleQuantity);
        return cropQuantity;
    }

    getWaterUsageOfFarm(): number {
        let waterUsage: number = 0;
        for (let x = 0; x < this.Height; x++) {
            for (let y = 0; y < this.Width; y++) {
                if (this.Crops[x][y] != null) {
                    waterUsage += this.Crops[x][y].WaterRequirement;
                }
            }
        }
        return waterUsage;
    }

    private getUniqueCrops(): Crop[] {
        const uniqueCrops: Crop[] = [];
        for (let x = 0; x < this.Height; x++) {
            for (let y = 0; y < this.Width; y++) {
                const currentCrop = this.Crops[x][y];
                if (currentCrop !== null && !uniqueCrops.some((crop) => crop.Name === currentCrop.Name)) {
                    uniqueCrops.push(currentCrop);
                }
            }
        }
        return uniqueCrops;
    }

    private plantIfEmpty(x: number, y: number, aCrop: Crop): boolean {
        if (this.Crops[x][y] === null) {
            this.Crops[x][y] = aCrop;
            logger.debug(`Planted ${aCrop.Name} at position (${x}, ${y}).`);
            return true;
        } else {
            logger.debug(`There's already a crop at position (${x}, ${y}). Skipping this space.`);
            return false;
        }
    }

    private startPlanting(myCrop: Crop, quantity: number): Farm {
        if (quantity < 0) {
            throw new Error("Crop quantity cannot be negative.");
        }
        let quantityLeft: number = quantity;
        for (let x = 0; x < this.Height; x++) {
            for (let y = 0; y < this.Width; y++) {
                if (quantityLeft == 0) {
                    return this;
                }
                if (this.plantIfEmpty(x, y, myCrop)) {
                    quantityLeft--;
                }
            }
        }
        return this;
    }

    call(funcName: string, args: Type[]): Type {
        if (typeof this[funcName as keyof this] === "function") {
            return (this[funcName as keyof this] as Function)(...args);
        } else {
            throw new FunctionError(`Function ${funcName} does not exist in Farm class`);
        }
    }

    displayFarm() {
        const srcDir = "assets";
        const outputConfig = this.getDisplayFarmOutputConfig(srcDir);
        const outputPath = path.join(srcDir, "farm.png");
        mergeImages(outputConfig.srcList, {
            Canvas: Canvas,
            Image: Image,
            width: outputConfig.outputWidth,
            height: outputConfig.outputHeight,
        }).then((b64) => {
            const data = b64.split(",")[1];
            const binaryData = Buffer.from(data, "base64");
            fs.writeFileSync(outputPath, binaryData);

            openImage(outputPath);
        });
    }

    private getDisplayFarmDimensions(): DisplayFarmDimensions {
        const farmHeight = this.Height;
        const farmWidth = this.Width;

        const barnOffset = 2;
        const fenceOffset = 1;
        return {
            farmHeight,
            farmWidth,
            barnOffset,
            fenceOffset,
            outputWidth: (farmWidth + barnOffset + 2 * fenceOffset) * 100,
            outputHeight: (farmHeight + barnOffset + 2 * fenceOffset) * 100,
        };
    }

    private getSeasonalBackground(season: string, srcDir: string): string {
        const seasonMap: {[key: string]: string} = {
            Spring: "spring.png",
            Summer: "summer.png",
            Fall: "fall.png",
            Winter: "winter.png",
        };
        return path.join(srcDir, seasonMap[season]);
    }

    private getSeasonalIcon(season: string, srcDir: string): MergeImageSrc {
        const iconMap: {[key: string]: string} = {
            Spring: "flower.png",
            Summer: "sun.png",
            Fall: "leaf.png",
            Winter: "snowman.png",
        };
        return {
            src: path.join(srcDir, iconMap[season]),
            x: 300,
            y: 50,
        };
    }

    private tileBackgroundImage(backgroundSrc: string, dim: DisplayFarmDimensions): MergeImageSrc[] {
        const tiles = [];
        const tileSize = 320; // the background image is 1000x1000 pixels
        for (let y = 0; y < dim.outputHeight; y += tileSize) {
            for (let x = 0; x < dim.outputWidth; x += tileSize) {
                tiles.push({
                    src: backgroundSrc,
                    x: x,
                    y: y,
                });
            }
        }
        return tiles;
    }

    public getDisplayFarmOutputConfig(srcDir: string) {
        const dim = this.getDisplayFarmDimensions();
        const backgroundSrc = this.getSeasonalBackground(this.Season, srcDir);
        const backgroundTiles = this.tileBackgroundImage(backgroundSrc, dim);

        const seasonalIcon = this.getSeasonalIcon(this.Season, srcDir);

        const barn: MergeImageSrc = {
            src: path.join(srcDir, "barn.png"),
            x: 50,
            y: 50,
        };

        const srcPaths: Set<string> = new Set(fs.readdirSync(srcDir));

        const plantedCrops = this.getPlantedCropSrcList(srcDir, srcPaths, dim);
        const horizontalFences = this.getHorizontalFenceSrcList(srcDir, dim);
        const verticalFences = this.getVerticalFenceSrcList(srcDir, dim);

        return {
            srcList: [...backgroundTiles, seasonalIcon, barn, ...plantedCrops.flat(), ...horizontalFences.flat(), ...verticalFences.flat()],
            ...dim,
        };
    }

    private getVerticalFenceSrcList(srcDir: string, dim: DisplayFarmDimensions): MergeImageSrc[] {
        const verticalFences = [];
        for (let i = 0; i < 2; i++) {
            for (let j = 1; j < dim.farmHeight + dim.fenceOffset; j++) {
                verticalFences.push({
                    src: path.join(srcDir, `${i == 0 ? "left" : "right"}-vertical-fence.png`),
                    x: i == 0 ? 0 : (dim.farmWidth + dim.fenceOffset) * 100,
                    y: (j + dim.barnOffset) * 100,
                });
            }
        }
        return verticalFences;
    }

    private getHorizontalFenceSrcList(srcDir: string, dim: DisplayFarmDimensions): MergeImageSrc[] {
        const horizontalFences = [];
        for (let i = 0; i < 2; i++) {
            for (let j = 1; j < dim.farmWidth + dim.fenceOffset; j++) {
                horizontalFences.push({
                    src: path.join(srcDir, `${i == 0 ? "top" : "bottom"}-horizontal-fence.png`),
                    x: j * 100,
                    y: i == 0 ? dim.barnOffset * 100 : (dim.farmHeight + dim.fenceOffset + dim.barnOffset) * 100,
                });
            }
        }
        return horizontalFences;
    }

    private getPlantedCropSrcList(srcDir: string, srcPaths: Set<string>, dim: DisplayFarmDimensions): MergeImageSrc[][] {
        return this.Crops.map((row, r) =>
            row.map((col, c) => {
                const imageName = `${this.Crops[r][c] === null ? "empty" : this.Crops[r][c].Name.toLowerCase()}.png`;
                const imagePath = path.join(srcDir, srcPaths.has(imageName) ? imageName : "custom.png");
                return {
                    src: imagePath,
                    x: (c + dim.fenceOffset) * 100,
                    y: (r + dim.fenceOffset + dim.barnOffset) * 100,
                };
            }),
        );
    }

    displayFarmConsole() {
        const farmHeight: number = this.Crops.length;
        const farmWidth: number = this.Crops[0].length;

        const initialFarm: string[][] = Array.from({length: farmHeight}, () =>
            Array.from(
                {length: farmWidth + 2}, // Extra 2 cols for left-right borders
                () => "",
            ),
        );

        // Determine width of middle cells
        // Side cells will have a width of 1
        const longestCropName: number = this.Crops.map((row) => row.map((crop) => (crop === null ? 0 : crop.Name.length))).reduce(
            (longestName, row) => Math.max(longestName, ...row),
            0,
        );
        const middleCellLength = Math.max(longestCropName + 2, 3); // defaults to 3
        const padding = " ";

        // Format crop cells and left-right borders
        const formattedFarm = this.getFormattedFarm(initialFarm, farmWidth, padding, middleCellLength);

        // Format top-bottom borders
        const topBottomBorder: string = Array.from({length: farmWidth + 2}, (row, i) => {
            const val = "\u2014";
            if (i !== 0 && i !== farmWidth + 1) {
                return padding + val.repeat(middleCellLength - 2) + padding;
            } else {
                return padding; // Empty corners
            }
        }).join("");

        // Format farm metadata
        const title: string = `Name: ${this.Name}`;
        const farmInfo: string = [
            `Available Space: ${this.availableSpace()}`,
            `Height: ${this.Height}`,
            `Width: ${this.Width}`,
            `Current Water Usage: ${this.getWaterUsageOfFarm()}`,
            `Max Water Usage: ${this.MaxWaterUsage}`,
            `Polyculture: ${this.Polyculture}`,
            `Season: ${this.Season}`,
        ].join("\n");

        // Join everything together
        console.log([title, topBottomBorder, formattedFarm, topBottomBorder, farmInfo].join("\n"));
    }

    private getFormattedFarm(initialFarm: string[][], farmWidth: number, padding: string, middleCellLength: number) {
        return initialFarm
            .map((row, r) =>
                row
                    .map((col, c) => {
                        if (c === 0 || c === farmWidth + 1) {
                            return "|";
                        } else {
                            const val = this.Crops[r][c - 1] === null ? "" : this.Crops[r][c - 1]!.Name;
                            const leftPadding = padding.repeat(Math.floor((middleCellLength - val.length) / 2));
                            const rightPadding = padding.repeat(middleCellLength - val.length - leftPadding.length);
                            return leftPadding + val + rightPadding;
                        }
                    })
                    .join(""),
            )
            .join("\n");
    }

    OOPCallTest(): number {
        return 114514;
    }
}
