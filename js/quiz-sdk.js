/**
 * Quiz SDK for Interactive Quiz Pages
 * Include this script in each child quiz HTML page to enable communication with the main Shell.
 */
(function(window) {
  const QuizSDK = {
    /**
     * Submits the final score from the active quiz to the parent Shell.
     * @param {Object} data 
     * @param {number} data.score - Total score achieved by the student in this quiz
     * @param {number} data.maxScore - Maximum possible score for this quiz
     * @param {Object} [data.metadata] - Optional additional details/answers
     */
    submitScore(data) {
      if (!data || typeof data.score !== 'number') {
        console.error("QuizSDK: Invalid score payload. Expecting { score: number, maxScore: number }");
        return;
      }

      const payload = {
        type: "QUIZ_SUBMIT_SCORE",
        score: data.score,
        maxScore: data.maxScore || 10,
        metadata: data.metadata || {}
      };

      // 1. Post message to parent iframe host if running inside Shell
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(payload, "*");
      } 
      // 2. Direct standalone callback if parent registered directly
      else if (window.__onQuizComplete) {
        window.__onQuizComplete(payload);
      } else {
        console.warn("QuizSDK: Running standalone without host Shell. Score logged:", payload);
        alert("Quiz Complete! Your Score: " + data.score + " / " + (data.maxScore || 10));
      }
    }
  };

  window.QuizSDK = QuizSDK;
})(window);
