/**
 * Google Sheets API Integration Service
 * Secure communication bridge via Google Apps Script Web App Endpoint.
 */
(function(window) {
  const config = window.APP_CONFIG || {};
  const sheetsConfig = config.googleSheets || {};

  const SheetsApi = {
    getApiUrl() {
      return (window.APP_CONFIG && window.APP_CONFIG.googleSheets && window.APP_CONFIG.googleSheets.apiUrl) || "";
    },

    isConfigured() {
      const url = this.getApiUrl();
      return Boolean(url && url.startsWith("https://script.google.com/macros/s/"));
    },

    /**
     * Checks if student already completed exam in centralized Google Sheet.
     * @param {Object} student - { name, grade, id }
     * @returns {Promise<boolean>}
     */
    async checkStudentCompletion(student) {
      if (!this.isConfigured()) {
        return false;
      }

      try {
        const url = new URL(this.getApiUrl());
        url.searchParams.append("action", "checkStudent");
        if (student.name) url.searchParams.append("name", student.name);
        if (student.grade) url.searchParams.append("grade", student.grade);
        if (student.id) url.searchParams.append("id", student.id);

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: { "Accept": "application/json" }
        });

        if (response.ok) {
          const resData = await response.json();
          return Boolean(resData && resData.isCompleted);
        }
        return false;
      } catch (err) {
        console.warn("Centralized checkStudentCompletion failed (offline/network error):", err);
        return false; // Fallback to client-side check
      }
    },

    /**
     * Submits completed session results to Google Sheets via Apps Script Web App.
     * @param {Object} session - Full completed student session record
     * @returns {Promise<{ success: boolean, duplicate?: boolean, error?: string }>}
     */
    async submitSessionResult(session) {
      if (!this.isConfigured()) {
        return { success: false, error: "NOT_CONFIGURED" };
      }

      const payload = {
        sessionId: session.id,
        studentId: session.id,
        studentName: session.name,
        studentGrade: session.grade,
        supervisor: (window.APP_CONFIG && window.APP_CONFIG.googleSheets && window.APP_CONFIG.googleSheets.supervisor) || "Teacher Admin",
        scores: session.scores || {},
        totalScore: session.totalScore,
        totalMaxScore: session.totalMaxScore,
        percentage: session.percentage,
        completedAt: session.completedAt || new Date().toISOString()
      };

      try {
        const response = await fetch(this.getApiUrl(), {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const resJson = await response.json();
          return {
            success: resJson.status === "success",
            duplicate: resJson.data && resJson.data.duplicate
          };
        } else {
          return { success: false, error: "HTTP_" + response.status };
        }
      } catch (err) {
        console.warn("submitSessionResult network failure:", err);
        return { success: false, error: err.toString() };
      }
    },

    /**
     * Fetches all records from centralized Google Sheet for Admin Dashboard.
     * @returns {Promise<Array>}
     */
    async fetchAllResults() {
      if (!this.isConfigured()) {
        return null;
      }

      try {
        const url = new URL(this.getApiUrl());
        url.searchParams.append("action", "getAll");

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: { "Accept": "application/json" }
        });

        if (response.ok) {
          const res = await response.json();
          if (res && res.status === "success" && Array.isArray(res.data)) {
            return res.data;
          }
        }
        return null;
      } catch (err) {
        console.warn("fetchAllResults failed (network error):", err);
        return null;
      }
    },

    /**
     * Deletes all records from centralized Google Sheet.
     * @returns {Promise<{ success: boolean, error?: string }>}
     */
    async clearAllRecords() {
      if (!this.isConfigured()) {
        return { success: true }; // Local only
      }

      try {
        const response = await fetch(this.getApiUrl(), {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify({ action: "clearAll" })
        });

        if (response.ok) {
          const res = await response.json();
          return { success: res && res.status === "success" };
        } else {
          return { success: false, error: "HTTP_" + response.status };
        }
      } catch (err) {
        console.warn("clearAllRecords network error:", err);
        return { success: false, error: err.toString() };
      }
    }
  };

  window.QuizSheetsApi = SheetsApi;
})(window);