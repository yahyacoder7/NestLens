import * as ts from "typescript";
import path from "path";
import fs from "fs";

import {
  NestProjectStructure,
  ModuleNode,
  ControllerNode,
  RouterNode,
  ProviderNode,
  ServiceNode,
} from "./types.js";
/**
 * the core function that parse the nest js project and extract the information needed
 * @param filepath  the path to the nest js project
 * @param config the configuration object
 */

const structure: NestProjectStructure = {
  modules: [],
  controllers: [],
  providers: [],
};

function parserModule(node: ts.ClassDeclaration) {
  const moduleName = node.name?.text || "UnknowModule";

  const extractedImports: string[] = [];
  const extractedControllers: string[] = [];
  const extractedProviders: string[] = [];
  const extractedExports: string[] = [];

  const decorators = ts.getDecorators(node);
  if (!decorators || decorators.length === 0) return;

  const allowedDecorators = ["Module", "Controller", "Injectable"];

  const decorator = decorators.find((dec) => {
    if (
      ts.isCallExpression(dec.expression) &&
      ts.isIdentifier(dec.expression.expression)
    ) {
      const name = dec.expression.expression;
      return allowedDecorators.includes(name.text);
    }
    return false;
  });

  const decoratorExpression = decorator?.expression as ts.CallExpression;

  if (ts.isCallExpression(decoratorExpression)) {
    const configObject = decoratorExpression.arguments[0];
    if (configObject && ts.isObjectLiteralExpression(configObject)) {
      for (const prop of configObject.properties) {
        if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
          const propertyName = prop.name.text;
          const valueNode = prop.initializer;

          if (valueNode && ts.isArrayLiteralExpression(valueNode)) {
            for (const element of valueNode.elements) {
              let className: string;
              if (ts.isIdentifier(element)) {
                className = element.text;
              } else if (ts.isCallExpression(element)) {
                const expr = element.expression;
                className = ts.isPropertyAccessExpression(expr)
                  ? (expr.expression as ts.Identifier).text
                  : (expr as ts.Identifier).text;
              } else {
                continue;
              }
              if (propertyName === "imports") {
                extractedImports.push(className);
              } else if (propertyName === "controllers") {
                extractedControllers.push(className);
              } else if (propertyName === "providers") {
                extractedProviders.push(className);
              } else if (propertyName === "exports") {
                extractedExports.push(className);
              }
            }
          }
        }
      }
    }
  }
  const newModuleNode: ModuleNode = {
    name: moduleName,
    controllers: extractedControllers,
    providers: extractedProviders,
    imports: extractedImports,
    exports: extractedExports,
  };

  structure.modules.push(newModuleNode);
}

function parserController(node: ts.ClassDeclaration) {
  const controllerName = node.name?.text || "UnknownController";
  let baseRoute = "/";

  const decorators = ts.getDecorators(node);
  if (!decorators || decorators.length === 0) return;

  const controllerDecorator = decorators.find((dec) => {
    if (
      ts.isCallExpression(dec.expression) &&
      ts.isIdentifier(dec.expression.expression)
    ) {
      return dec.expression.expression.text === "Controller";
    }
    return false;
  });

  if (
    controllerDecorator &&
    ts.isCallExpression(controllerDecorator.expression)
  ) {
    const firsArg = controllerDecorator.expression.arguments[0];

    if (firsArg && ts.isStringLiteral(firsArg)) {
      baseRoute = firsArg.text;
    } else if (firsArg && ts.isObjectLiteralExpression(firsArg)) {
      for (const prop of firsArg.properties) {
        if (
          ts.isPropertyAssignment(prop) &&
          ts.isIdentifier(prop.name) &&
          prop.name.text === "path"
        ) {
          if (ts.isStringLiteral(prop.initializer)) {
            baseRoute = prop.initializer.text;
          }
        }
      }
    }
  }

  const extractedRouters: RouterNode[] = [];
  const extractedDependencies: string[] = [];
  const allowedHttpMethods = ["Get", "Post", "Delete", "Put", "Patch", "All"];

  for (const member of node.members) {
    if (ts.isMethodDeclaration(member) && ts.isIdentifier(member.name)) {
      const methodName = member.name.text;
      const methodDecorators = ts.getDecorators(member);

      if (!methodDecorators || methodDecorators.length === 0) continue;

      for (const decorator of methodDecorators) {
        if (
          ts.isCallExpression(decorator.expression) &&
          ts.isIdentifier(decorator.expression.expression)
        ) {
          const decoratorName = decorator.expression.expression.text;
          if (allowedHttpMethods.includes(decoratorName)) {
            let subPath = "";

            const routeArg = decorator.expression.arguments[0];
            if (routeArg && ts.isStringLiteral(routeArg)) {
              subPath = routeArg.text;
            }
            const routerNode: RouterNode = {
              name: methodName,
              path: subPath,
              method: decoratorName.toUpperCase(),
            };
            extractedRouters.push(routerNode);
          }
        }
      }
    }
    if (ts.isConstructorDeclaration(member)) {
      for (const param of member.parameters) {
        if (
          param.type &&
          ts.isTypeReferenceNode(param.type) &&
          ts.isIdentifier(param.type.typeName)
        ) {
          const serviceName = param.type.typeName.text;
          extractedDependencies.push(serviceName);
        }
      }
    }
  }
  const newControllerNode: ControllerNode = {
    name: controllerName,
    prefix: baseRoute,
    routers: extractedRouters,
    dependencies: extractedDependencies,
  };
  structure.controllers.push(newControllerNode);
}

function parserProvider(node: ts.ClassDeclaration) {
  const serviceName = node.name?.text || "UnknownProvider";
  const extractedDependencies: string[] = [];
  const extrectedServices: ServiceNode[] = [];

  for (const member of node.members) {
    if (ts.isConstructorDeclaration(member)) {
      for (const param of member.parameters) {
        if (
          param.type &&
          ts.isTypeReferenceNode(param.type) &&
          ts.isIdentifier(param.type.typeName)
        ) {
          const dependencyName = param.type.typeName.text;
          extractedDependencies.push(dependencyName);
        }
      }
    }
    if (ts.isMethodDeclaration(member) && ts.isIdentifier(member.name)) {
      const serviceNode: ServiceNode = {
        name: member.name.text,
      };
      extrectedServices.push(serviceNode);
    }
  }

  const newProviderNode: ProviderNode = {
    name: serviceName,
    dependencies: extractedDependencies,
    services: extrectedServices,
  };

  structure.providers.push(newProviderNode);
}

export function runASTAnalysis(): NestProjectStructure | null {
  const currentProjectRoot = process.cwd();
  let targetFile = path.join(currentProjectRoot, "src", "app.module.ts");

if (!fs.existsSync(targetFile)) {
    console.log("⚠️ Running in Local Dev Mode: Using fallback project path...");
   
    targetFile = "C:\\Users\\Yahya Meksen\\Documents\\github-project\\ToDo-Manager-Project\\src\\app.module.ts";
  }

if(!fs.existsSync(targetFile)){
    console.error(`\n❌ Error: Could not find 'src/app.module.ts' in this directory.`);
    console.error(`💡 Please make sure you are running this tool from the root folder of a NestJS project.\n`);
    process.exit(1);
  }
  const filePath: string[] = [
    targetFile
  ];
  const config: ts.CompilerOptions = {
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
  };

  const program = ts.createProgram(filePath, config);

  const allFiles = program.getSourceFiles();
  const excludeRegex = /\.(spec|test)\.ts$/;

  console.log("Start dynamic scanning of all files repeatedly");

  for (const file of allFiles) {
    const filePath = file.fileName;

    if (!(file.isDeclarationFile || filePath.includes("node_modules"))) {
      if (!excludeRegex.test(filePath)) {
        visit(file);
      }
    }
  }

  function visit(node: ts.Node) {
    if (ts.isClassDeclaration(node)) {
      const decorators = ts.getDecorators(node);

      if (!decorators) return;

      if (decorators && decorators.length > 0) {
        const allowedDecorators = ["Module", "Controller", "Injectable"];

        const decorator = decorators.find((dec) => {
          if (
            ts.isCallExpression(dec.expression) &&
            ts.isIdentifier(dec.expression.expression)
          ) {
            const name = dec.expression.expression;
            return allowedDecorators.includes(name.text);
          }
          return false;
        });

        const decExpr = (decorator?.expression as ts.CallExpression)
          ?.expression;
        const decoratorName =
          decExpr && ts.isIdentifier(decExpr) ? decExpr.text : undefined;

        if (decoratorName === "Module") {
          parserModule(node);
        } else if (decoratorName === "Controller") {
          parserController(node);
        } else if (decoratorName === "Injectable") {
          parserProvider(node);
        } else {
          console.log(`Unknown decorator: ${decoratorName}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  return structure;
}
