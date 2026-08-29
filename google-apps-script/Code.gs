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

    if (action === "checkStudent") {
      var studentName = String((e.parameter && e.parameter.name) || "").trim().toLowerCase();
      var studentGrade = String((e.parameter && e.parameter.grade) || "").trim().toLowerCase();
      var studentId = String((e.parameter && e.parameter.id) || "").trim();

      var isCompleted = checkStudentCompleted(sheet, studentName, studentGrade, studentId);
      return createJsonResponse({
        status: "success",
        isCompleted: isCompleted
      });
    }

    if (action === "getAll") {
      var results = fetchAllRecords(sheet);
      return createJsonResponse({
        status: "success",
        count: results.length,
        data: results
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
      data: result
    });
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
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

  var totalScore = Number(payload.totalScore !== undefined ? payload.totalScore : computedTotalScore);
  var totalMaxScore = Number(payload.totalMaxScore !== undefined ? payload.totalMaxScore : (computedTotalMaxScore > 0 ? computedTotalMaxScore : 34));
  var percentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

  var answersJson = JSON.stringify(scores);

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

  for (var i = 1; i < data.length; i++) {
    var rowSessionId = String(data[i][0] || "").trim();
    var rowStudentId = String(data[i][1] || "").trim();
    var rowName = String(data[i][2] || "").trim().toLowerCase();
    var rowGrade = String(data[i][3] || "").trim().toLowerCase();

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
      "quiz-arduino-hardware": { score: Number(row[5]) || 0, maxScore: 9 },
      "quiz-arduino-basics-mcq": { score: Number(row[6]) || 0, maxScore: 15 },
      "quiz-arduino-sensors-mcq": { score: Number(row[7]) || 0, maxScore: 10 }
    };

    if (row[13]) {
      try {
        var rawParsed = JSON.parse(row[13]);
        if (rawParsed && typeof rawParsed === "object") {
          parsedScores = rawParsed;
        }
      } catch (err) {
        // Use default fallback
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
