import * as ts from "typescript";
import { NestProjectStructure } from "./tpes";
/**
 * the core function that parse the nest js project and extract the information needed
 * @param filepath  the path to the nest js project
 * @param config the configuration object
 */

export function parserNestLens(): NestProjectStructure | null {
  const filePath: string[] = [
    "C:\\Users\\Yahya Meksen\\Documents\\github-project\\ToDo-Manager-Project\\src\\app.module.ts",
  ];
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

  /**
   * Recursive AST Visitor Function:
   * Traverses every node in the file's Abstract Syntax Tree (AST),
   * inspecting its type and properties to identify target classes and their decorators.
   *
   * @param {ts.Node} node - The current AST node being visited.
   */
  function visit(node: ts.Node) {
    // 1. Check if the current node is a class declaration and if its name is exactly "AppModule".
    if (ts.isClassDeclaration(node) && node.name?.text === "AppModule") {
      console.log(node.name?.text); // Print the class name for verification (e.g., "AppModule")

      // 2. Retrieve all decorators attached to this class.
      // We use ts.getDecorators(node) which is fully compatible with TypeScript 5.0+.
      const decorators = ts.getDecorators(node);

      // 3. If the class has one or more decorators:
      if (decorators && decorators.length > 0) {
        // 4. Iterate over each decorator found:
        for (const decorator of decorators) {
          // Get the internal expression of the decorator (e.g., in `@Module(...)`, the expression is `Module(...)`)
          const expression = decorator.expression;

          // 5. Verify if the decorator's expression is a call expression (e.g., `@Module(...)` instead of `@Module`)
          if (ts.isCallExpression(expression)) {
            // Get the identifier being called (e.g., retrieve the identifier `Module` from the call `Module(...)`)
            const innerExpression = expression.expression;

            // 6. Confirm that the inner expression is a simple identifier to safely extract its name:
            if (ts.isIdentifier(innerExpression)) {
              console.log(innerExpression.text); // Print the decorator's name (e.g., "Module")
            }
          }
        }
      } else {
        // Log if no decorators are present on this class.
        console.log("nothing for this class");
      }
    }

    // 7. Recursively continue walking through all child nodes of the current node.
    // This ensures the entire AST tree is traversed and visited completely.
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return null;
}
