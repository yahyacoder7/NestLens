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
   * دالة الزيارة المتكررة (visit):
   * دالة فرعية تقوم بالمرور على كل عقدة (Node) في شجرة الـ AST للملف،
   * وفحص خصائصها ونوعها لاستخراج الفئات (Classes) والمزخرفات (Decorators).
   *
   * @param {ts.Node} node - العقدة البرمجية الحالية في شجرة AST الجاري فحصها.
   */
  function visit(node: ts.Node) {
    // أ. التحقق مما إذا كانت العقدة الحالية عبارة عن تعريف لفئة (Class Declaration)
    // ومما إذا كان اسم الفئة هو تحديداً "AppModule".
    if (ts.isClassDeclaration(node) && node.name?.text === "AppModule") {
      console.log(node.name?.text); // طباعة اسم الفئة للتأكد (مثال: "AppModule")

      // ب. الحصول على كافة المزخرفات (Decorators) المرتبطة بهذه الفئة.
      // نستخدم ts.getDecorators(node) المتوافق تماماً مع إصدارات TypeScript 5.0+.
      const decorators = ts.getDecorators(node);

      // ج. إذا كانت الفئة تحتوي على مزخرف واحد أو أكثر:
      if (decorators && decorators.length > 0) {
        // د. المرور على كل مزخرف (Decorator) تم العثور عليه:
        for (const decorator of decorators) {
          // التعبير الداخلي للمزخرف (مثال: في `@Module(...)` التعبير هو `Module(...)`)
          const expression = decorator.expression;

          // هـ. التأكد من أن المزخرف هو عبارة عن تعبير استدعاء (Call Expression) مثل `@Module()`
          if (ts.isCallExpression(expression)) {
            // الحصول على المعرّف المستدعى (مثال: الحصول على كلمة `Module` من استدعاء `Module(...)`)
            const innerExpression = expression.expression;

            // و. التحقق من أن هذا التعبير هو معرّف (Identifier) نصي بسيط لاستخراج اسمه:
            if (ts.isIdentifier(innerExpression)) {
              console.log(innerExpression.text); // طباعة اسم المزخرف (مثال: "Module")
            }
           
          }
        }
      } else {
        // في حال عدم وجود أي مزخرفات على هذه الفئة.
        console.log("nothing for this class");
      }
    }

    // ز. الاستمرار في الانتقال والتكرار عبر جميع العقد الفرعية التابعة للعقدة الحالية.
    // هذا يضمن زيارة شجرة الـ AST بالكامل بدون إغفال أي عقدة فرعية.
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return null;
}
