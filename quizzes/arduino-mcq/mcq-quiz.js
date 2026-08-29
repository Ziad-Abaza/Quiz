/**
 * Arduino Basics 15 MCQ Interactive Quiz Engine
 * Bilingual (Arabic / English)
 * Correct Answers Matrix: [2, 2, 2, 3, 2, 1, 2, 3, 3, 3, 1, 3, 2, 1, 2] (1-indexed)
 */
(function() {
  const correctAnswers = [2, 2, 2, 3, 2, 1, 2, 3, 3, 3, 1, 3, 2, 1, 2];

  const questionsData = [
    {
      id: 1,
      correct: 2,
      ar: {
        q: "1. ما هو المتحكم الدقيق (Microcontroller) الرئيسي في لوحة Arduino Uno؟",
        options: ["ATmega2560", "ATmega328P", "ESP32", "STM32"]
      },
      en: {
        q: "1. What is the main microcontroller chip on the Arduino Uno board?",
        options: ["ATmega2560", "ATmega328P", "ESP32", "STM32"]
      }
    },
    {
      id: 2,
      correct: 2,
      ar: {
        q: "2. كم عدد المنافذ الرقمية (Digital I/O Pins) في لوحة Arduino Uno؟",
        options: ["10 منافذ", "14 منفذًا (D0 إلى D13)", "6 منافذ", "20 منفذًا"]
      },
      en: {
        q: "2. How many Digital I/O Pins are on the Arduino Uno board?",
        options: ["10 Pins", "14 Pins (D0 to D13)", "6 Pins", "20 Pins"]
      }
    },
    {
      id: 3,
      correct: 2,
      ar: {
        q: "3. ما هي وظيفة منفذ USB من النوع Type-B في الأردوينو؟",
        options: ["شحن بطارية الهاتف فقط", "توصيل اللوحة بالكمبيوتر للبرمجة وتوفير الطاقة", "توصيل مكبر صوت خارجي", "توصيل شاشة HDMI"]
      },
      en: {
        q: "3. What is the function of the USB Type-B port on Arduino?",
        options: ["Charge mobile phone only", "Connect to computer for programming & power", "Connect an external speaker", "Connect an HDMI screen"]
      }
    },
    {
      id: 4,
      correct: 3,
      ar: {
        q: "4. كم عدد المنافذ التناظرية (Analog Input Pins) في لوحة Arduino Uno؟",
        options: ["2 منفذ", "4 منافذ", "6 منافذ (A0 إلى A5)", "14 منفذًا"]
      },
      en: {
        q: "4. How many Analog Input Pins (A0-A5) are available on Arduino Uno?",
        options: ["2 Pins", "4 Pins", "6 Pins (A0 to A5)", "14 Pins"]
      }
    },
    {
      id: 5,
      correct: 2,
      ar: {
        q: "5. ما هو الجهد الكهربائي التشغيلي القياسي للوحة Arduino Uno؟",
        options: ["12V", "5V", "1.5V", "220V"]
      },
      en: {
        q: "5. What is the standard operating voltage for the Arduino Uno logic?",
        options: ["12V", "5V", "1.5V", "220V"]
      }
    },
    {
      id: 6,
      correct: 1,
      ar: {
        q: "6. ما هي وظيفة زر Reset الموجود على اللوحة؟",
        options: ["إعادة تشغيل البرنامج من البداية", "مسح البرنامج نهائيًا من الذاكرة", "زيادة سرعة المعالج", "إيقاف الطاقة تمامًا"]
      },
      en: {
        q: "6. What is the purpose of the Reset button on the Arduino board?",
        options: ["Restart the uploaded program from the beginning", "Erase the program permanently", "Boost CPU clock speed", "Turn off power permanently"]
      }
    },
    {
      id: 7,
      correct: 2,
      ar: {
        q: "7. ما الذي يرمز إليه المنفذ GND في لوحة الأردوينو؟",
        options: ["منفذ الإنترنت (Ground Network Data)", "الطرف الأرضي للدائرة (Ground - 0V)", "منفذ الطاقة العالية (Gain Normal Direct)", "منفذ المحرك"]
      },
      en: {
        q: "7. What does the GND pin stand for on Arduino?",
        options: ["Ground Network Data", "Ground (0V reference for circuits)", "Gain Normal Direct", "Geared Node Driver"]
      }
    },
    {
      id: 8,
      correct: 3,
      ar: {
        q: "8. ما هي وظيفة منافذ PWM (المميزة بعلامة ~ بجانب الرقم)؟",
        options: ["قياس درجة حرارة اللوحة", "توصيل الإنترنت اللاسلكي", "محاكاة الإشارات التناظرية للتحكم بالسرعة والسطوع", "حفظ الملفات"]
      },
      en: {
        q: "8. What is the function of PWM pins (marked with ~)?",
        options: ["Measure board temperature", "Connect to Wi-Fi", "Simulate analog output to control speed & brightness", "Store local files"]
      }
    },
    {
      id: 9,
      correct: 3,
      ar: {
        q: "9. ما هو الجهد الموصى به لمقبس الطاقة الخارجي (DC Barrel Jack)؟",
        options: ["1V إلى 3V", "50V إلى 100V", "7V إلى 12V", "220V تيار متردد"]
      },
      en: {
        q: "9. What is the recommended input voltage for the DC Barrel Jack?",
        options: ["1V to 3V", "50V to 100V", "7V to 12V", "220V AC"]
      }
    },
    {
      id: 10,
      correct: 3,
      ar: {
        q: "10. ما هي وظيفة الدالة ()setup في كود الأردوينو؟",
        options: ["تكرار الكود إلى ما لا نهاية", "إغلاق برنامج الأردوينو", "تنفيذ الأوامر مرة واحدة فقط عند بدء التشغيل لتهيئة الإعدادات", "حساب المعادلات الرياضية"]
      },
      en: {
        q: "10. What is the role of the setup() function in Arduino code?",
        options: ["Repeat code infinitely", "Close the Arduino IDE", "Execute instructions once at startup for configuration", "Calculate complex math"]
      }
    },
    {
      id: 11,
      correct: 1,
      ar: {
        q: "11. ما هي وظيفة الدالة ()loop في كود الأردوينو؟",
        options: ["تكرار تنفيذ الأوامر باستمرار وبشكل دوري", "تنفيذ الكود مرة واحدة فقط", "إعادة تسمية الملف", "مسح الكود"]
      },
      en: {
        q: "11. What is the role of the loop() function in Arduino code?",
        options: ["Continuously repeat executing the code in a loop", "Execute the code once only", "Rename the sketch file", "Delete the program"]
      }
    },
    {
      id: 12,
      correct: 3,
      ar: {
        q: "12. أي أمر برمجي يُستخدم لتحديد وضعية المنفذ (مدخل INPUT أو مخرج OUTPUT)؟",
        options: ["digitalRead()", "delay()", "pinMode()", "Serial.print()"]
      },
      en: {
        q: "12. Which function is used to configure a pin as INPUT or OUTPUT?",
        options: ["digitalRead()", "delay()", "pinMode()", "Serial.print()"]
      }
    },
    {
      id: 13,
      correct: 2,
      ar: {
        q: "13. لإخراج جهد كهربائي HIGH (تشغيل) على منفذ رقمي معين، نستخدم الأمر:",
        options: ["analogRead()", "digitalWrite(pin, HIGH)", "pinMode(pin, HIGH)", "delay(1000)"]
      },
      en: {
        q: "13. To output a HIGH voltage (turn ON) to a digital pin, we use:",
        options: ["analogRead()", "digitalWrite(pin, HIGH)", "pinMode(pin, HIGH)", "delay(1000)"]
      }
    },
    {
      id: 14,
      correct: 1,
      ar: {
        q: "14. ما هي الدالة البرمجية المسؤولة عن إيقاف تنفيذ البرنامج مؤقتًا لفترة زمنية محددة بالمللي ثانية؟",
        options: ["delay()", "stop()", "pause()", "wait()"]
      },
      en: {
        q: "14. Which function pauses the program for a specified time in milliseconds?",
        options: ["delay()", "stop()", "pause()", "wait()"]
      }
    },
    {
      id: 15,
      correct: 2,
      ar: {
        q: "15. ما هي وحدة قياس الزمن في دالة (1000)delay؟",
        options: ["دقيقة واحدة (1 Minute)", "1000 مللي ثانية (تساوي ثانية واحدة)", "ساعة واحدة (1 Hour)", "10 ثوانٍ"]
      },
      en: {
        q: "15. What duration of time does delay(1000) represent?",
        options: ["1 Minute", "1000 Milliseconds (equal to 1 second)", "1 Hour", "10 Seconds"]
      }
    }
  ];

  // State
  let currentIndex = 0;
  const userAnswers = {};

  // DOM Elements
  const quizTitleText = document.getElementById("quizTitleText");
  const counterBadge = document.getElementById("counterBadge");
  const progressFill = document.getElementById("progressFill");
  const questionText = document.getElementById("questionText");
  const optionsGrid = document.getElementById("optionsGrid");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  function getLang() {
    return (window.I18n && window.I18n.getLang()) || "ar";
  }

  function renderQuestion() {
    const lang = getLang();
    const qData = questionsData[currentIndex];
    const localized = qData[lang] || qData.ar;

    // Direction & Language
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);

    // Title & Counter
    quizTitleText.textContent = lang === "ar" ? "اختبار أساسيات الأردوينو" : "Arduino Basics Quiz";
    counterBadge.textContent = `${currentIndex + 1} / ${questionsData.length}`;

    // Progress Bar
    const progressPct = ((currentIndex + 1) / questionsData.length) * 100;
    progressFill.style.width = `${progressPct}%`;

    // Question Text
    questionText.textContent = localized.q;

    // Render 4 Options
    optionsGrid.innerHTML = "";
    const optionLetters = lang === "ar" ? ["أ", "ب", "ج", "د"] : ["A", "B", "C", "D"];

    localized.options.forEach((optText, idx) => {
      const optNum = idx + 1;
      const isSelected = userAnswers[qData.id] === optNum;

      const card = document.createElement("div");
      card.className = `option-card ${isSelected ? "selected" : ""}`;
      card.innerHTML = `
        <div class="option-letter">${optionLetters[idx]}</div>
        <div class="option-text">${escapeHtml(optText)}</div>
      `;

      card.addEventListener("click", () => {
        selectOption(qData.id, optNum);
      });

      optionsGrid.appendChild(card);
    });

    // Update Nav Buttons
    prevBtn.disabled = currentIndex === 0;
    prevBtn.textContent = lang === "ar" ? "← السابق" : "← Previous";

    const isLast = currentIndex === questionsData.length - 1;
    if (isLast) {
      nextBtn.style.display = "none";
      submitBtn.style.display = "inline-flex";
      submitBtn.textContent = lang === "ar" ? "إنهاء وتسليم الاختبار 🚀" : "Finish & Submit Quiz 🚀";
    } else {
      nextBtn.style.display = "inline-flex";
      submitBtn.style.display = "none";
      nextBtn.textContent = lang === "ar" ? "التالي →" : "Next →";
    }
  }

  function selectOption(questionId, optIndex) {
    userAnswers[questionId] = optIndex;
    renderQuestion();
  }

  function handleNext() {
    const qData = questionsData[currentIndex];
    if (!userAnswers[qData.id]) {
      const lang = getLang();
      const alertMsg = lang === "ar" ? "يرجى اختيار إجابة للمتابعة!" : "Please select an answer to continue!";
      alert(alertMsg);
      return;
    }

    if (currentIndex < questionsData.length - 1) {
      currentIndex++;
      renderQuestion();
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  }

  function handleSubmit() {
    const qData = questionsData[currentIndex];
    if (!userAnswers[qData.id]) {
      const lang = getLang();
      const alertMsg = lang === "ar" ? "يرجى اختيار إجابة قبل إنهاء الاختبار!" : "Please select an answer before submitting!";
      alert(alertMsg);
      return;
    }

    for (let i = 0; i < questionsData.length; i++) {
      const q = questionsData[i];
      if (!userAnswers[q.id]) {
        currentIndex = i;
        renderQuestion();
        const lang = getLang();
        const alertMsg = lang === "ar" ? `يرجى الإجابة على السؤال رقم ${i + 1}` : `Please answer question #${i + 1}`;
        alert(alertMsg);
        return;
      }
    }

    // Calculate score exactly matching [2, 2, 2, 3, 2, 1, 2, 3, 3, 3, 1, 3, 2, 1, 2]
    let score = 0;
    questionsData.forEach((q, idx) => {
      const expected = correctAnswers[idx];
      const selected = userAnswers[q.id];
      if (selected === expected) {
        score++;
      }
    });

    // Submit via standard QuizSDK
    if (window.QuizSDK) {
      window.QuizSDK.submitScore({
        score: score,
        maxScore: 15
      });
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function init() {
    prevBtn.addEventListener("click", handlePrev);
    nextBtn.addEventListener("click", handleNext);
    submitBtn.addEventListener("click", handleSubmit);

    if (window.I18n) {
      window.I18n.onLanguageChange(() => {
        renderQuestion();
      });
    }

    if (window.QuizSDK) {
      window.QuizSDK.onLanguageChange(() => {
        renderQuestion();
      });
    }

    renderQuestion();
  }

  window.addEventListener("DOMContentLoaded", init);
})();