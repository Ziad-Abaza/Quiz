/**
 * Arduino Hardware Interactive Quiz Engine
 */
(function() {
  const components = [
    {
      id: 1,
      name: "Reset Push Button",
      color: "#EA580C",
      top: "15%",
      left: "20%",
      arabicAnswers: [
        "زر اعاده الضبط",
        "زر اعاده التشغيل",
        "زر الريست",
        "زر ريست",
        "اعاده ضبط",
        "ريست",
        "زر اعاده",
      ],
      englishAnswers: ["reset button", "reset push button", "reset"],
    },
    {
      id: 2,
      name: "USB Type-B Port",
      color: "#E11D48",
      top: "23%",
      left: "14%",
      arabicAnswers: [
        "منفذ usb",
        "مدخل usb",
        "منفذ البرمجه",
        "مدخل يو اس بي",
        "منفذ يو اس بي",
        "usb",
        "سوكت usb",
        "منفذ التوصيل",
      ],
      englishAnswers: [
        "usb port",
        "usb jack",
        "usb type-b",
        "usb",
        "usb connector",
      ],
    },
    {
      id: 3,
      name: "DC Power Barrel Jack",
      color: "#0CA6A3",
      top: "76%",
      left: "14%",
      arabicAnswers: [
        "مقبس الطاقه",
        "مدخل الكهرباء",
        "مدخل الباور",
        "مقبس الباور",
        "مدخل الطاقه",
        "منفذ الطاقه",
        "جاك الباور",
        "منفذ الكهرباء",
        "مدخل dc",
        "مقبس dc",
      ],
      englishAnswers: [
        "dc jack",
        "power jack",
        "dc power jack",
        "barrel jack",
        "power socket",
        "jack",
      ],
    },
    {
      id: 4,
      name: "Reset Pin",
      color: "#16A34A",
      top: "88%",
      left: "40%",
      arabicAnswers: [
        "منفذ reset",
        "بن اعاده الضبط",
        "مخرج ريست",
        "منفذ ريست",
        "بن ريست",
        "بن اعاده",
        "منفذ اعاده الضبط",
        "reset pin",
      ],
      englishAnswers: ["reset pin", "reset", "pin reset"],
    },
    {
      id: 5,
      name: "5V / 3.3V Power Pins",
      color: "#0284C7",
      top: "88%",
      left: "53%",
      arabicAnswers: [
        "منافذ الطاقه",
        "منافذ 5v و 3.3v",
        "مخارج الجهد",
        "منافذ التغذيه",
        "منافذ الفولت",
        "5v",
        "3.3v",
        "مخرج 5 فولت",
        "مخارج الطاقه",
        "منافذ الباور",
        "5v 3.3v",
      ],
      englishAnswers: [
        "power pins",
        "5v 3.3v",
        "voltage pins",
        "5v pin",
        "3.3v pin",
        "5v",
        "3.3v",
      ],
    },
    {
      id: 6,
      name: "Ground & Vin Pins",
      color: "#7C3AED",
      top: "88%",
      left: "67%",
      arabicAnswers: [
        "الارضي والتغذيه",
        "منافذ gnd",
        "مخرج الارضي",
        "منفذ الارضي",
        "منافذ الارضي",
        "منافذ gnd و vin",
        "gnd",
        "vin",
        "ارضي",
        "الارضي",
        "خط الارضي",
      ],
      englishAnswers: [
        "gnd",
        "vin",
        "ground pins",
        "ground",
        "gnd vin",
        "gnd pin",
      ],
    },
    {
      id: 7,
      name: "Analog Input Pins",
      color: "#E11D48",
      top: "88%",
      left: "81%",
      arabicAnswers: [
        "المنافذ التناظريه",
        "المداخل التناظريه",
        "منافذ الانالوج",
        "مداخل انالوج",
        "منافذ تناظريه",
        "مداخل تناظريه",
        "منافذ a0-a5",
        "انالوج",
        "مداخل التناظريه",
        "المنافذ التماثليه",
        "تماثلي",
        "a0-a5",
      ],
      englishAnswers: [
        "analog in",
        "analog pins",
        "a0-a5",
        "analog input pins",
        "analog",
        "analog input",
      ],
    },
    {
      id: 8,
      name: "ATmega328P Microcontroller",
      color: "#9333EA",
      top: "62%",
      left: "66%",
      arabicAnswers: [
        "المعالج",
        "المتحكم الدقيق",
        "الميكروكنترولر",
        "متحكم دقيق",
        "ميكروكنترولر",
        "متحكم",
        "شريحه المعالج",
        "اي سي",
        "atmega328p",
        "atmega",
        "المتحكم",
        "ايسي",
        "ايسى",
      ],
      englishAnswers: [
        "microcontroller",
        "atmega328p",
        "atmega",
        "mcu",
        "processor",
        "chip",
        "ic",
      ],
    },
    {
      id: 9,
      name: "Digital I/O Pins",
      color: "#D97706",
      top: "14%",
      left: "68%",
      arabicAnswers: [
        "المنافذ الرقميه",
        "المداخل والمخارج الرقميه",
        "منافذ الديجيتال",
        "المداخل الرقميه",
        "المخارج الرقميه",
        "منافذ رقميه",
        "مداخل ديجيتال",
        "منافذ pwm",
        "ديجيتال",
        "منافذ d0-d13",
        "رقميه",
        "d0-d13",
      ],
      englishAnswers: [
        "digital pins",
        "digital i/o pins",
        "pwm pins",
        "digital io",
        "digital",
        "digital input output",
        "d0-d13",
      ],
    },
  ];

  function normalizeText(text) {
    if (!text) return "";
    return text
      .trim()
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // Diacritics & tatweel
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/[.,/#!$%^&*;:{}=\-_`~()\[\]<>?'"\\|]/g, " ") // punctuation to space
      .replace(/\s+/g, " ")
      .trim();
  }

  // Calculate Levenshtein distance for controlled typo tolerance
  function levenshteinDistance(s1, s2) {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = [];

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    return matrix[len1][len2];
  }

  const cardsContainer = document.getElementById("cardsContainer");
  const checkBtn = document.getElementById("checkBtn");
  const resetBtn = document.getElementById("resetBtn");
  const feedbackMsg = document.getElementById("feedbackMsg");

  const i18nTexts = {
    ar: {
      title: "مهمة اليوم",
      instruction: "انظر إلى لوحة Arduino جيدًا، ثم اكتب اسم الجزء الذي يشير إليه كل سهم. حاول بنفسك وتعلّم! ✨",
      placeholder: "اكتب اسم المكون رقم {id}...",
      checkBtn: "تحقق من إجاباتي",
      resetBtn: "إعادة المحاولة",
      perfectScore: "🎉 مبروك يا بطل! أجبت على جميع المكونات بنجاح ({score} / {total})",
      partialScore: "أحسنت المحاولة! نتيجتك: {score} من {total}. راجع المكونات وحاول مجددًا!"
    },
    en: {
      title: "Today's Mission",
      instruction: "Examine the Arduino Uno board carefully, then write the name of the component indicated by each arrow. Give it your best! ✨",
      placeholder: "Enter component #{id} name...",
      checkBtn: "Check My Answers",
      resetBtn: "Try Again",
      perfectScore: "🎉 Fantastic job! You identified all components correctly! ({score} / {total})",
      partialScore: "Good try! Your score: {score} of {total}. Review the parts and try again!"
    }
  };

  function getLang() {
    return (window.I18n && window.I18n.getLang()) || "ar";
  }

  function createCardHTML(comp) {
    const lang = getLang();
    const ph = i18nTexts[lang].placeholder.replace("{id}", comp.id);
    return `
      <div class="component-card" id="card-${comp.id}" style="border-color: ${comp.color}; background-color: ${comp.color}0D;">
        <div class="card-badge" style="background-color: ${comp.color};">${comp.id}</div>
        <div class="card-input-wrapper">
          <input type="text" class="card-input" id="input-${comp.id}" placeholder="${ph}" autocomplete="off">
        </div>
        <span class="status-icon" id="status-${comp.id}"></span>
      </div>
    `;
  }

  function applyLanguage() {
    const lang = getLang();
    const texts = i18nTexts[lang];

    // Direction, Language & Font family exactly like mcq-quiz.js
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);

    const badgeTitle = document.getElementById("quizBadgeTitle");
    const instr = document.getElementById("quizInstructionText");
    const checkTxt = document.getElementById("checkBtnText");
    const resetTxt = document.getElementById("resetBtnText");

    if (badgeTitle) badgeTitle.textContent = texts.title;
    if (instr) instr.textContent = texts.instruction;
    if (checkTxt) checkTxt.textContent = texts.checkBtn;
    if (resetTxt) resetTxt.textContent = texts.resetBtn;

    components.forEach(comp => {
      const input = document.getElementById(`input-${comp.id}`);
      if (input) {
        input.setAttribute("placeholder", texts.placeholder.replace("{id}", comp.id));
      }
    });
  }

  function init() {
    // Render cards sequentially from 1 to 9 (1, 2, 3, 4, 5, 6, 7, 8, 9)
    if (cardsContainer) {
      cardsContainer.innerHTML = components
        .sort((a, b) => a.id - b.id)
        .map(comp => createCardHTML(comp))
        .join("");
    }

    applyLanguage();

    if (window.I18n) {
      window.I18n.onLanguageChange(() => {
        applyLanguage();
      });
    }

    if (window.QuizSDK) {
      window.QuizSDK.onLanguageChange(() => {
        applyLanguage();
      });
    }

    // Attach input listeners
    components.forEach(comp => {
      const input = document.getElementById(`input-${comp.id}`);
      if (input) {
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") checkAnswers();
        });
      }
    });

    if (checkBtn) checkBtn.addEventListener("click", checkAnswers);
    if (resetBtn) resetBtn.addEventListener("click", resetQuiz);
  }

  // State
  let isSubmitted = false;

  function matchAnswer(userVal, allowedAnswers) {
    if (!userVal || userVal.trim().length === 0) return false;
    const normUser = normalizeText(userVal);
    if (normUser.length === 0) return false;

    return allowedAnswers.some(ans => {
      const normTarget = normalizeText(ans);
      
      // 1. Exact match after normalization
      if (normTarget === normUser) return true;

      // 2. Multi-word phrase inclusion (e.g. "زر اعاده ضبط الاردوينو" -> "زر اعاده الضبط")
      if (normTarget.length >= 4 && normUser.includes(normTarget)) return true;
      if (normUser.length >= 4 && normTarget.includes(normUser)) return true;

      // 3. Controlled Levenshtein Typo Tolerance (max distance 1 for 4-6 chars, max 2 for 7+ chars)
      const targetLen = normTarget.length;
      const userLen = normUser.length;
      if (Math.abs(targetLen - userLen) <= 2) {
        const dist = levenshteinDistance(normUser, normTarget);
        if (targetLen >= 4 && targetLen <= 6 && dist <= 1) return true;
        if (targetLen >= 7 && dist <= 2) return true;
      }

      return false;
    });
  }

  function checkAnswers() {
    if (isSubmitted) return;

    const lang = getLang();
    const texts = i18nTexts[lang];
    const total = components.length;

    // Check if at least one question has an answer or if user clicked with completely empty inputs
    let anyAnswered = false;
    components.forEach(comp => {
      const input = document.getElementById(`input-${comp.id}`);
      if (input && input.value.trim().length > 0) {
        anyAnswered = true;
      }
    });

    if (!anyAnswered) {
      const emptyAlert = lang === "ar" ? 
        "يرجى كتابة إجابة واحدة على الأقل قبل التحقق!" : 
        "Please write at least one answer before checking!";
      alert(emptyAlert);
      return;
    }

    let score = 0;
    components.forEach(comp => {
      const input = document.getElementById(`input-${comp.id}`);
      const card = document.getElementById(`card-${comp.id}`);
      const status = document.getElementById(`status-${comp.id}`);
      const rawVal = input ? input.value : "";
      const val = normalizeArabic(rawVal);

      if (card) card.classList.remove("correct", "wrong");

      const isArabicCorrect = matchAnswer(val, comp.arabicAnswers);
      const isEnglishCorrect = matchAnswer(val, comp.englishAnswers);

      if (val.length > 0 && (isArabicCorrect || isEnglishCorrect)) {
        if (card) card.classList.add("correct");
        if (status) status.textContent = "✅";
        score++;
      } else {
        if (card) card.classList.add("wrong");
        if (status) status.textContent = "❌";
      }

      // Disable inputs upon submission
      if (input) input.disabled = true;
    });

    // Mark as submitted
    isSubmitted = true;
    if (checkBtn) {
      checkBtn.disabled = true;
      checkBtn.style.opacity = "0.5";
      checkBtn.style.cursor = "not-allowed";
    }

    if (score === total) {
      const msg = texts.perfectScore.replace("{score}", score).replace("{total}", total);
      feedbackMsg.innerHTML = `<span style="color: #16A34A; font-weight: 900; font-size: 1.2rem;">${msg}</span>`;
    } else {
      const msg = texts.partialScore.replace("{score}", score).replace("{total}", total);
      feedbackMsg.innerHTML = `<span style="color: #EA580C; font-weight: 800; font-size: 1.1rem;">${msg}</span>`;
    }

    // Build answer records containing only quizId, questionId, and studentAnswer
    const answerRecords = components.map(comp => {
      const input = document.getElementById(`input-${comp.id}`);
      const rawVal = input ? input.value : "";
      return {
        quizId: "arduino",
        questionId: comp.id,
        studentAnswer: rawVal.trim()
      };
    });

    // Submit score and student answers to QuizSDK
    if (window.QuizSDK) {
      window.QuizSDK.submitScore({
        score: score,
        maxScore: total,
        metadata: {
          quizId: "arduino",
          answers: answerRecords
        }
      });
    }
  }

  function resetQuiz() {
    isSubmitted = false;
    components.forEach(comp => {
      const input = document.getElementById(`input-${comp.id}`);
      const card = document.getElementById(`card-${comp.id}`);
      const status = document.getElementById(`status-${comp.id}`);
      if (input) {
        input.value = "";
        input.disabled = false;
      }
      if (card) card.classList.remove("correct", "wrong", "highlighted");
      if (status) status.textContent = "";
    });
    if (checkBtn) {
      checkBtn.disabled = false;
      checkBtn.style.opacity = "1";
      checkBtn.style.cursor = "pointer";
    }
    feedbackMsg.innerHTML = "";
  }

  window.addEventListener("DOMContentLoaded", init);
})();