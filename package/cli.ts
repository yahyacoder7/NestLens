import { parserNestLens } from "./parser";



const userCommand = process.argv[2];

if (userCommand === "start") {
    parserNestLens();
}
