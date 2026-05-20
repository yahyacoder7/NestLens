import * as ts from "typescript";
import { NestProjectStructure } from "./tpes";
/**
 * the core function that parse the nest js project and extract the information needed
 * @param filepath  the path to the nest js project
 * @param config the configuration object
 */

export function parserNestLens(): NestProjectStructure | null {
  const filePath: string[] = ["C:\\Users\\Yahya Meksen\\Documents\\github-project\\ToDo-Manager-Project\\src\\app.module.ts"];
  const config: ts.CompilerOptions = {
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
  };

  const program = ts.createProgram(filePath, config);

  const sourceFile = program.getSourceFile(filePath[0]);
  if (!sourceFile) {
    console.log("No source file found");
    return null;
  }
  console.log("Source file found");

  function visit(node: ts.Node) {
    console.log("Found Node Kind:", ts.SyntaxKind[node.kind]);
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  
  return null;
}
