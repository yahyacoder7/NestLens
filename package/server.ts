import express from "express";
import open from "open";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { runASTAnalysis } from "./parser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function startNestLensServer() {
  const port = 4000; 
  const app = express();
  console.log("Analyzing NestJS project structure...");

  const data = runASTAnalysis();
  console.log("Analysis Completed!");

  const clientPath = path.join(__dirname, "client");
  app.use(express.static(clientPath));

  app.get("/api/data", (req, res) => {
    res.json(data);
  });
  
  app.listen(port, async () => {
    const url = `http://localhost:${port}`;
    console.log(`Nest Lens is ready at ${url}`);
    await open(url);
  });
}


startNestLensServer();
