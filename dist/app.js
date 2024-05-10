import * as fs from "fs";
import * as path from "path";
async function readFile(relativeFilePath) {
    const currentFilePath = new URL(import.meta.url).pathname;
    const currentDirPath = path.dirname(currentFilePath);
    console.log("currentFilePath" + currentFilePath);
    console.log("currentDirPath" + currentFilePath);
    const filePath = path.resolve(currentDirPath, relativeFilePath);
    try {
        const data = await fs.promises.readFile(filePath, "utf8");
        console.log(data);
    }
    catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
    }
}
const relativeFilePath = "../scrimba-info.txt";
readFile(relativeFilePath);
