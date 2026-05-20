import { test } from "./parser";

// process.argv[0] هو مسار النود
// process.argv[1] هو مسار ملف الـ cli.ts
// process.argv[2] هو الكلمة الأولى التي يكتبها المستخدم بعد اسم الأمر

const userCommand = process.argv[2];
const userInput = process.argv[3];

if (userCommand === "mytest") {
  console.log(test(userInput));
} else {
  console.log("command not found");
}
