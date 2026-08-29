/**
 * Global Configuration for Kids Quiz Platform
 */
window.APP_CONFIG = {
  appName: "Kids Quiz Adventure",
  defaultAdminPassword: "admin123",
  // Google Apps Script Web App Endpoint URL for Google Sheets Sync
  // Deploy your Google Apps Script Web App and paste the URL here.
  googleSheets: {
    apiUrl:
      "https://script.google.com/macros/s/AKfycbxFKdfLnmWqxyinXbQrJpgO50qGbk-W9S7kRz6KTQOJd4QLp0P8W329tuvcdKkv-f6a/exec", // e.g. "https://script.google.com/macros/s/AKfycby.../exec"
    supervisor: "Teacher Admin",
  },
  storageKeys: {
    currentSession: "quiz_current_session",
    allResults: "quiz_all_results",
    adminPassword: "quiz_admin_password",
    deviceLocked: "quiz_device_locked_state",
    completedStudents: "quiz_completed_students_registry",
    pendingSyncQueue: "quiz_pending_sheets_queue",
  },
};
