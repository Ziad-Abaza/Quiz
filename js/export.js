/**
 * Unified TXT Report Exporter & File Downloader
 */
(function(window) {
  const Exporter = {
    /**
     * Formats all student results into a clean, human-readable plain text report.
     * @param {Array} results - List of completed student sessions
     * @param {Array} manifest - List of registered quizzes
     * @returns {string} Formatted plain text content
     */
    generateTxtReport(results = [], manifest = []) {
      const now = new Date();
      const formattedDate = now.toLocaleString();
      
      const totalStudents = results.length;
      let totalAvgPct = 0;
      if (totalStudents > 0) {
        const sumPct = results.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
        totalAvgPct = Math.round(sumPct / totalStudents);
      }
      let report = "";
      report += "======================================================================\n";
      report += "                  KIDS QUIZ PLATFORM - RESULTS REPORT                 \n";
      report += "               Generated: " + formattedDate + "                      \n";
      report += "======================================================================\n\n";

      report += "SUMMARY METRICS:\n";
      report += "  - Total Students Completed: " + totalStudents + "\n";
      report += "  - Average Class Performance: " + totalAvgPct + "%\n";
      report += "  - Total Available Quizzes:   " + manifest.length + "\n";
      report += "----------------------------------------------------------------------\n\n";

      if (totalStudents === 0) {
        report += "No student quiz records have been recorded yet.\n";
        return report;
      }

      results.forEach((student, index) => {
        report += "[STUDENT #" + (index + 1) + "]\n";
        report += "Name:         " + student.name + "\n";
        report += "Grade/Class:  " + student.grade + "\n";
        report += "Started:      " + (student.startedAt ? new Date(student.startedAt).toLocaleString() : 'N/A') + "\n";
        report += "Completed:    " + (student.completedAt ? new Date(student.completedAt).toLocaleString() : 'N/A') + "\n";
        report += "Score:        " + student.totalScore + " / " + student.totalMaxScore + " pts (" + student.percentage + "%)\n";
        report += "Status:       COMPLETED\n";
        report += "----------------------------------------------------------------------\n";
        report += "Quiz Breakdown:\n";

        if (student.scores && Object.keys(student.scores).length > 0) {
          Object.entries(student.scores).forEach(([quizId, scoreData]) => {
            const quizMeta = manifest.find(q => q.id === quizId);
            const title = quizMeta ? quizMeta.title : quizId;
            const pct = scoreData.maxScore > 0 ? Math.round((scoreData.score / scoreData.maxScore) * 100) : 0;
            report += "  • " + title.padEnd(30, ' ') + " : " + scoreData.score + " / " + scoreData.maxScore + " pts (" + pct + "%)\n";
          });
        } else {
          report += "  (No individual quiz breakdown available)\n";
        }

        report += "======================================================================\n\n";
      });

      return report;
    },

    downloadTxtFile(filename, textContent) {
      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || ("Quiz_Results_" + new Date().toISOString().slice(0, 10) + ".txt");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  window.QuizExporter = Exporter;
})(window);