/**
 * Main Shell & Quiz Navigation Coordinator
 */
(function() {
  const config = window.APP_CONFIG || {};
  const manifest = window.QUIZ_MANIFEST || [];
  const storage = window.QuizStorage;

  // DOM Elements
  const registrationScreen = document.getElementById("registrationScreen");
  const quizRunnerScreen = document.getElementById("quizRunnerScreen");
  const completionScreen = document.getElementById("completionScreen");

  const registrationForm = document.getElementById("registrationForm");
  const studentNameInput = document.getElementById("studentName");
  const studentGradeSelect = document.getElementById("studentGrade");

  const globalStudentHeader = document.getElementById("globalStudentHeader");
  const headerStudentName = document.getElementById("headerStudentName");
  const headerStudentGrade = document.getElementById("headerStudentGrade");
  const headerQuizStatus = document.getElementById("headerQuizStatus");

  const runnerStudentInfo = document.getElementById("runnerStudentInfo");
  const runnerQuizCounter = document.getElementById("runnerQuizCounter");
  const runnerProgressBar = document.getElementById("runnerProgressBar");
  const quizFrame = document.getElementById("quizFrame");

  const finalScoreDisplay = document.getElementById("finalScoreDisplay");
  const finalPercentageDisplay = document.getElementById("finalPercentageDisplay");
  const finalBreakdownList = document.getElementById("finalBreakdownList");
  const nextStudentBtn = document.getElementById("nextStudentBtn");

  // State
  let currentQuizIndex = 0;

  function showScreen(screen) {
    [registrationScreen, quizRunnerScreen, completionScreen].forEach(s => s.classList.remove("active"));
    screen.classList.add("active");

    if (screen === registrationScreen) {
      if (globalStudentHeader) globalStudentHeader.style.display = "none";
    } else {
      if (globalStudentHeader) globalStudentHeader.style.display = "flex";
    }
  }

  function init() {
    if (manifest.length === 0) {
      alert("Notice: No quizzes registered in quizzes/manifest.js.");
    }

    // Check if there is an active incomplete session
    const existingSession = storage.getCurrentSession();
    if (existingSession && !existingSession.completedAt) {
      resumeSession(existingSession);
    } else {
      showScreen(registrationScreen);
    }

    // Language switcher toggle
    const langBtn = document.getElementById("langSwitchBtn");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        window.I18n.toggleLang();
      });
    }

    if (window.I18n) {
      window.I18n.onLanguageChange(() => {
        updateDynamicTexts();
      });
    }

    // Form Submission
    registrationForm.addEventListener("submit", handleRegistration);
    nextStudentBtn.addEventListener("click", handleStartOver);

    // Listen for QuizSDK postMessage events
    window.addEventListener("message", handleQuizMessage);
  }

  function updateDynamicTexts() {
    const session = storage.getCurrentSession();
    if (session) {
      if (headerStudentName) headerStudentName.textContent = session.name;
      if (headerStudentGrade) headerStudentGrade.textContent = session.grade;
      if (runnerStudentInfo) runnerStudentInfo.textContent = session.name + " (" + session.grade + ")";
    }
    if (quizRunnerScreen.classList.contains("active")) {
      const quiz = manifest[currentQuizIndex];
      if (quiz && runnerQuizCounter) {
        const counterText = window.I18n ? 
          window.I18n.t("runner.quizCounter", { current: currentQuizIndex + 1, total: manifest.length }) :
          "Quiz " + (currentQuizIndex + 1) + " of " + manifest.length;
        runnerQuizCounter.textContent = counterText + ": " + quiz.title;
      }
    }
  }

  function handleRegistration(e) {
    e.preventDefault();
    const name = studentNameInput.value.trim();
    const grade = studentGradeSelect.value;

    if (!name || !grade) return;

    const session = storage.startSession(name, grade);
    startQuizFlow(session);
  }

  function resumeSession(session) {
    currentQuizIndex = session.currentQuizIndex || 0;
    if (currentQuizIndex >= manifest.length) {
      finishQuizFlow();
    } else {
      startQuizFlow(session);
    }
  }

  function startQuizFlow(session) {
    if (headerStudentName) headerStudentName.textContent = session.name;
    if (headerStudentGrade) headerStudentGrade.textContent = session.grade;
    if (runnerStudentInfo) runnerStudentInfo.textContent = session.name + " (" + session.grade + ")";
    showScreen(quizRunnerScreen);
    loadQuiz(currentQuizIndex);
  }

  function loadQuiz(index) {
    if (index >= manifest.length) {
      finishQuizFlow();
      return;
    }

    currentQuizIndex = index;
    storage.updateQuizIndex(index);

    const quiz = manifest[index];
    const counterText = window.I18n ? 
      window.I18n.t("runner.quizCounter", { current: index + 1, total: manifest.length }) :
      "Quiz " + (index + 1) + " of " + manifest.length;
    runnerQuizCounter.textContent = counterText + ": " + quiz.title;

    // Update Progress Bar
    const progressPct = Math.round((index / manifest.length) * 100);
    runnerProgressBar.style.width = progressPct + "%";

    // Load iframe
    quizFrame.src = quiz.path;
  }

  function handleQuizMessage(event) {
    if (!event.data || event.data.type !== "QUIZ_SUBMIT_SCORE") return;

    const { score, maxScore } = event.data;
    const currentQuiz = manifest[currentQuizIndex];

    if (!currentQuiz) return;

    // Save score in local storage
    storage.saveQuizScore(currentQuiz.id, score, maxScore);

    // Advance to next quiz or complete
    currentQuizIndex++;
    if (currentQuizIndex < manifest.length) {
      loadQuiz(currentQuizIndex);
    } else {
      // 100% progress
      runnerProgressBar.style.width = "100%";
      setTimeout(() => {
        finishQuizFlow();
      }, 500);
    }
  }

  function finishQuizFlow() {
    const completedSession = storage.completeSession();
    if (!completedSession) return;

    // Update Completion Screen UI
    const congratsMsg = window.I18n ? 
      window.I18n.t("completion.congratsSubtitle") : 
      "You finished all quizzes!";
    document.getElementById("completionStudentName").textContent = 
      completedSession.name + " - " + congratsMsg;
    finalScoreDisplay.textContent = completedSession.totalScore + " / " + completedSession.totalMaxScore;
    finalPercentageDisplay.textContent = completedSession.percentage + "%";

    // Render Quiz Breakdown
    finalBreakdownList.innerHTML = "";
    manifest.forEach(quiz => {
      const scoreObj = completedSession.scores[quiz.id];
      const item = document.createElement("div");
      item.className = "breakdown-item";
      if (scoreObj) {
        item.innerHTML = "<span><strong>" + escapeHtml(quiz.title) + "</strong></span>" +
          "<span>" + scoreObj.score + " / " + scoreObj.maxScore + " pts</span>";
      } else {
        item.innerHTML = "<span><strong>" + escapeHtml(quiz.title) + "</strong></span>" +
          "<span>-</span>";
      }
      finalBreakdownList.appendChild(item);
    });

    showScreen(completionScreen);
  }

  function handleStartOver() {
    storage.clearCurrentSession();
    registrationForm.reset();
    currentQuizIndex = 0;
    showScreen(registrationScreen);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  // Start on load
  window.addEventListener("DOMContentLoaded", init);
})();
