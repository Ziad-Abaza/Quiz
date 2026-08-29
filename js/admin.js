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

    // Calculate Average
    if (results.length > 0) {
      const sum = results.reduce(function(acc, curr) { return acc + (curr.percentage || 0); }, 0);
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
      resultsTableBody.innerHTML = '<tr><td colspan="6" class="empty-state"><div class="empty-state-icon">📋</div><strong>' + emptyTitle + '</strong><p style="margin-top: 4px; font-size: 0.85rem;">' + emptySubtitle + '</p></td></tr>';
      return;
    }

    results.forEach(function(student, idx) {
      const tr = document.createElement("tr");
      const completedTime = student.completedAt ? new Date(student.completedAt).toLocaleString() : (student.timestamp || "N/A");
      const pctBadge = student.percentage >= 80 ? "badge-success" : "badge-primary";

      tr.innerHTML = '<td><strong>' + (idx + 1) + '</strong></td>' +
        '<td><strong>' + escapeHtml(student.name) + '</strong></td>' +
        '<td><span class="badge badge-primary">' + escapeHtml(student.grade) + '</span></td>' +
        '<td>' + student.totalScore + ' / ' + student.totalMaxScore + ' pts</td>' +
        '<td><span class="badge ' + pctBadge + '">' + student.percentage + '%</span></td>' +
        '<td style="color: var(--text-muted); font-size: 0.85rem;">' + completedTime + '</td>';
      resultsTableBody.appendChild(tr);
    });
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

  function handleClearData() {
    const confirmMsg = window.I18n ? 
      window.I18n.t("admin.clearConfirm") : 
      "Are you sure you want to delete all student records? This action cannot be undone.";
    if (confirm(confirmMsg)) {
      storage.clearAllResults();
      renderDashboard();
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  window.addEventListener("DOMContentLoaded", init);
})();