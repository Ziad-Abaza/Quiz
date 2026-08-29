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

  async function init() {
    if (manifest.length === 0) {
      alert("Notice: No quizzes registered in quizzes/manifest.js.");
    }

    // 1. Sync remote reset version first to unlock if Admin triggered reset
    await checkRemoteDeviceReset();

    // 2. Check if device is locked or there is an active session
    checkDeviceAndSessionState();

    // Language switcher toggle
    const langBtn = document.getElementById("langSwitchBtn");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        window.I18n.toggleLang();
      });
    }

    if (window.I18n) {
      window.I18n.onLanguageChange((newLang) => {
        updateDynamicTexts();
        checkDeviceAndSessionState();
        // Broadcast language change to currently loaded iframe
        if (quizFrame && quizFrame.contentWindow) {
          quizFrame.contentWindow.postMessage({
            type: "PLATFORM_LANG_CHANGE",
            lang: newLang
          }, "*");
        }
      });
    }

    // Form Submission
    registrationForm.addEventListener("submit", handleRegistration);
    nextStudentBtn.addEventListener("click", handleStartOver);

    // Teacher unlock modal setup
    setupTeacherUnlockModal();

    // Listen for QuizSDK postMessage events
    window.addEventListener("message", handleQuizMessage);
  }

  async function checkRemoteDeviceReset() {
    if (window.QuizSheetsApi && window.QuizSheetsApi.isConfigured()) {
      try {
        const serverVersion = await window.QuizSheetsApi.fetchResetVersion();
        const wasReset = storage.syncWithServerResetVersion(serverVersion);
        if (wasReset) {
          console.log("Remote device reset applied from Google Sheets.");
          checkDeviceAndSessionState();
        }
      } catch (err) {
        console.warn("Remote reset check failed:", err);
      }
    }
  }

  function checkDeviceAndSessionState() {
    const existingSession = storage.getCurrentSession();
    const isLocked = storage.isDeviceLocked();
    const regAlertBox = document.getElementById("regAlertBox");
    const deviceLockedActions = document.getElementById("deviceLockedActions");
    const startExamBtn = document.getElementById("startExamBtn");

    if (isLocked) {
      // If student completed on this device, show completion or lock prompt
      if (existingSession && existingSession.completedAt) {
        showCompletionScreenUI(existingSession);
        return;
      }

      // Show locked registration screen with unlock action
      showScreen(registrationScreen);
      if (regAlertBox) {
        regAlertBox.style.display = "block";
        regAlertBox.textContent = window.I18n ? window.I18n.t("registration.errorDeviceLocked") : "Device Locked for next student.";
      }
      if (deviceLockedActions) deviceLockedActions.style.display = "block";
      if (startExamBtn) startExamBtn.disabled = true;
      return;
    }

    // Device is NOT locked
    if (deviceLockedActions) deviceLockedActions.style.display = "none";
    if (startExamBtn) startExamBtn.disabled = false;
    if (regAlertBox) regAlertBox.style.display = "none";

    if (existingSession && !existingSession.completedAt) {
      resumeSession(existingSession);
    } else {
      showScreen(registrationScreen);
    }
  }

  function setupTeacherUnlockModal() {
    const openBtn = document.getElementById("openTeacherUnlockBtn");
    const modal = document.getElementById("unlockDeviceModal");
    const closeBtn = document.getElementById("closeUnlockModalBtn");
    const form = document.getElementById("unlockDeviceForm");
    const passwordInput = document.getElementById("unlockAdminPassword");
    const errorMsg = document.getElementById("unlockErrorMsg");

    if (openBtn && modal) {
      openBtn.addEventListener("click", () => {
        modal.style.display = "flex";
        if (passwordInput) {
          passwordInput.value = "";
          passwordInput.focus();
        }
        if (errorMsg) errorMsg.style.display = "none";
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    if (form && modal) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const pwd = passwordInput.value;
        const success = storage.unlockDeviceWithPassword(pwd);
        if (success) {
          modal.style.display = "none";
          registrationForm.reset();
          checkDeviceAndSessionState();
        } else {
          if (errorMsg) errorMsg.style.display = "block";
        }
      });
    }
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

  async function handleRegistration(e) {
    e.preventDefault();
    const name = studentNameInput.value.trim();
    const grade = studentGradeSelect.value;
    const regAlertBox = document.getElementById("regAlertBox");
    const startExamBtn = document.getElementById("startExamBtn");

    if (!name || !grade) return;

    // Optional: show loading state on button
    const origBtnText = startExamBtn ? startExamBtn.innerHTML : "";
    if (startExamBtn) {
      startExamBtn.disabled = true;
      startExamBtn.textContent = window.I18n ? window.I18n.t("common.loading") : "Loading...";
    }

    try {
      // 1. Centralized Google Sheets Anti-Retake Verification
      if (window.QuizSheetsApi && window.QuizSheetsApi.isConfigured()) {
        const isCompletedOnline = await window.QuizSheetsApi.checkStudentCompletion({ name, grade });
        if (isCompletedOnline) {
          throw new Error("STUDENT_ALREADY_COMPLETED");
        }
      }

      // 2. Start local validated session
      const session = storage.startSession(name, grade);
      if (regAlertBox) regAlertBox.style.display = "none";
      startQuizFlow(session);
    } catch (err) {
      if (regAlertBox) {
        regAlertBox.style.display = "block";
        if (err.message === "STUDENT_ALREADY_COMPLETED") {
          regAlertBox.textContent = window.I18n ? 
            window.I18n.t("registration.errorStudentCompleted") : 
            "Student has already completed the exam.";
        } else if (err.message === "DEVICE_LOCKED") {
          regAlertBox.textContent = window.I18n ? 
            window.I18n.t("registration.errorDeviceLocked") : 
            "Device is locked.";
          const deviceLockedActions = document.getElementById("deviceLockedActions");
          if (deviceLockedActions) deviceLockedActions.style.display = "block";
        } else {
          regAlertBox.textContent = err.message;
        }
      }
    } finally {
      if (startExamBtn) {
        startExamBtn.disabled = storage.isDeviceLocked();
        startExamBtn.innerHTML = origBtnText;
      }
    }
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

    // Load iframe and sync active language immediately on load
    quizFrame.onload = function() {
      const activeLang = (window.I18n && window.I18n.getLang()) || localStorage.getItem("quiz_platform_lang") || "ar";
      try {
        quizFrame.contentWindow.postMessage({
          type: "PLATFORM_LANG_CHANGE",
          lang: activeLang
        }, "*");
      } catch (e) {
        console.warn("Could not postMessage to iframe:", e);
      }
    };
    quizFrame.src = quiz.path;
  }

  function handleQuizMessage(event) {
    if (!event.data || event.data.type !== "QUIZ_SUBMIT_SCORE") return;

    const currentSession = storage.getCurrentSession();
    if (!currentSession || currentSession.completedAt) return; // Session locked

    const { score, maxScore, metadata } = event.data;
    const currentQuiz = manifest[currentQuizIndex];

    if (!currentQuiz) return;

    // Validate and save score and detailed answer snapshot in storage
    storage.saveQuizScore(currentQuiz.id, score, maxScore, metadata);

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
    showCompletionScreenUI(completedSession);
  }

  function showCompletionScreenUI(session) {
    // Update Completion Screen UI
    const congratsMsg = window.I18n ? 
      window.I18n.t("completion.congratsSubtitle") : 
      "You finished all quizzes!";
    document.getElementById("completionStudentName").textContent = 
      session.name + " - " + congratsMsg;
    finalScoreDisplay.textContent = session.totalScore + " / " + session.totalMaxScore;
    finalPercentageDisplay.textContent = session.percentage + "%";

    // Render Quiz Breakdown
    finalBreakdownList.innerHTML = "";
    manifest.forEach(quiz => {
      const scoreObj = session.scores ? session.scores[quiz.id] : null;
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
    // Starting a new student requires Teacher/Admin unlock if device is locked
    if (storage.isDeviceLocked()) {
      const modal = document.getElementById("unlockDeviceModal");
      if (modal) modal.style.display = "flex";
      return;
    }

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
