/**
 * Central Quiz Manifest
 * Register all interactive quizzes here.
 * The Shell automatically detects available quizzes from this list in sequence.
 */
window.QUIZ_MANIFEST = [
  {
    id: "quiz-arduino-hardware",
    title: "مهمة اليوم: مكونات لوحة أردوينو (Arduino Uno)",
    description: "التعرف على المكونات التسعة للوحة أردوينو أونو",
    path: "quizzes/arduino/index.html",
    maxScore: 9
  },
  {
    id: "quiz-arduino-basics-mcq",
    title: "اختبار أساسيات الأردوينو (Arduino Basics Quiz)",
    description: "15 سؤال اختيار من متعدد لاختبار المفاهيم الأساسية للأردوينو",
    path: "quizzes/arduino-mcq/index.html",
    maxScore: 15
  }
];
