/**
 * Quiz SDK for Interactive Quiz Pages
 * Enables seamless score submission & two-way language synchronization with the main Shell.
 */
(function(window) {
  const langListeners = [];

  // Listen for language broadcast messages from parent shell
  window.addEventListener("message", function(event) {
    if (!event.data) return;

    if (event.data.type === "PLATFORM_LANG_CHANGE") {
      const newLang = event.data.lang;
      if (window.I18n) {
        window.I18n.setLang(newLang);
      }
      langListeners.forEach(function(cb) {
        try { cb(newLang); } catch(e) { console.error("QuizSDK lang listener error:", e); }
      });
    }
  });

  const QuizSDK = {
    /**
     * Submits the final score from the active quiz to the parent Shell.
     * @param {Object} data 
     * @param {number} data.score - Total score achieved by the student in this quiz
     * @param {number} data.maxScore - Maximum possible score for this quiz
     * @param {Object} [data.metadata] - Optional additional details/answers
     */
    submitScore(data) {
      if (!data || typeof data.score !== "number") {
        console.error("QuizSDK: Invalid score payload. Expecting { score: number, maxScore: number }");
        return;
      }

      const payload = {
        type: "QUIZ_SUBMIT_SCORE",
        score: data.score,
        maxScore: data.maxScore || 10,
        metadata: data.metadata || {}
      };

      if (window.parent && window.parent !== window) {
        window.parent.postMessage(payload, "*");
      } else if (window.__onQuizComplete) {
        window.__onQuizComplete(payload);
      } else {
        console.warn("QuizSDK: Running standalone without host Shell. Score logged:", payload);
        alert("Quiz Complete! Your Score: " + data.score + " / " + (data.maxScore || 10));
      }
    },

    /**
     * Subscribe to language changes broadcast by the host shell.
     * @param {Function} callback - function(lang)
     */
    onLanguageChange(callback) {
      if (typeof callback === "function") {
        langListeners.push(callback);
      }
    },

    /**
     * Get current active platform language.
     * @returns {string} "ar" | "en"
     */
    getLanguage() {
      if (window.I18n) return window.I18n.getLang();
      return localStorage.getItem("quiz_platform_lang") || "ar";
    },

    /**
     * Validates that the quiz is running within an active authorized shell session.
     * If opened directly outside an iframe with no session, redirects or blocks access.
     */
    enforceActiveSession() {
      const isEmbedded = window.parent && window.parent !== window;
      if (!isEmbedded) {
        try {
          const rawSession = localStorage.getItem("quiz_current_session");
          const session = rawSession ? JSON.parse(rawSession) : null;
          const isLocked = localStorage.getItem("quiz_device_locked_state") === "true";
          if (!session || session.completedAt || isLocked) {
            document.body.innerHTML = `
              <div style="font-family: 'Cairo', system-ui, sans-serif; text-align: center; padding: 40px 20px; color: #0E1D4A;">
                <div style="font-size: 3rem; margin-bottom: 16px;">🔒</div>
                <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 12px;">غير مسموح بالوصول المباشر لهذا الاختبار</h2>
                <p style="color: #64748B; font-weight: 600; margin-bottom: 24px;">يرجى تسجيل الدخول وبدء الاختبار من المنصة الرئيسية.</p>
                <a href="../../index.html" style="display: inline-block; background: #009688; color: #fff; padding: 10px 24px; border-radius: 9999px; text-decoration: none; font-weight: 800;">الذهاب للمنصة الرئيسية 🚀</a>
              </div>
            `;
          }
        } catch (e) {
          console.warn("Session check error:", e);
        }
      }
    }
  };

  window.QuizSDK = QuizSDK;
  window.addEventListener("DOMContentLoaded", () => {
    QuizSDK.enforceActiveSession();
  });
})(window);
