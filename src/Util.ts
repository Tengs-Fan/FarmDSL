import {platform} from "os";
import {exec} from "child_process";
import logger from "./Log";

export function openImage(imagePath: string) {
    let command;
    switch (platform()) {
        case "win32": // Windows
            command = `start ${imagePath}`;
            break;
        case "darwin": // macOS
            command = `open ${imagePath}`;
            break;
        case "linux": // Linux
            command = `xdg-open ${imagePath}`;
            break;
        default:
            throw new Error(`Unsupported platform: ${platform()}`);
    }

    exec(command, (error, stdout, ) => {
        if (error) {
            logger.error(`Error opening image: ${error.message}`);
            return;
        }
        logger.info(`Image opened: ${stdout}`);
    });
}

