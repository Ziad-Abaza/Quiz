/**
 * Storage Manager for Kids Quiz Platform
 * Handles LocalStorage persistence for sessions, student results, and admin credentials.
 */
(function(window) {
  const config = window.APP_CONFIG || {
    defaultAdminPassword: "admin123",
    storageKeys: {
      currentSession: "quiz_current_session",
      allResults: "quiz_all_results",
      adminPassword: "quiz_admin_password"
    }
  };

  const keys = config.storageKeys;

  const StorageManager = {
    // --- Current Student Session ---
    startSession(name, grade) {
      const session = {
        id: "stu_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        name: name.trim(),
        grade: grade.trim(),
        startedAt: new Date().toISOString(),
        currentQuizIndex: 0,
        scores: {} // { [quizId]: { score: number, maxScore: number, completedAt: string } }
      };
      localStorage.setItem(keys.currentSession, JSON.stringify(session));
      return session;
    },

    getCurrentSession() {
      try {
        const raw = localStorage.getItem(keys.currentSession);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.error("Failed to parse current session:", e);
        return null;
      }
    },

    saveQuizScore(quizId, score, maxScore) {
      const session = this.getCurrentSession();
      if (!session) return null;

      session.scores[quizId] = {
        score: Number(score),
        maxScore: Number(maxScore),
        completedAt: new Date().toISOString()
      };
      localStorage.setItem(keys.currentSession, JSON.stringify(session));
      return session;
    },

    updateQuizIndex(index) {
      const session = this.getCurrentSession();
      if (!session) return null;
      session.currentQuizIndex = index;
      localStorage.setItem(keys.currentSession, JSON.stringify(session));
      return session;
    },

    completeSession() {
      const session = this.getCurrentSession();
      if (!session) return null;

      session.completedAt = new Date().toISOString();

      // Calculate total score
      let totalScore = 0;
      let totalMaxScore = 0;
      Object.values(session.scores).forEach(item => {
        totalScore += item.score || 0;
        totalMaxScore += item.maxScore || 0;
      });

      session.totalScore = totalScore;
      session.totalMaxScore = totalMaxScore;
      session.percentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

      // Add to all results
      const allResults = this.getAllResults();
      allResults.push(session);
      localStorage.setItem(keys.allResults, JSON.stringify(allResults));

      return session;
    },

    clearCurrentSession() {
      localStorage.removeItem(keys.currentSession);
    },

    // --- All Results Database ---
    getAllResults() {
      try {
        const raw = localStorage.getItem(keys.allResults);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error("Failed to parse all results:", e);
        return [];
      }
    },

    clearAllResults() {
      localStorage.setItem(keys.allResults, JSON.stringify([]));
    },

    // --- Admin Authentication ---
    getAdminPassword() {
      return localStorage.getItem(keys.adminPassword) || config.defaultAdminPassword;
    },

    verifyAdminPassword(enteredPassword) {
      const currentPassword = this.getAdminPassword();
      return String(enteredPassword).trim() === currentPassword;
    },

    setAdminPassword(newPassword) {
      if (!newPassword || newPassword.trim().length === 0) return false;
      localStorage.setItem(keys.adminPassword, newPassword.trim());
      return true;
    }
  };

  window.QuizStorage = StorageManager;
})(window);
