# Quiz Development & Extension Guide

Welcome to the Kids Quiz Platform! This platform is built to make adding new interactive quizzes effortless and modular.

## How to Add a New Quiz

### Step 1: Create your quiz folder and files
Create a new directory under quizzes/, for example quizzes/science/:
- index.html
- style.css
- script.js

### Step 2: Include the Quiz SDK in your HTML
In your quiz HTML page, link the Quiz SDK:
`html
<script src=../../js/quiz-sdk.js></script>
`

### Step 3: Call QuizSDK.submitScore(...) when the quiz finishes
Whenever the child completes the last question or game level, call:
`javascript
window.QuizSDK.submitScore({
  score: 10,       // Points earned by student
  maxScore: 10     // Maximum possible points
});
`

### Step 4: Register your quiz in quizzes/manifest.js
Open quizzes/manifest.js and add your quiz to the array:
`javascript
window.QUIZ_MANIFEST = [
  {
    id: quiz-math-basics,
    title: Math Wonders: Star Numbers,
    description: Addition and fun counting challenges,
    path: quizzes/template/sample-quiz.html,
    maxScore: 10
  },
  {
    id: quiz-science-animals,
    title: Science: Animal Friends,
    description: Learn about animal habitats,
    path: quizzes/science/index.html,
    maxScore: 10
  }
];
`

That is it! The central shell will automatically discover the new quiz, incorporate it into the progress bar, track the student score, and include it in the exported TXT reports.
