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
    }
  };

  window.QuizSDK = QuizSDK;
})(window);
