/**
 * Admin Dashboard Logic & Event Handlers
 */
(function() {
  const storage = window.QuizStorage;
  const exporter = window.QuizExporter;
  const manifest = window.QUIZ_MANIFEST || [];

  // DOM Elements
  const authModal = document.getElementById("authModal");
  const authForm = document.getElementById("authForm");
  const adminPasswordInput = document.getElementById("adminPasswordInput");
  const authError = document.getElementById("authError");
  const adminContent = document.getElementById("adminContent");
  const logoutBtn = document.getElementById("logoutBtn");

  const statTotalStudents = document.getElementById("statTotalStudents");
  const statAverageScore = document.getElementById("statAverageScore");
  const statTotalQuizzes = document.getElementById("statTotalQuizzes");

  const searchInput = document.getElementById("searchInput");
  const resultsTableBody = document.getElementById("resultsTableBody");
  const downloadTxtBtn = document.getElementById("downloadTxtBtn");
  const unlockDeviceAdminBtn = document.getElementById("unlockDeviceAdminBtn");
  const changePwdBtn = document.getElementById("changePwdBtn");
  const clearDataBtn = document.getElementById("clearDataBtn");

  // State
  let isAuthenticated = sessionStorage.getItem("admin_authenticated") === "true";

  function init() {
    if (isAuthenticated) {
      unlockDashboard();
    } else {
      authModal.style.display = "flex";
      adminContent.style.display = "none";
    }

    authForm.addEventListener("submit", handleLogin);
    logoutBtn.addEventListener("click", handleLogout);
    // Language Switcher Buttons
    document.querySelectorAll(".lang-switcher-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.I18n) window.I18n.toggleLang();
      });
    });

    if (window.I18n) {
      window.I18n.onLanguageChange(() => {
        renderDashboard(searchInput.value);
      });
    }

    searchInput.addEventListener("input", handleSearch);
    downloadTxtBtn.addEventListener("click", handleDownloadTxt);
    if (unlockDeviceAdminBtn) unlockDeviceAdminBtn.addEventListener("click", handleResetDevice);
    if (clearDataBtn) clearDataBtn.addEventListener("click", handleClearData);
  }

  function handleResetDevice() {
    storage.setDeviceLocked(false);
    storage.clearCurrentSession();
    alert(window.I18n ? window.I18n.t("admin.deviceUnlockedAlert") : "Device has been unlocked for the next student! ✅");
  }

  function handleLogin(e) {
    e.preventDefault();
    const entered = adminPasswordInput.value;

    if (storage.verifyAdminPassword(entered)) {
      isAuthenticated = true;
      sessionStorage.setItem("admin_authenticated", "true");
      authError.textContent = "";
      unlockDashboard();
    } else {
      authError.textContent = window.I18n ? window.I18n.t("admin.loginError") : "❌ Incorrect password. Please try again.";
      adminPasswordInput.value = "";
      adminPasswordInput.focus();
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_authenticated");
    isAuthenticated = false;
    authModal.style.display = "flex";
    adminContent.style.display = "none";
    adminPasswordInput.value = "";
  }

  function unlockDashboard() {
    authModal.style.display = "none";
    adminContent.style.display = "block";
    renderDashboard();
  }

  let cachedResults = [];

  async function renderDashboard(filterQuery) {
    filterQuery = filterQuery || "";
    statTotalQuizzes.textContent = manifest.length;

    // Load from centralized Google Sheets if configured, otherwise fallback to LocalStorage
    let results = [];
    if (window.QuizSheetsApi && window.QuizSheetsApi.isConfigured()) {
      const remoteResults = await window.QuizSheetsApi.fetchAllResults();
      if (remoteResults && Array.isArray(remoteResults)) {
        results = remoteResults;
      } else {
        results = storage.getAllResults();
      }
    } else {
      results = storage.getAllResults();
    }

    cachedResults = results;
    statTotalStudents.textContent = results.length;

    // Normalize and dynamically calculate percentage for every record
    results.forEach(function(student) {
      // If totalMaxScore is not present or percentage is missing/0, compute dynamically from scores dictionary or totals
      var totalScore = 0;
      var totalMaxScore = 0;

      if (student.scores && typeof student.scores === "object" && Object.keys(student.scores).length > 0) {
        Object.values(student.scores).forEach(function(item) {
          totalScore += Number(item.score) || 0;
          totalMaxScore += Number(item.maxScore) || 0;
        });
      } else {
        totalScore = Number(student.totalScore) || 0;
        totalMaxScore = Number(student.totalMaxScore) || 0;
      }

      student.totalScore = totalScore;
      student.totalMaxScore = totalMaxScore;
      student.percentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : (Number(student.percentage) || 0);
    });

    // Calculate Average Class Score from actual students percentages
    if (results.length > 0) {
      const sum = results.reduce(function(acc, curr) { return acc + (Number(curr.percentage) || 0); }, 0);
      statAverageScore.textContent = Math.round(sum / results.length) + "%";
    } else {
      statAverageScore.textContent = "0%";
    }

    // Filter results
    const query = filterQuery.toLowerCase().trim();
    const filtered = results.filter(function(r) { 
      return (r.name && r.name.toLowerCase().indexOf(query) !== -1) || 
             (r.grade && r.grade.toLowerCase().indexOf(query) !== -1);
    });

    renderTable(filtered);
  }

  function renderTable(results) {
    resultsTableBody.innerHTML = "";

    if (results.length === 0) {
      const emptyTitle = window.I18n ? window.I18n.t("admin.emptyTitle") : "No student quiz records found.";
      const emptySubtitle = window.I18n ? window.I18n.t("admin.emptySubtitle") : "";
      resultsTableBody.innerHTML = '<tr><td colspan="7" class="empty-state"><div class="empty-state-icon">📋</div><strong>' + emptyTitle + '</strong><p style="margin-top: 4px; font-size: 0.85rem;">' + emptySubtitle + '</p></td></tr>';
      return;
    }

    results.forEach(function(student, idx) {
      const tr = document.createElement("tr");
      const completedTime = student.completedAt ? new Date(student.completedAt).toLocaleString() : (student.timestamp || "N/A");
      const pctValue = Number(student.percentage) || 0;
      const pctBadge = pctValue >= 80 ? "badge-success" : "badge-primary";
      const btnText = window.I18n ? window.I18n.t("admin.reviewAnswersBtn") : "Review Answers 🔍";

      tr.innerHTML = '<td><strong>' + (idx + 1) + '</strong></td>' +
        '<td><strong>' + escapeHtml(student.name) + '</strong></td>' +
        '<td><span class="badge badge-primary">' + escapeHtml(student.grade) + '</span></td>' +
        '<td>' + student.totalScore + ' / ' + student.totalMaxScore + ' pts</td>' +
        '<td><span class="badge ' + pctBadge + '">' + pctValue + '%</span></td>' +
        '<td style="color: var(--text-muted); font-size: 0.85rem;">' + completedTime + '</td>' +
        '<td><button type="button" class="btn-review-answers" data-index="' + idx + '">' + btnText + '</button></td>';

      const reviewBtn = tr.querySelector(".btn-review-answers");
      if (reviewBtn) {
        reviewBtn.addEventListener("click", function() {
          openReviewModal(student);
        });
      }

      resultsTableBody.appendChild(tr);
    });
  }

  function openReviewModal(student) {
    const modal = document.getElementById("reviewAnswersModal");
    const closeBtn = document.getElementById("closeReviewModalBtn");
    const nameEl = document.getElementById("reviewStudentName");
    const metaEl = document.getElementById("reviewStudentMeta");
    const bannerEl = document.getElementById("reviewScoreBanner");
    const container = document.getElementById("reviewQuizzesContainer");

    if (!modal) return;

    const lang = (window.I18n && window.I18n.getLang()) || "ar";

    // Set Student Details Header
    nameEl.textContent = student.name;
    metaEl.textContent = student.grade + " • " + (student.completedAt ? new Date(student.completedAt).toLocaleString() : (student.timestamp || ""));

    // Overall Score Banner
    const scoreLabel = lang === "ar" ? "الدرجة الإجمالية للطالب:" : "Overall Student Score:";
    bannerEl.innerHTML = `
      <span>${scoreLabel}</span>
      <span style="color: var(--brand-accent); font-size: 1.2rem;">${student.totalScore} / ${student.totalMaxScore} pts (${student.percentage}%)</span>
    `;

    // Render Quizzes Breakdown & Answers
    container.innerHTML = "";

    const scoresObj = student.scores || {};
    const quizKeys = Object.keys(scoresObj);

    if (quizKeys.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">${lang === "ar" ? "لا توجد تفاصيل إجابات مسجلة لهذا الطالب." : "No detailed answer records available for this student."}</div>`;
    } else {
      quizKeys.forEach(quizId => {
        const quizData = scoresObj[quizId] || {};
        const quizMeta = manifest.find(m => m.id === quizId);
        
        let quizTitle = quizId;
        if (quizData.quizTitle) {
          quizTitle = typeof quizData.quizTitle === "object" ? (quizData.quizTitle[lang] || quizData.quizTitle.ar || quizData.quizTitle.en) : quizData.quizTitle;
        } else if (quizMeta) {
          quizTitle = quizMeta.title;
        }

        const quizSection = document.createElement("div");
        quizSection.className = "review-quiz-section";

        quizSection.innerHTML = `
          <div class="review-quiz-header">
            <span class="review-quiz-title">${escapeHtml(quizTitle)}</span>
            <span class="review-quiz-score-badge">${quizData.score || 0} / ${quizData.maxScore || 0} pts</span>
          </div>
          <div class="review-questions-list"></div>
        `;

        const qListEl = quizSection.querySelector(".review-questions-list");
        const answers = quizData.answers || [];

        if (answers.length === 0) {
          qListEl.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem;">${lang === "ar" ? "تم تسجيل الدرجة الكلية فقط لهذا الاختبار." : "Only total score recorded for this quiz."}</div>`;
        } else {
          answers.forEach((ans, qIdx) => {
            const isCorrect = Boolean(ans.isCorrect);
            const qCard = document.createElement("div");
            qCard.className = `review-question-card ${isCorrect ? "is-correct" : "is-wrong"}`;

            let qPrompt = typeof ans.questionText === "object" ? 
              (ans.questionText[lang] || ans.questionText.ar || ans.questionText.en || `السؤال #${qIdx + 1}`) : 
              (ans.questionText || `Question #${qIdx + 1}`);

            let studentAnsText = typeof ans.studentAnswer === "object" ?
              (ans.studentAnswer[lang] || ans.studentAnswer.ar || ans.studentAnswer.en || "") :
              (ans.studentAnswer || "");

            let correctAnsText = typeof ans.correctAnswer === "object" ?
              (ans.correctAnswer[lang] || ans.correctAnswer.ar || ans.correctAnswer.en || "") :
              (ans.correctAnswer || "");

            const statusText = isCorrect ? 
              (lang === "ar" ? "إجابة صحيحة ✅" : "Correct ✅") : 
              (lang === "ar" ? "إجابة خاطئة ❌" : "Incorrect ❌");
            const statusColor = isCorrect ? "#16A34A" : "#E11D48";

            qCard.innerHTML = `
              <div class="review-question-prompt">
                <span>${escapeHtml(qPrompt)}</span>
              </div>
              <div class="review-answer-row">
                <div>
                  <span class="review-ans-label">${lang === "ar" ? "إجابة الطالب:" : "Student's Answer:"} </span>
                  <span class="review-ans-val" style="color: ${statusColor};">${escapeHtml(studentAnsText)}</span>
                </div>
                <div style="font-weight: 800; color: ${statusColor}; font-size: 0.85rem;">
                  ${statusText}
                </div>
              </div>
              <div class="review-answer-row" style="margin-top: 4px;">
                <div>
                  <span class="review-ans-label">${lang === "ar" ? "الإجابة النموذجية الصحيحة:" : "Correct Answer:"} </span>
                  <span class="review-ans-val" style="color: #16A34A;">${escapeHtml(correctAnsText)}</span>
                </div>
              </div>
            `;

            qListEl.appendChild(qCard);
          });
        }

        container.appendChild(quizSection);
      });
    }

    modal.style.display = "flex";

    closeBtn.onclick = function() {
      modal.style.display = "none";
    };

    modal.onclick = function(e) {
      if (e.target === modal) modal.style.display = "none";
    };
  }

  function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const filtered = cachedResults.filter(function(r) { 
      return (r.name && r.name.toLowerCase().indexOf(query) !== -1) || 
             (r.grade && r.grade.toLowerCase().indexOf(query) !== -1);
    });
    renderTable(filtered);
  }

  function handleDownloadTxt() {
    const results = cachedResults.length > 0 ? cachedResults : storage.getAllResults();
    if (results.length === 0) {
      alert(window.I18n ? window.I18n.t("admin.emptyTitle") : "No student records available to export yet.");
      return;
    }

    const reportContent = exporter.generateTxtReport(results, manifest);
    const filename = "Quiz_Platform_Centralized_Results_" + new Date().toISOString().slice(0, 10) + ".txt";
    exporter.downloadTxtFile(filename, reportContent);
  }

  async function handleClearData() {
    // 1. Strict Admin Authentication Guard
    if (!isAuthenticated) {
      alert("Unauthorized action. Please log in as Admin.");
      return;
    }

    const confirmMsg = window.I18n ? 
      window.I18n.t("admin.clearConfirm") : 
      "Are you sure you want to delete all student records from Google Sheets and this system? This action cannot be undone.";

    if (!confirm(confirmMsg)) {
      return;
    }

    if (clearDataBtn) {
      clearDataBtn.disabled = true;
      clearDataBtn.textContent = window.I18n ? window.I18n.t("common.loading") : "Deleting...";
    }

    try {
      // 2. Delete from centralized Google Sheets
      if (window.QuizSheetsApi && window.QuizSheetsApi.isConfigured()) {
        const res = await window.QuizSheetsApi.clearAllRecords();
        if (!res || !res.success) {
          throw new Error(res && res.error ? res.error : "Failed to delete records from Google Sheets server.");
        }
      }

      // 3. Clear Local Storage records, anti-retake completed registry, and unlock device
      storage.clearAllResults();
      cachedResults = [];

      // 4. Re-render fresh empty state
      await renderDashboard();

      const successAlert = window.I18n && window.I18n.getLang() === "ar" ?
        "تم مسح كافة سجلات الطلاب من Google Sheets والنظام المحلي بنجاح! 🗑️" :
        "All student records have been permanently cleared from Google Sheets and Local Storage! 🗑️";
      alert(successAlert);

    } catch (err) {
      console.error("handleClearData error:", err);
      const errMsg = (window.I18n && window.I18n.getLang() === "ar") ?
        ("❌ فشل حذف السجلات من Google Sheets: " + err.message) :
        ("❌ Failed to clear records from Google Sheets: " + err.message);
      alert(errMsg);
    } finally {
      if (clearDataBtn) {
        clearDataBtn.disabled = false;
        clearDataBtn.textContent = window.I18n ? window.I18n.t("admin.clearBtn") : "Clear All Records 🗑️";
      }
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  window.addEventListener("DOMContentLoaded", init);
})();