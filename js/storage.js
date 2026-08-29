/**
 * Storage Manager for Kids Quiz Platform
 * Handles LocalStorage persistence for sessions, student results, device locking, and anti-retake protection.
 */
(function(window) {
  const config = window.APP_CONFIG || {
    defaultAdminPassword: "admin123",
    storageKeys: {
      currentSession: "quiz_current_session",
      allResults: "quiz_all_results",
      adminPassword: "quiz_admin_password",
      deviceLocked: "quiz_device_locked_state",
      completedStudents: "quiz_completed_students_registry"
    }
  };

  const keys = config.storageKeys;

  const StorageManager = {
    // --- Device Lock & Completed Registry ---
    isDeviceLocked() {
      return localStorage.getItem(keys.deviceLocked) === "true";
    },

    setDeviceLocked(locked) {
      if (locked) {
        localStorage.setItem(keys.deviceLocked, "true");
      } else {
        localStorage.removeItem(keys.deviceLocked);
      }
    },

    getCompletedStudents() {
      try {
        const raw = localStorage.getItem(keys.completedStudents);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error("Failed to parse completed students:", e);
        return [];
      }
    },

    isStudentCompleted(name, grade) {
      const normalizedName = String(name || "").trim().toLowerCase();
      const normalizedGrade = String(grade || "").trim().toLowerCase();
      const list = this.getCompletedStudents();
      return list.some(item => 
        item.normalizedName === normalizedName && 
        item.normalizedGrade === normalizedGrade
      );
    },

    registerCompletedStudent(session) {
      const list = this.getCompletedStudents();
      const record = {
        id: session.id,
        name: session.name,
        grade: session.grade,
        normalizedName: String(session.name || "").trim().toLowerCase(),
        normalizedGrade: String(session.grade || "").trim().toLowerCase(),
        completedAt: session.completedAt || new Date().toISOString(),
        totalScore: session.totalScore,
        totalMaxScore: session.totalMaxScore
      };

      if (!list.some(item => item.id === record.id)) {
        list.push(record);
        localStorage.setItem(keys.completedStudents, JSON.stringify(list));
      }
      // Lock device automatically
      this.setDeviceLocked(true);
    },

    unlockDeviceWithPassword(enteredPassword) {
      if (this.verifyAdminPassword(enteredPassword)) {
        this.setDeviceLocked(false);
        this.clearCurrentSession();
        return true;
      }
      return false;
    },

    // --- Current Student Session ---
    startSession(name, grade) {
      // 1. Device lock check
      if (this.isDeviceLocked()) {
        throw new Error("DEVICE_LOCKED");
      }

      // 2. Anti-retake duplicate student check
      if (this.isStudentCompleted(name, grade)) {
        throw new Error("STUDENT_ALREADY_COMPLETED");
      }

      // 3. Prevent overwriting active incomplete session
      const existing = this.getCurrentSession();
      if (existing && !existing.completedAt) {
        return existing;
      }

      const session = {
        id: "stu_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        name: name.trim(),
        grade: grade.trim(),
        startedAt: new Date().toISOString(),
        currentQuizIndex: 0,
        scores: {}, // { [quizId]: { score: number, maxScore: number, completedAt: string } }
        completedAt: null
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
      if (session.completedAt) return session; // Locked session

      // Validate inputs
      const safeScore = Math.max(0, Math.min(Number(score) || 0, Number(maxScore) || 100));
      const safeMaxScore = Math.max(1, Number(maxScore) || 1);

      // Prevent duplicate submission overwriting if already completed
      if (!session.scores[quizId]) {
        session.scores[quizId] = {
          score: safeScore,
          maxScore: safeMaxScore,
          completedAt: new Date().toISOString()
        };
        localStorage.setItem(keys.currentSession, JSON.stringify(session));
      }
      return session;
    },

    updateQuizIndex(index) {
      const session = this.getCurrentSession();
      if (!session || session.completedAt) return null;
      session.currentQuizIndex = Math.max(0, Number(index) || 0);
      localStorage.setItem(keys.currentSession, JSON.stringify(session));
      return session;
    },

    completeSession() {
      const session = this.getCurrentSession();
      if (!session) return null;
      if (session.completedAt) return session; // Already completed

      session.completedAt = new Date().toISOString();

      // Calculate validated total score
      let totalScore = 0;
      let totalMaxScore = 0;
      Object.values(session.scores).forEach(item => {
        totalScore += Number(item.score) || 0;
        totalMaxScore += Number(item.maxScore) || 0;
      });

      session.totalScore = totalScore;
      session.totalMaxScore = totalMaxScore;
      session.percentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

      // Update current session in storage
      localStorage.setItem(keys.currentSession, JSON.stringify(session));

      // Append to all results avoiding duplicates by student ID
      const allResults = this.getAllResults();
      if (!allResults.some(item => item.id === session.id)) {
        allResults.push(session);
        localStorage.setItem(keys.allResults, JSON.stringify(allResults));
      }

      // Register student permanently in completed registry & lock device
      this.registerCompletedStudent(session);

      // Enqueue for Google Sheets synchronization
      this.enqueueForSheetsSync(session);

      return session;
    },

    // --- Google Sheets Sync Queue & Retry ---
    getPendingSyncQueue() {
      try {
        const raw = localStorage.getItem(keys.pendingSyncQueue);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    enqueueForSheetsSync(session) {
      const queue = this.getPendingSyncQueue();
      if (!queue.some(item => item.id === session.id)) {
        queue.push(session);
        localStorage.setItem(keys.pendingSyncQueue, JSON.stringify(queue));
      }
      this.flushSyncQueue();
    },

    removeFromSyncQueue(sessionId) {
      const queue = this.getPendingSyncQueue().filter(item => item.id !== sessionId);
      localStorage.setItem(keys.pendingSyncQueue, JSON.stringify(queue));
    },

    async flushSyncQueue() {
      if (!window.QuizSheetsApi || !window.QuizSheetsApi.isConfigured()) return;

      const queue = this.getPendingSyncQueue();
      if (queue.length === 0) return;

      for (const session of queue) {
        try {
          const res = await window.QuizSheetsApi.submitSessionResult(session);
          if (res && (res.success || res.duplicate)) {
            this.removeFromSyncQueue(session.id);
          }
        } catch (e) {
          console.warn("Background sync retry error for session:", session.id, e);
        }
      }
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
      localStorage.setItem(keys.completedStudents, JSON.stringify([]));
      localStorage.removeItem(keys.deviceLocked);
      localStorage.removeItem(keys.pendingSyncQueue);
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
  // Trigger background flush on start if online
  window.addEventListener("online", () => {
    StorageManager.flushSyncQueue();
  });
})(window);
