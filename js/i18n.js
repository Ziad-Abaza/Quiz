/**
 * Centralized Internationalization (i18n) Engine
 * Supports Arabic (RTL, Default) & English (LTR)
 * Extensible for future languages.
 */
(function() {
  const STORAGE_KEY = "quiz_platform_lang";
  const DEFAULT_LANG = "ar";

  const translations = {
    "ar": {
      "meta": {
        "dir": "rtl",
        "fontFamily": "'Cairo', 'Alexandria', 'Plus Jakarta Sans', system-ui, sans-serif"
      },
      "common": {
        "appName": "أكاديمية تكنولوجيا الأطفال",
        "teacherPortal": "🛡️ بوابة المعلم والإدارة",
        "studentPortal": "🚀 منصة الاختبار للطلاب",
        "logout": "تسجيل الخروج",
        "backToQuizzes": "← العودة للاختبارات",
        "nextStudent": "طالب جديد / البدء من جديد 🔄",
        "viewAdminResults": "عرض جميع النتائج في لوحة التحكم 📊",
        "langSwitchBtn": "English",
        "loading": "جاري التحميل..."
      },
      "registration": {
        "welcomeTitle": "مرحبًا بك يا بطل! 🧑‍🚀",
        "welcomeSubtitle": "مستعد لاختبار معلوماتك التكنولوجية؟ اكتب اسمك وانطلق في تحدي اليوم!",
        "nameLabel": "🧑‍🎓 اسم الطالب بالكامل",
        "namePlaceholder": "مثال: أحمد محمد",
        "gradeLabel": "🏫 الصف / الفصل",
        "gradeValue": "Senior 7",
        "startBtn": "ابدأ مغامرة الاختبار 🚀",
        "errorStudentCompleted": "⚠️ هذا الطالب قد أتم الاختبار مسبقًا على هذا النظام ولا يُسمح بإعادة التقديم.",
        "errorDeviceLocked": "🔒 تم قفل هذا الجهاز بعد إنهاء الاختبار السابق. يُرجى مراجعة المعلم لفتح الجهاز لطالب جديد.",
        "unlockPromptTitle": "إلغاء قفل الجهاز لبدء طالب جديد 🔑",
        "unlockPasswordPlaceholder": "كلمة مرور المعلم / الإدارة...",
        "unlockBtn": "إلغاء القفل والبدء 🚀",
        "unlockError": "كلمة مرور المعلم غير صحيحة."
      },
      "runner": {
        "quizCounter": "الاختبار {current} من {total}",
        "activeStatus": "🚀 مغامرة الاختبار نشطة"
      },
      "completion": {
        "congratsTitle": "عمل رائع ومتميز! 🏆",
        "congratsSubtitle": "لقد أكملت جميع الاختبارات بنجاح!",
        "scoreLabel": "النتيجة النهائية:",
        "percentageLabel": "نسبة النجاح:",
        "summaryTitle": "تفاصيل نتائج الاختبارات:"
      },
      "admin": {
        "loginTitle": "بوابة المعلم والإدارة",
        "loginSubtitle": "أدخل مفتاح الأمان للوصول إلى تقارير ونتائج الطلاب.",
        "loginPlaceholder": "🔑 أدخل كلمة مرور الإدارة...",
        "loginBtn": "فتح لوحة التحكم 🚀",
        "loginError": "كلمة المرور غير صحيحة. حاول مرة أخرى.",
        "headerTitle": "لوحة تحكم المعلم والإدارة",
        "headerSubtitle": "إدارة النتائج والتقارير • Senior 7",
        "statTotalStudents": "إجمالي الطلاب",
        "statAvgScore": "متوسط الدرجات",
        "statPassRate": "نسبة الإتقان",
        "statTotalQuizzes": "الاختبارات النشطة",
        "searchPlaceholder": "🔍 بحث باسم الطالب أو الصف...",
        "exportBtn": "تحميل تقرير TXT الشامل 📥",
        "resetDeviceBtn": "إلغاء قفل الجهاز والسماح لطالب جديد 🔓",
        "deviceUnlockedAlert": "تم إلغاء قفل هذا الجهاز بنجاح وجاهز لاستقبال طالب جديد! ✅",
        "clearBtn": "مسح جميع السجلات 🗑️",
        "clearConfirm": "هل أنت متأكد من رغبتك في مسح كافة نتائج الطلاب؟ لا يمكن التراجع عن هذا الإجراء.",
        "tableColStudent": "اسم الطالب",
        "tableColGrade": "الصف / الفصل",
        "tableColScore": "الدرجة الكلية",
        "tableColPercentage": "النسبة المئوية",
        "tableColDate": "تاريخ وساعة الإكمال",
        "tableColStatus": "الحالة",
        "statusPassed": "ناجح ومتفوق ⭐",
        "statusNeedsPractice": "يحتاج تدريب 📝",
        "emptyTitle": "لا توجد نتائج مسجلة حتى الآن",
        "emptySubtitle": "عندما يكمل الطلاب اختباراتهم، ستظهر تقاريرهم هنا تلقائيًا."
      }
    },
    "en": {
      "meta": {
        "dir": "ltr",
        "fontFamily": "'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif"
      },
      "common": {
        "appName": "Kids Tech Academy",
        "teacherPortal": "🛡️ Teacher & Admin Portal",
        "studentPortal": "🚀 Student Quiz Platform",
        "logout": "Logout",
        "backToQuizzes": "← Back to Quizzes",
        "nextStudent": "New Student / Start Over 🔄",
        "viewAdminResults": "View All Results in Admin 📊",
        "langSwitchBtn": "العربية",
        "loading": "Loading..."
      },
      "registration": {
        "welcomeTitle": "Welcome, Explorer! 🧑‍🚀",
        "welcomeSubtitle": "Ready to test your tech knowledge? Enter your name to blast off into today's challenge!",
        "nameLabel": "🧑‍🎓 Student Full Name",
        "namePlaceholder": "e.g. Alex Smith",
        "gradeLabel": "🏫 Grade / Class",
        "gradeValue": "Senior 7",
        "startBtn": "Start Quiz Adventure 🚀",
        "errorStudentCompleted": "⚠️ This student has already completed the exam on this system and cannot retake it.",
        "errorDeviceLocked": "🔒 This device is locked following the previous exam. Please consult the teacher/admin to unlock for the next student.",
        "unlockPromptTitle": "Unlock Device for Next Student 🔑",
        "unlockPasswordPlaceholder": "Teacher / Admin Password...",
        "unlockBtn": "Unlock & Start 🚀",
        "unlockError": "Incorrect teacher password."
      },
      "runner": {
        "quizCounter": "Quiz {current} of {total}",
        "activeStatus": "🚀 Quiz Adventure Active"
      },
      "completion": {
        "congratsTitle": "Fantastic Job! 🏆",
        "congratsSubtitle": "You have completed all quizzes successfully!",
        "scoreLabel": "Final Score:",
        "percentageLabel": "Success Rate:",
        "summaryTitle": "Quiz Breakdown:"
      },
      "admin": {
        "loginTitle": "Teacher & Admin Portal",
        "loginSubtitle": "Enter the security key to access student scores & analytics.",
        "loginPlaceholder": "🔑 Enter admin password...",
        "loginBtn": "Access Control Center 🚀",
        "loginError": "Incorrect password. Please try again.",
        "headerTitle": "Teacher & Admin Portal",
        "headerSubtitle": "Results Control & Analytics • Senior 7",
        "statTotalStudents": "Total Students",
        "statAvgScore": "Average Score",
        "statPassRate": "Mastery Rate",
        "statTotalQuizzes": "Active Quizzes",
        "searchPlaceholder": "🔍 Search by student name or grade...",
        "exportBtn": "Download Unified TXT Report 📥",
        "resetDeviceBtn": "Reset Device / Allow Next Student 🔓",
        "deviceUnlockedAlert": "This device has been unlocked and is ready for the next student! ✅",
        "clearBtn": "Clear All Records 🗑️",
        "clearConfirm": "Are you sure you want to delete all student records? This action cannot be undone.",
        "tableColStudent": "Student Name",
        "tableColGrade": "Grade / Class",
        "tableColScore": "Total Score",
        "tableColPercentage": "Percentage",
        "tableColDate": "Completed At",
        "tableColStatus": "Status",
        "statusPassed": "Mastered ⭐",
        "statusNeedsPractice": "Needs Practice 📝",
        "emptyTitle": "No Student Results Recorded Yet",
        "emptySubtitle": "When students complete quizzes, their live reports will appear here automatically."
      }
    }
  };

  class I18nManager {
    constructor() {
      this.currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
      if (!translations[this.currentLang]) {
        this.currentLang = DEFAULT_LANG;
      }
      this.listeners = [];
    }

    getLang() {
      return this.currentLang;
    }

    setLang(lang) {
      if (!translations[lang]) return;
      this.currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      this.applyToDOM();
      this.notifyListeners();
    }

    toggleLang() {
      const nextLang = this.currentLang === "ar" ? "en" : "ar";
      this.setLang(nextLang);
    }

    t(keyPath, params = {}) {
      const keys = keyPath.split(".");
      let val = translations[this.currentLang];
      for (const k of keys) {
        if (val && val[k] !== undefined) {
          val = val[k];
        } else {
          val = this.getFallback(keyPath);
          break;
        }
      }

      if (typeof val === "string") {
        return val.replace(/\{(\w+)\}/g, (_, k) => params[k] !== undefined ? params[k] : `{${k}}`);
      }
      return val || keyPath;
    }

    getFallback(keyPath) {
      const keys = keyPath.split(".");
      let val = translations[DEFAULT_LANG];
      for (const k of keys) {
        if (val && val[k] !== undefined) {
          val = val[k];
        } else {
          return keyPath;
        }
      }
      return val;
    }

    onLanguageChange(callback) {
      if (typeof callback === "function") {
        this.listeners.push(callback);
      }
    }

    notifyListeners() {
      this.listeners.forEach(cb => {
        try { cb(this.currentLang); } catch(e) { console.error("i18n listener error:", e); }
      });
    }

    applyToDOM() {
      const langConfig = translations[this.currentLang];
      const dir = langConfig.meta.dir;
      document.documentElement.setAttribute("lang", this.currentLang);
      document.documentElement.setAttribute("dir", dir);
      document.body.style.fontFamily = langConfig.meta.fontFamily;

      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (key) {
          el.textContent = this.t(key);
        }
      });

      document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (key) {
          el.setAttribute("placeholder", this.t(key));
        }
      });

      document.querySelectorAll(".lang-switcher-btn").forEach(btn => {
        btn.textContent = this.t("common.langSwitchBtn");
      });
    }

    init() {
      this.applyToDOM();
    }
  }

  window.I18n = new I18nManager();
  window.addEventListener("DOMContentLoaded", () => {
    window.I18n.init();
  });
})();