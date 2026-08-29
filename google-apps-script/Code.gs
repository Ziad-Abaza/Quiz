/**
 * ==============================================================================
 * Google Apps Script: Kids Quiz Platform Google Sheets Bridge
 * ==============================================================================
 * 
 * Instructions:
 * 1. Open Google Sheets -> Extensions -> Apps Script.
 * 2. Paste this entire file into Code.gs (or الرمز.gs).
 * 3. Click Deploy -> New deployment.
 * 4. Select type: Web app.
 * 5. Configuration:
 *    - Description: Kids Quiz Platform Centralized Results Sync
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone
 * 6. Copy the generated Web App URL and paste it into config.js -> googleSheets.apiUrl.
 */

var SHEET_NAME = "Quiz Results";
var HEADERS = [
  "Session ID",
  "Student ID",
  "Student Name",
  "Grade / Class",
  "Supervisor",
  "Arduino Hardware (Score/9)",
  "Arduino Basics MCQ (Score/15)",
  "Arduino Sensors MCQ (Score/10)",
  "Total Score",
  "Total Max Score",
  "Percentage (%)",
  "Completed At",
  "Timestamp",
  "Answers Details (JSON)"
];

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || "getAll";
    var sheet = getOrCreateSheet();

    if (action === "getResetVersion") {
      var version = getGlobalResetVersion();
      return createJsonResponse({
        status: "success",
        resetVersion: version
      });
    }

    if (action === "checkStudent") {
      var studentName = String((e.parameter && e.parameter.name) || "").trim().toLowerCase();
      var studentGrade = String((e.parameter && e.parameter.grade) || "").trim().toLowerCase();
      var studentId = String((e.parameter && e.parameter.id) || "").trim();

      var isCompleted = checkStudentCompleted(sheet, studentName, studentGrade, studentId);
      return createJsonResponse({
        status: "success",
        isCompleted: isCompleted,
        resetVersion: getGlobalResetVersion()
      });
    }

    if (action === "getAll") {
      var results = fetchAllRecords(sheet);
      return createJsonResponse({
        status: "success",
        count: results.length,
        data: results,
        resetVersion: getGlobalResetVersion()
      });
    }

    if (action === "resetAllDevices") {
      var newVersion = triggerGlobalDeviceReset();
      return createJsonResponse({
        status: "success",
        message: "Global reset triggered successfully. All student devices will unlock.",
        resetVersion: newVersion
      });
    }

    if (action === "clearAll") {
      var clearedCount = clearAllSheetRecords(sheet);
      return createJsonResponse({
        status: "success",
        message: "All student records deleted from Google Sheets",
        deletedCount: clearedCount
      });
    }

    return createJsonResponse({
      status: "success",
      message: "Kids Quiz Platform Google Sheets API is live!"
    });
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

function doPost(e) {
  try {
    var payload;
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    if (!payload) {
      throw new Error("Missing payload data");
    }

    var sheet = getOrCreateSheet();
    var action = payload.action || (e && e.parameter && e.parameter.action);

    if (action === "resetAllDevices") {
      var newVersion = triggerGlobalDeviceReset();
      return createJsonResponse({
        status: "success",
        message: "Global reset triggered successfully. All student devices will unlock.",
        resetVersion: newVersion
      });
    }

    if (action === "clearAll") {
      var clearedCount = clearAllSheetRecords(sheet);
      return createJsonResponse({
        status: "success",
        message: "All student records deleted from Google Sheets",
        deletedCount: clearedCount
      });
    }

    var result = recordStudentSubmission(sheet, payload);

    return createJsonResponse({
      status: "success",
      message: "Result successfully recorded in Google Sheets",
      data: result,
      resetVersion: getGlobalResetVersion()
    });
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

/**
 * Global Remote Reset Version Manager
 * Stores the current reset timestamp in a dedicated settings sheet or ScriptProperties.
 */
var SETTINGS_SHEET_NAME = "App Settings";

function getGlobalResetVersion() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var settingsSheet = ss.getSheetByName(SETTINGS_SHEET_NAME);
    if (!settingsSheet) {
      settingsSheet = ss.insertSheet(SETTINGS_SHEET_NAME);
      settingsSheet.appendRow(["Key", "Value", "Updated At"]);
      settingsSheet.appendRow(["RESET_VERSION", 1, new Date().toISOString()]);
      settingsSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#334155").setFontColor("#FFFFFF");
      return 1;
    }

    var data = settingsSheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === "RESET_VERSION") {
        return Number(data[i][1]) || 1;
      }
    }

    // Default if key row not found
    settingsSheet.appendRow(["RESET_VERSION", 1, new Date().toISOString()]);
    return 1;
  } catch (err) {
    var props = PropertiesService.getScriptProperties();
    var ver = props.getProperty("RESET_VERSION");
    return ver ? Number(ver) : 1;
  }
}

function triggerGlobalDeviceReset() {
  var newVersion = Date.now();
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var settingsSheet = ss.getSheetByName(SETTINGS_SHEET_NAME);
    if (!settingsSheet) {
      settingsSheet = ss.insertSheet(SETTINGS_SHEET_NAME);
      settingsSheet.appendRow(["Key", "Value", "Updated At"]);
      settingsSheet.appendRow(["RESET_VERSION", newVersion, new Date().toISOString()]);
      settingsSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#334155").setFontColor("#FFFFFF");
    } else {
      var data = settingsSheet.getDataRange().getValues();
      var found = false;
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === "RESET_VERSION") {
          settingsSheet.getRange(i + 1, 2).setValue(newVersion);
          settingsSheet.getRange(i + 1, 3).setValue(new Date().toISOString());
          found = true;
          break;
        }
      }
      if (!found) {
        settingsSheet.appendRow(["RESET_VERSION", newVersion, new Date().toISOString()]);
      }
    }
  } catch (err) {
    var props = PropertiesService.getScriptProperties();
    props.setProperty("RESET_VERSION", String(newVersion));
  }
  return newVersion;
}

/**
 * Deletes all student data rows from the Google Sheet while preserving headers & formatting.
 */
function clearAllSheetRecords(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var numRowsToDelete = lastRow - 1;
    sheet.deleteRows(2, numRowsToDelete);
    return numRowsToDelete;
  }
  return 0;
}

function recordStudentSubmission(sheet, payload) {
  var sessionId = String(payload.sessionId || payload.id || "").trim();
  var studentId = String(payload.studentId || payload.id || "").trim();
  var studentName = String(payload.studentName || payload.name || "").trim();
  var studentGrade = String(payload.studentGrade || payload.grade || "").trim();
  var supervisor = String(payload.supervisor || "Teacher Admin").trim();
  var completedAt = String(payload.completedAt || new Date().toISOString()).trim();

  if (!sessionId || !studentName) {
    throw new Error("Invalid payload: Missing Session ID or Student Name");
  }

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === sessionId) {
      return { duplicate: true, row: i + 1, sessionId: sessionId };
    }
  }

  var scores = payload.scores || {};
  var hwScore = (scores["quiz-arduino-hardware"] && Number(scores["quiz-arduino-hardware"].score)) || 0;
  var mcqScore = (scores["quiz-arduino-basics-mcq"] && Number(scores["quiz-arduino-basics-mcq"].score)) || 0;
  var sensorsScore = (scores["quiz-arduino-sensors-mcq"] && Number(scores["quiz-arduino-sensors-mcq"].score)) || 0;

  // Dynamically compute total earned score and total available max score across ALL quizzes submitted
  var computedTotalScore = 0;
  var computedTotalMaxScore = 0;
  if (typeof scores === "object" && Object.keys(scores).length > 0) {
    Object.keys(scores).forEach(function(key) {
      computedTotalScore += Number(scores[key].score) || 0;
      computedTotalMaxScore += Number(scores[key].maxScore) || 0;
    });
  }

  // Flatten all answers from all completed quizzes into a clean list of { quizId, questionId, studentAnswer }
  var answersList = [];
  if (typeof scores === "object") {
    Object.keys(scores).forEach(function(quizKey) {
      var qAnswers = scores[quizKey] && scores[quizKey].answers;
      if (Array.isArray(qAnswers)) {
        qAnswers.forEach(function(ans) {
          answersList.push({
            quizId: ans.quizId || quizKey,
            questionId: ans.questionId,
            studentAnswer: ans.studentAnswer !== undefined ? ans.studentAnswer : ""
          });
        });
      }
    });
  }

  var answersJson = JSON.stringify(answersList.length > 0 ? answersList : scores);

  var newRow = [
    sessionId,
    studentId,
    studentName,
    studentGrade,
    supervisor,
    hwScore,
    mcqScore,
    sensorsScore,
    totalScore,
    totalMaxScore,
    percentage + "%",
    completedAt,
    new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }),
    answersJson
  ];

  sheet.appendRow(newRow);

  return {
    sessionId: sessionId,
    studentName: studentName,
    totalScore: totalScore,
    totalMaxScore: totalMaxScore,
    percentage: percentage
  };
}

function checkStudentCompleted(sheet, studentName, studentGrade, studentId) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return false;

  var currentResetVersion = getGlobalResetVersion();

  for (var i = 1; i < data.length; i++) {
    var rowSessionId = String(data[i][0] || "").trim();
    var rowStudentId = String(data[i][1] || "").trim();
    var rowName = String(data[i][2] || "").trim().toLowerCase();
    var rowGrade = String(data[i][3] || "").trim().toLowerCase();
    var rowCompletedAt = data[i][11];

    // If a global reset was triggered, only submissions created AFTER the reset timestamp count as completed attempts
    if (currentResetVersion > 1) {
      var rowTime = rowCompletedAt ? new Date(rowCompletedAt).getTime() : 0;
      if (rowTime > 0 && rowTime < currentResetVersion) {
        continue; // Submission was from a previous reset epoch, allow new attempt
      }
    }

    if (studentId && (rowStudentId === studentId || rowSessionId === studentId)) {
      return true;
    }
    if (studentName && rowName === studentName && (!studentGrade || rowGrade === studentGrade)) {
      return true;
    }
  }
  return false;
}

function fetchAllRecords(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var results = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowTotal = Number(row[8]) || 0;
    var rowMax = Number(row[9]) || 0;
    
    // Parse percentage safely from column 10 or calculate dynamically from total / max
    var rawPctStr = String(row[10] || "").replace("%", "").trim();
    var parsedPct = parseInt(rawPctStr, 10);
    var finalPct = !isNaN(parsedPct) && parsedPct > 0 ? parsedPct : (rowMax > 0 ? Math.round((rowTotal / rowMax) * 100) : 0);

    // Parse detailed answers JSON if present in column 14
    var parsedScores = {
      "quiz-arduino-hardware": { score: Number(row[5]) || 0, maxScore: 9, answers: [] },
      "quiz-arduino-basics-mcq": { score: Number(row[6]) || 0, maxScore: 15, answers: [] },
      "quiz-arduino-sensors-mcq": { score: Number(row[7]) || 0, maxScore: 10, answers: [] }
    };

    if (row[13]) {
      try {
        var rawParsed = JSON.parse(row[13]);
        if (Array.isArray(rawParsed)) {
          // Flat list of { quizId, questionId, studentAnswer }
          rawParsed.forEach(function(item) {
            var qId = item.quizId;
            if (qId === "arduino") qId = "quiz-arduino-hardware";
            if (qId === "arduino-mcq") qId = "quiz-arduino-basics-mcq";
            if (qId === "arduino-sensors-mcq") qId = "quiz-arduino-sensors-mcq";

            if (!parsedScores[qId]) {
              parsedScores[qId] = { score: 0, maxScore: 0, answers: [] };
            }
            parsedScores[qId].answers = parsedScores[qId].answers || [];
            parsedScores[qId].answers.push({
              quizId: item.quizId,
              questionId: item.questionId,
              studentAnswer: item.studentAnswer
            });
          });
        } else if (rawParsed && typeof rawParsed === "object") {
          parsedScores = rawParsed;
        }
      } catch (err) {
        // Fallback
      }
    }

    results.push({
      id: row[0],
      studentId: row[1],
      name: row[2],
      grade: row[3],
      supervisor: row[4],
      scores: parsedScores,
      totalScore: rowTotal,
      totalMaxScore: rowMax > 0 ? rowMax : 34,
      percentage: finalPct,
      completedAt: row[11],
      timestamp: row[12]
    });
  }
  return results;
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#009688").setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
