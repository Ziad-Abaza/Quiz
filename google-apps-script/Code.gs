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
  "Timestamp"
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

  var totalScore = Number(payload.totalScore !== undefined ? payload.totalScore : (hwScore + mcqScore + sensorsScore));
  var totalMaxScore = Number(payload.totalMaxScore !== undefined ? payload.totalMaxScore : 34);
  var percentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

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
    new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" })
  ];

  sheet.appendRow(newRow);

  return {
    sessionId: sessionId,
    studentName: studentName,
    totalScore: totalScore,
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
    results.push({
      id: row[0],
      studentId: row[1],
      name: row[2],
      grade: row[3],
      supervisor: row[4],
      scores: {
        "quiz-arduino-hardware": { score: Number(row[5]) || 0, maxScore: 9 },
        "quiz-arduino-basics-mcq": { score: Number(row[6]) || 0, maxScore: 15 },
        "quiz-arduino-sensors-mcq": { score: Number(row[7]) || 0, maxScore: 10 }
      },
      totalScore: Number(row[8]) || 0,
      totalMaxScore: Number(row[9]) || 34,
      percentage: parseInt(String(row[10]).replace("%", ""), 10) || 0,
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
