/**
 * Arduino Basics 15 MCQ Interactive Quiz Engine
 * Bilingual (Arabic / English)
 * Correct Answers Matrix: [2, 2, 2, 3, 2, 1, 2, 3, 3, 3, 1, 3, 2, 1, 2] (1-indexed)
 */
(function() {
  const correctAnswers = [2, 2, 2, 3, 2, 1, 2, 3, 2, 3, 2, 3, 1, 2, 2];

  const questionsData = [
    {
      id: 1,
      correct: 2, // B
      ar: {
        q: "1. ما هو المكون المسؤول عن معالجة الأوامر وتنفيذ الكود البرمجي في دائرتك؟",
        options: ["LED", "Arduino Uno", "Buzzer", "DHT11"]
      },
      en: {
        q: "1. Which component is responsible for processing commands and executing code in your circuit?",
        options: ["LED", "Arduino Uno", "Buzzer", "DHT11"]
      }
    },
    {
      id: 2,
      correct: 2, // B
      ar: {
        q: "2. يُعتبر الـ LED من عناصر الـ:",
        options: ["Input (المدخلات)", "Output (المخرجات)", "Sensors (الحساسات)", "Power Supply (مصادر الطاقة)"]
      },
      en: {
        q: "2. The LED is classified as an:",
        options: ["Input element", "Output element", "Sensor element", "Power Supply element"]
      }
    },
    {
      id: 3,
      correct: 2, // B
      ar: {
        q: "3. الطرف الأطول في الـ LED يمثل القطب:",
        options: ["السالب (Cathode)", "الموجب (Anode)", "الأرضي (GND)", "التناظري (Analog)"]
      },
      en: {
        q: "3. The longer leg of an LED represents the:",
        options: ["Negative pole (Cathode)", "Positive pole (Anode)", "Ground pole (GND)", "Analog pole"]
      }
    },
    {
      id: 4,
      correct: 3, // C
      ar: {
        q: "4. أي من المكونات التالية يُستخدم لإصدار تنبيهات صوتية أو نغمات؟",
        options: ["IR Sensor", "Touch Sensor", "Buzzer", "MQ-2"]
      },
      en: {
        q: "4. Which of the following components is used to emit sound alerts or musical tones?",
        options: ["IR Sensor", "Touch Sensor", "Buzzer", "MQ-2"]
      }
    },
    {
      id: 5,
      correct: 2, // B
      ar: {
        q: "5. وظيفة حساس الـ MQ-2 هي الكشف عن:",
        options: ["درجة الحرارة والرطوبة", "الدخان والغازات القابلة للاشتعال", "شدة الإضاءة", "حركة الأجسام"]
      },
      en: {
        q: "5. The main function of the MQ-2 sensor is detecting:",
        options: ["Temperature and humidity", "Smoke and flammable gases", "Light intensity", "Object motion"]
      }
    },
    {
      id: 6,
      correct: 1, // A
      ar: {
        q: "6. إذا أردنا قياس كل من درجة الحرارة ونسبة الرطوبة معاً، نستخدم حساس:",
        options: ["DHT11", "IR Sensor", "Touch Sensor", "MQ-2"]
      },
      en: {
        q: "6. If we want to measure both temperature and humidity together, we use the:",
        options: ["DHT11 sensor", "IR Sensor", "Touch Sensor", "MQ-2 sensor"]
      }
    },
    {
      id: 7,
      correct: 2, // B
      ar: {
        q: "7. ما هي الوظيفة الأساسية لحساس الـ IR Sensor في مشاريع الروبوت؟",
        options: ["قياس درجة حرارة الجو", "اكتشاف وجود العوائق أو تتبع الخط الأسود", "إصدار أصوات تنبيهية", "تخزين الطاقة"]
      },
      en: {
        q: "7. What is the primary function of the IR Sensor in robotics projects?",
        options: ["Measuring ambient temperature", "Detecting obstacles or line following", "Emitting warning sounds", "Storing electrical energy"]
      }
    },
    {
      id: 8,
      correct: 3, // C
      ar: {
        q: "8. يُستخدم حساس اللمس (Touch Sensor) عادةً كبديل إلكتروني لـ:",
        options: ["الشاشات", "المقاومات", "الأزرار والمفاتيح (Push Buttons)", "البطاريات"]
      },
      en: {
        q: "8. A Touch Sensor is commonly used as an electronic replacement for:",
        options: ["Displays", "Resistors", "Push Buttons and switches", "Batteries"]
      }
    },
    {
      id: 9,
      correct: 2, // B
      ar: {
        q: "9. في برمجة البلوكات، لتشغيل الـ LED وجعله يضيء نختار حالة المنفذ لتكون:",
        options: ["LOW", "HIGH", "INPUT", "0"]
      },
      en: {
        q: "9. In block-based programming, to turn the LED ON and make it light up, we set the pin state to:",
        options: ["LOW", "HIGH", "INPUT", "0"]
      }
    },
    {
      id: 10,
      correct: 3, // C
      ar: {
        q: "10. المنافذ الرقمية (Digital Pins) في لوحة Arduino Uno تقرأ أو تخرج إشارات بقيم:",
        options: ["تتراوح بين 0 و 1023", "مستمرة متغيرة (Analog)", "HIGH أو LOW فقط (1 أو 0)", "قيم سالبة فقط"]
      },
      en: {
        q: "10. Digital Pins on the Arduino Uno read or output signals with values of:",
        options: ["Ranging between 0 and 1023", "Continuous variable values (Analog)", "HIGH or LOW only (1 or 0)", "Negative values only"]
      }
    },
    {
      id: 11,
      correct: 2, // B
      ar: {
        q: "11. يعتبر حساس اللمس (Touch Sensor) من وحدات:",
        options: ["الإخراج (Output)", "الإدخال (Input)", "معالجة البيانات", "إصدار الصوت"]
      },
      en: {
        q: "11. The Touch Sensor is considered one of the:",
        options: ["Output units", "Input units", "Data processing units", "Sound generating units"]
      }
    },
    {
      id: 12,
      correct: 3, // C
      ar: {
        q: "12. ما هو المنفذ (Pin) في لوحة Arduino Uno الذي نوصل به الطرف السالب للـ Buzzer أو الـ LED؟",
        options: ["5V", "3.3V", "GND", "Vin"]
      },
      en: {
        q: "12. Which pin on the Arduino Uno connects to the negative lead of a Buzzer or LED?",
        options: ["5V", "3.3V", "GND", "Vin"]
      }
    },
    {
      id: 13,
      correct: 1, // A
      ar: {
        q: "13. ماذا يفعل حساس الـ IR عندما يكتشف جسماً أو عائقاً أمامه؟",
        options: ["يرسل إشارة إلى الأردوينو ليخبره بوجود جسم", "يقوم بإطفاء لوحة الأردوينو تماماً", "يصدر صوتاً عاليًا بنفسه", "يقوم بتبريد المكان"]
      },
      en: {
        q: "13. What does the IR Sensor do when it detects an object or obstacle ahead?",
        options: ["Sends a signal to Arduino notifying it of an object", "Completely turns off the Arduino board", "Emits a loud sound by itself", "Cools down the room"]
      }
    },
    {
      id: 14,
      correct: 2, // B
      ar: {
        q: "14. لتشغيل الـ Buzzer كمنبه وإيقافه بعد ثانيتين باستخدام البلوكات، نضع بلوك:",
        options: ["Repeat (تكرار)", "Wait / Delay (انتظار 2 ثانية)", "Reset (إعادة تشغيل)", "Analog Read (قراءة تناظرية)"]
      },
      en: {
        q: "14. To sound the Buzzer as an alarm and stop it after 2 seconds using blocks, we insert a block for:",
        options: ["Repeat", "Wait / Delay (wait 2 seconds)", "Reset", "Analog Read"]
      }
    },
    {
      id: 15,
      correct: 2, // B
      ar: {
        q: "15. لتشغيل نظام إنذار حريق متكامل، أفضل توليفة من المكونات التالية هي:",
        options: ["LED + Touch Sensor", "MQ-2 + Buzzer + Arduino Uno", "DHT11 + IR Sensor", "Touch Sensor + IR Sensor"]
      },
      en: {
        q: "15. To build a complete fire alarm system, the best combination of components is:",
        options: ["LED + Touch Sensor", "MQ-2 + Buzzer + Arduino Uno", "DHT11 + IR Sensor", "Touch Sensor + IR Sensor"]
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
    const optionLetters = ["A", "B", "C", "D"];
    const answerRecords = [];

    questionsData.forEach((q, idx) => {
      const expected = correctAnswers[idx];
      const selected = userAnswers[q.id];
      if (selected === expected) {
        score++;
      }

      const letter = selected ? (optionLetters[selected - 1] || String(selected)) : "";

      answerRecords.push({
        quizId: "arduino-mcq",
        questionId: q.id,
        studentAnswer: letter
      });
    });

    // Submit via standard QuizSDK
    if (window.QuizSDK) {
      window.QuizSDK.submitScore({
        score: score,
        maxScore: 15,
        metadata: {
          quizId: "arduino-mcq",
          answers: answerRecords
        }
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