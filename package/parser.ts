import * as ts from "typescript";
/**
 * the core function that parse the nest js project and extract the information needed
 * @param filepath  the path to the nest js project
 * @param config the configuration object
 */
interface NestProjectStructure{
    modules:ModuleNode[]; 
    controllers:ControllerNode[];
    providers:ProviderNode[];   
}
interface ModuleNode{
    name:string;
    controllers:string[];
    providers:string[];
    imports:string[];
    exports:string[];
}
interface ControllerNode{
    name:string;
    prefix:string;
    dependencies:string[];
    routers:RouterNode[];
    
}
interface RouterNode{
    name:string;
    path:string;
    method:string;
}
interface ProviderNode{
    name:string;
    dependencies:string[];
    services:ServiceNode[];  
}
interface ServiceNode{
    name:string;
}
export function parserNestLens() {
  const filePath: string[] = ["./src/app.module.ts"];
  const config: ts.CompilerOptions = {
   experimentalDecorators:true,
   emitDecoratorMetadata:true,
   
  };
 
  const program = ts.createProgram(filePath, config);

  const sourceFile = program.getSourceFile(filePath[0]);
  if(!sourceFile) {
    console.log("No source file found");
    return 1;
  }
  console.log("Source file found");

  

  // 2. القواعد والشروط (Rules & Extraction):
  // سنمر على كل ملف من الملفات الممررة، وندخل داخل شجرة الـ AST الخاصة به.
  // القواعد التي نبحث عنها أثناء الدوران هي:

  // أ) قاعدة الكلاس (Class Declaration):
  // هل هذا السطر يعرّف كلاس؟ (لأن كل شيء في NestJS عبارة عن Class).

  // ب) قاعدة المزخرفات (Decorators):
  // إذا وجدنا كلاس، هل يمتلك @Module أو @Controller أو @Injectable؟
  // - إذا وجدنا @Module: سنحتاج لاستخراج ما بداخله (imports, controllers, providers).
  // - إذا وجدنا @Controller: سنحتاج لاستخراج الطرق (Methods) والروابط (Routes) مثل @Get أو @Post.
  // - إذا وجدنا @Injectable: سنعرف أن هذه الخدمة (Service) يمكن حقنها.

  // 3. تجميع البيانات وتصديرها (Output):
  // سنقوم بحفظ كل ما وجدناه في كائن (Object) منظم يحتوي على:
  // { modules: [], controllers: [], services: [] }
  // وفي النهاية نعيد هذا الكائن أو نحفظه كملف JSON.
  return 1;
}
