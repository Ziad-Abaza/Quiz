# 📊 Google Sheets Centralized Results Integration Guide

This platform supports centralized real-time synchronization with **Google Sheets** through **Google Apps Script** as a secure, serverless API endpoint.

---

## 🔒 Security Architecture
- **No Credentials Exposed**: Frontend code does not require Google API Keys, Service Account JSONs, or OAuth client secrets.
- **Server-Side Validation**: Scores, max scores, percentages, and duplicate submissions are strictly validated inside Apps Script.
- **Deduplication & Anti-Retake**: Every submission contains a unique Session ID. Existing student IDs/names are checked prior to starting an exam.
- **Offline Resilient**: If a classroom network outage occurs, results are safely buffered in LocalStorage and automatically synced when reconnected.

---

## 🛠️ Setup & Deployment (5 Minutes)

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.new) and create a new spreadsheet.
2. Rename the spreadsheet to: **Kids Quiz Adventure Results**.

---

### Step 2: Add Google Apps Script Code
1. In your Google Sheet, click **Extensions** &rarr; **Apps Script** from the top menu.
2. In the Apps Script code editor, delete any existing code inside Code.gs.
3. Open [google-apps-script/Code.gs](file:///D:/Ziad/Downloads/Quiz/google-apps-script/Code.gs) in this repository, copy its entire contents, and paste it into Code.gs.
4. Click the **Save** icon (💾).

---

### Step 3: Deploy as a Web App
1. In Apps Script, click the blue **Deploy** button (top-right) &rarr; **New deployment**.
2. Click the gear icon (⚙️) next to *Select type* and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: Kids Quiz Platform Centralized Results Sync
   - **Execute as**: Me (your_email@gmail.com)
   - **Who has access**: Anyone *(Crucial so student browser clients can send scores without Google sign-in)*
4. Click **Deploy**.
5. When prompted, click **Authorize access**, choose your Google account, click **Advanced**, and proceed with authorization.
6. **Copy the Web App URL** (it will look like: https://script.google.com/macros/s/AKfycby.../exec).

---

### Step 4: Connect the Platform
1. Open [config.js](file:///D:/Ziad/Downloads/Quiz/config.js) in this project.
2. Paste your copied Web App URL into googleSheets.apiUrl:

`javascript
window.APP_CONFIG = {
  appName: Kids Quiz Adventure,
  defaultAdminPassword: admin123,
  googleSheets: {
    apiUrl: https://script.google.com/macros/s/AKfycby.../exec, // <-- Paste here
    supervisor: Teacher Admin
  },
  // ...
};
`

---

## 📋 Stored Data Columns in Google Sheets

When students finish, a new row is recorded with the following columns:

1. **Session ID**: Unique random token (e.g. stu_1724935200000_a3x9f)
2. **Student ID**: Student identifier
3. **Student Name**: Student's registered full name
4. **Grade / Class**: Selected grade (e.g. Senior 7)
5. **Supervisor**: Name of proctor / teacher
6. **Arduino Hardware**: Score out of 9
7. **Arduino Basics MCQ**: Score out of 15
8. **Arduino Sensors MCQ**: Score out of 10
9. **Total Score**: Sum of earned points (e.g. 34)
10. **Total Max Score**: Maximum available points (34)
11. **Percentage (%)**: Overall performance percentage (e.g. 100%)
12. **Completed At**: ISO timestamp of completion
13. **Timestamp**: Local time recorded

---

## 🔄 How the Offline & Online Workflow Works

1. **Student Registration Check**:
   - Checks both local storage and Google Sheets to ensure the student hasn't completed the quiz previously.
2. **Post-Exam Auto-Sync**:
   - When the student finishes the last quiz, results are saved locally and dispatched via POST to the Google Apps Script Web App.
3. **Admin Dashboard Integration**:
   - The Teacher & Admin Portal loads centralized records directly from Google Sheets.
   - The unified .txt report export compiles both local and Google Sheets records.
4. **Offline Queue**:
   - If offline, results are saved to a pending queue in LocalStorage and automatically flushed on the next online event or browser reload.