(function() {
  const questions = [
    {
      text: "What is 5 + 3?",
      options: ["6", "8", "9", "10"],
      answer: "8",
      points: 5
    },
    {
      text: "How many sides does a triangle have?",
      options: ["2", "3", "4", "5"],
      answer: "3",
      points: 5
    }
  ];

  let currentQ = 0;
  let totalScore = 0;
  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

  const questionText = document.getElementById("questionText");
  const optionsContainer = document.getElementById("optionsContainer");
  const feedbackBox = document.getElementById("feedbackBox");
  const headerTitle = document.querySelector(".sample-header h2");

  function renderQuestion() {
    const q = questions[currentQ];
    headerTitle.textContent = "🌟 Question " + (currentQ + 1) + " of " + questions.length;
    questionText.textContent = q.text;
    feedbackBox.textContent = "";
    optionsContainer.innerHTML = "";

    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.setAttribute("data-value", opt);
      btn.onclick = () => selectOption(opt, btn, q);
      optionsContainer.appendChild(btn);
    });
  }

  function selectOption(selectedOpt, btn, q) {
    const allBtns = optionsContainer.querySelectorAll(".option-btn");
    allBtns.forEach(b => b.disabled = true);

    if (selectedOpt === q.answer) {
      btn.classList.add("correct");
      feedbackBox.textContent = "🎉 Awesome! Correct!";
      feedbackBox.style.color = "var(--accent-green-dark)";
      totalScore += q.points;
    } else {
      btn.classList.add("wrong");
      feedbackBox.textContent = "Oops! The correct answer was " + q.answer;
      feedbackBox.style.color = "var(--accent-coral)";
    }

    setTimeout(() => {
      currentQ++;
      if (currentQ < questions.length) {
        renderQuestion();
      } else {
        feedbackBox.textContent = "🌟 Submitting your score...";
        setTimeout(() => {
          window.QuizSDK.submitScore({
            score: totalScore,
            maxScore: maxScore
          });
        }, 600);
      }
    }, 1200);
  }

  // Initialize
  renderQuestion();
})();
