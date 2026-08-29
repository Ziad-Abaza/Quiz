/**
 * Arduino Sensors & Components 10 MCQ Interactive Quiz Engine
 * Bilingual (Arabic / English)
 * Correct Answers Matrix: [2, 2, 2, 3, 1, 3, 1, 2, 2, 2] (1-indexed: Q1=B, Q2=B, Q3=B, Q4=C, Q5=A, Q6=C, Q7=A, Q8=B, Q9=B, Q10=B)
 */
(function() {
  const correctAnswers = [2, 2, 2, 3, 1, 3, 1, 2, 2, 2];

  const questionsData = [
    {
      id: 1,
      correct: 2, // B
      ar: {
        q: "1. في لوحة Arduino Uno، المنافذ الرقمية (Digital Pins) تقرأ وتُخرج إشارات بقيم إما ............... أو ............... فقط.",
        options: [
          "0 أو 1023",
          "0 أو 1 (LOW أو HIGH)",
          "5V أو 12V",
          "موجبة أو سالبة"
        ]
      },
      en: {
        q: "1. On the Arduino Uno board, Digital Pins read and output signals with values of either ............... or ............... only.",
        options: [
          "0 or 1023",
          "0 or 1 (LOW or HIGH)",
          "5V or 12V",
          "Positive or negative"
        ]
      }
    },
    {
      id: 2,
      correct: 2, // B
      ar: {
        q: "2. تُعتبر الحساسات (Sensors) مثل DHT11 و MQ-2 مثالاً على وحدات ............... لأنها تستقبل المعلومات من العالم المحيط.",
        options: [
          "المخرجات (Output)",
          "الإدخال (Input)",
          "التغذية (Power)",
          "التخزين (Storage)"
        ]
      },
      en: {
        q: "2. Sensors like DHT11 and MQ-2 are examples of ............... units because they receive information from the surrounding environment.",
        options: [
          "Output",
          "Input",
          "Power",
          "Storage"
        ]
      }
    },
    {
      id: 3,
      correct: 2, // B
      ar: {
        q: "3. عناصر مثل الـ LED والـ Buzzer تُعتبر من وحدات ............... لأنها تُنفذ أوامر الأردوينو كإصدار ضوء أو صوت.",
        options: [
          "الإدخال (Input)",
          "المخرجات (Output)",
          "المعالجة (Processing)",
          "الاستشعار (Sensing)"
        ]
      },
      en: {
        q: "3. Components such as LEDs and Buzzers are considered ............... units because they execute Arduino commands like emitting light or sound.",
        options: [
          "Input",
          "Output",
          "Processing",
          "Sensing"
        ]
      }
    },
    {
      id: 4,
      correct: 3, // C
      ar: {
        q: "4. الطرف السالب في لوحة Arduino يسمى ............... ويتم توصيل الطرف القصير للـ LED به.",
        options: [
          "Vin",
          "5V",
          "GND",
          "3.3V"
        ]
      },
      en: {
        q: "4. The negative terminal on the Arduino board is called ..............., and the shorter leg of the LED connects to it.",
        options: [
          "Vin",
          "5V",
          "GND",
          "3.3V"
        ]
      }
    },
    {
      id: 5,
      correct: 1, // A
      ar: {
        q: "5. عند كتابة أوامر البلوكات، لجعل الـ LED يضيء نضبط حالته على ............... ولإطفائه نضبطه على ...............",
        options: [
          "HIGH / LOW",
          "IN / OUT",
          "1023 / 0",
          "ON / INPUT"
        ]
      },
      en: {
        q: "5. When creating block commands, to make the LED illuminate we set its state to ..............., and to turn it off we set it to ...............",
        options: [
          "HIGH / LOW",
          "IN / OUT",
          "1023 / 0",
          "ON / INPUT"
        ]
      }
    },
    {
      id: 6,
      correct: 3, // C
      ar: {
        q: "6. حساس ............... يُستخدم لقياس درجة الحرارة ونسبة الرطوبة معاً داخل الغرفة.",
        options: [
          "MQ-2",
          "IR Sensor",
          "DHT11",
          "Touch Sensor"
        ]
      },
      en: {
        q: "6. The ............... sensor is used to measure both temperature and humidity together inside a room.",
        options: [
          "MQ-2",
          "IR Sensor",
          "DHT11",
          "Touch Sensor"
        ]
      }
    },
    {
      id: 7,
      correct: 1, // A
      ar: {
        q: "7. لكشف تسريب الغازات أو تصاعد الدخان في نظام إنذار الحريق، نستخدم حساس ...............",
        options: [
          "MQ-2",
          "Touch Sensor",
          "DHT11",
          "LED"
        ]
      },
      en: {
        q: "7. To detect gas leaks or smoke emissions in a fire alarm system, we use the ............... sensor.",
        options: [
          "MQ-2",
          "Touch Sensor",
          "DHT11",
          "LED"
        ]
      }
    },
    {
      id: 8,
      correct: 2, // B
      ar: {
        q: "8. في روبوت تتبع الخط الأسود أو تفادي الحواجز، نعتمد على حساس الـ ............... لاكتشاف وجود العوائق.",
        options: [
          "Buzzer",
          "IR Sensor",
          "MQ-2",
          "DHT11"
        ]
      },
      en: {
        q: "8. In a black-line follower or obstacle-avoiding robot, we rely on the ............... sensor to detect obstacles.",
        options: [
          "Buzzer",
          "IR Sensor",
          "MQ-2",
          "DHT11"
        ]
      }
    },
    {
      id: 9,
      correct: 2, // B
      ar: {
        q: "9. يعمل حساس اللمس (Touch Sensor) تماماً مثل ............... عند الضغط عليه بإصبعك.",
        options: [
          "المصباح",
          "زر الضغط (Push Button)",
          "السماعة",
          "البطارية"
        ]
      },
      en: {
        q: "9. A Touch Sensor functions exactly like a ............... when pressed with your finger.",
        options: [
          "Light bulb",
          "Push Button",
          "Speaker",
          "Battery"
        ]
      }
    },
    {
      id: 10,
      correct: 2, // B
      ar: {
        q: "10. لكي نجعل الـ Buzzer يُصدر صوتاً لمدة ثانية واحدة ثم يتوقف في برمجة البلوكات، نستخدم بلوك ............... بعد أمر التشغيل.",
        options: [
          "التكرار (Loop)",
          "الانتظار / التأخير (Wait / Delay)",
          "القراءة (Read)",
          "المتغير (Variable)"
        ]
      },
      en: {
        q: "10. To make the Buzzer emit sound for one second and then stop in block-based programming, we place a ............... block after the turn-on command.",
        options: [
          "Loop",
          "Wait / Delay",
          "Read",
          "Variable"
        ]
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
    quizTitleText.textContent = lang === "ar" ? "اختبار حساسات ومكونات الأردوينو" : "Arduino Sensors & Components Quiz";
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

    // Calculate score exactly matching [2, 2, 2, 3, 1, 3, 1, 2, 2, 2]
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
        maxScore: 10
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