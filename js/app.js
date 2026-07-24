(function () {
  "use strict";

  var progress = {
    completedChapters: []
  };
  var WRONG_ANSWER_DELAY_MS = 2000;
  var CORRECT_ANSWER_DELAY_MS = 4000;

  function normalizeAnswer(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getConfig() {
    if (typeof GAME_CONFIG === "undefined") {
      return null;
    }

    return GAME_CONFIG;
  }

  function getInitialProgress() {
    return {
      completedChapters: []
    };
  }

  function loadProgress() {
    var config = getConfig();

    if (!config) {
      return getInitialProgress();
    }

    try {
      var saved = window.localStorage.getItem(config.storageKey);

      if (!saved) {
        return getInitialProgress();
      }

      var parsed = JSON.parse(saved);

      if (!parsed || !Array.isArray(parsed.completedChapters)) {
        return getInitialProgress();
      }

      return {
        completedChapters: parsed.completedChapters.filter(function (chapterId) {
          return typeof chapterId === "string";
        })
      };
    } catch (error) {
      return getInitialProgress();
    }
  }

  function saveProgress() {
    var config = getConfig();

    if (!config) {
      return false;
    }

    try {
      window.localStorage.setItem(config.storageKey, JSON.stringify(progress));
      return true;
    } catch (error) {
      return false;
    }
  }

  function resetProgress() {
    var config = getConfig();

    progress = getInitialProgress();

    if (config) {
      try {
        window.localStorage.removeItem(config.storageKey);
      } catch (error) {
        // localStorage may be unavailable; the in-memory reset still works.
      }
    }

    renderState();
  }

  function getSortedChapters() {
    var config = getConfig();

    if (!config || !Array.isArray(config.chapters)) {
      return [];
    }

    return config.chapters.slice().sort(function (a, b) {
      return a.order - b.order;
    });
  }

  function isChapterCompleted(chapterId) {
    return progress.completedChapters.indexOf(chapterId) !== -1;
  }

  function getChapterIndex(chapterId) {
    return getSortedChapters().findIndex(function (chapter) {
      return chapter.id === chapterId;
    });
  }

  function isChapterUnlocked(chapterId) {
    var chapters = getSortedChapters();
    var chapterIndex = getChapterIndex(chapterId);

    if (chapterIndex === -1) {
      return false;
    }

    if (chapterIndex === 0) {
      return true;
    }

    return isChapterCompleted(chapters[chapterIndex - 1].id);
  }

  function validateAnswer(chapter, answer) {
    var possiblePasswords = Array.isArray(chapter.passwords)
      ? chapter.passwords
      : [chapter.password || ""];
    var normalizedAnswer = normalizeAnswer(answer);

    return possiblePasswords.some(function (password) {
      return normalizeAnswer(password) === normalizedAnswer;
    });
  }

  function completeChapter(chapterId) {
    if (!isChapterCompleted(chapterId)) {
      progress.completedChapters.push(chapterId);
    }

    saveProgress();
    renderState();
    scrollToRevealedReward(chapterId);
  }

  function getChapterState(chapter) {
    if (isChapterCompleted(chapter.id)) {
      return "completed";
    }

    if (isChapterUnlocked(chapter.id)) {
      return "available";
    }

    return "locked";
  }

  function renderProgress() {
    var chapters = getSortedChapters();
    var completedCount = chapters.filter(function (chapter) {
      return isChapterCompleted(chapter.id);
    }).length;
    var total = chapters.length;
    var percent = total > 0 ? (completedCount / total) * 100 : 0;
    var progressText = document.getElementById("progress-text");
    var progressbar = document.getElementById("progressbar");
    var progressbarFill = document.getElementById("progressbar-fill");

    if (progressText) {
      progressText.textContent =
        completedCount + " de " + total + " capítulos completados";
    }

    if (progressbar) {
      progressbar.setAttribute("aria-valuemax", String(total));
      progressbar.setAttribute("aria-valuenow", String(completedCount));
    }

    if (progressbarFill) {
      progressbarFill.style.width = percent + "%";
    }
  }

  function renderAdventureText() {
    var config = getConfig();
    var title = document.getElementById("adventure-title");
    var subtitle = document.getElementById("adventure-subtitle");

    if (!config) {
      return;
    }

    document.title = config.adventure.title;

    if (title) {
      title.textContent = config.adventure.title;
    }

    if (subtitle) {
      subtitle.textContent = config.adventure.subtitle;
    }
  }

  function createStatusBadge(state) {
    var labels = {
      locked: "Bloqueado",
      available: "Disponible",
      completed: "Completado"
    };
    var icons = {
      locked: "⌁",
      available: "◆",
      completed: "✓"
    };

    return (
      '<span class="status-badge status-' +
      state +
      '"><span aria-hidden="true">' +
      icons[state] +
      '</span> ' +
      labels[state] +
      "</span>"
    );
  }

  function renderLockedChapter(chapter) {
    return (
      '<article id="' +
      chapter.id +
      '" class="chapter-card chapter-locked" data-chapter-id="' +
      chapter.id +
      '">' +
      '<div class="chapter-topline">' +
      createStatusBadge("locked") +
      '<span class="chapter-number">Capítulo ' +
      chapter.order +
      "</span>" +
      "</div>" +
      '<h3><span class="lock-icon" aria-hidden="true">☽</span> ' +
      chapter.title +
      "</h3>" +
      "<p>Antes debes completar el capítulo anterior. La siguiente parte se abrirá sola cuando llegue su momento.</p>" +
      "</article>"
    );
  }

  function renderAvailableChapter(chapter) {
    return (
      '<article id="' +
      chapter.id +
      '" class="chapter-card chapter-available" data-chapter-id="' +
      chapter.id +
      '">' +
      '<div class="chapter-topline">' +
      createStatusBadge("available") +
      '<span class="chapter-number">Capítulo ' +
      chapter.order +
      "</span>" +
      "</div>" +
      "<h3>" +
      chapter.title +
      "</h3>" +
      "<p>" +
      chapter.description +
      "</p>" +
      '<form class="answer-form" data-chapter-id="' +
      chapter.id +
      '" novalidate>' +
      '<label for="answer-' +
      chapter.id +
      '">Contraseña</label>' +
      '<div class="answer-row">' +
      '<input id="answer-' +
      chapter.id +
      '" name="answer" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" inputmode="text" required>' +
      '<button class="button" type="submit">Comprobar</button>' +
      "</div>" +
      '<p id="message-' +
      chapter.id +
      '" class="form-message" aria-live="polite"></p>' +
      '<div class="checking-meter" role="progressbar" aria-label="Progreso de comprobación" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-hidden="true">' +
      '<span class="checking-meter-fill"></span>' +
      "</div>" +
      "</form>" +
      "</article>"
    );
  }

  function renderCompletedChapter(chapter) {
    return (
      '<article id="' +
      chapter.id +
      '" class="chapter-card chapter-completed" data-chapter-id="' +
      chapter.id +
      '">' +
      '<div class="chapter-topline">' +
      createStatusBadge("completed") +
      '<span class="chapter-number">Capítulo ' +
      chapter.order +
      "</span>" +
      "</div>" +
      "<h3>" +
      chapter.title +
      "</h3>" +
      '<p class="success-copy">' +
      chapter.successMessage +
      "</p>" +
      '<div class="reward-block">' +
      '<p class="reward-label">' +
      chapter.rewardLabel +
      "</p>" +
      chapter.rewardHtml +
      "</div>" +
      '<p class="next-hint">' +
      chapter.nextHint +
      "</p>" +
      "</article>"
    );
  }

  function renderChapters() {
    var chaptersList = document.getElementById("chapters-list");

    if (!chaptersList) {
      return;
    }

    chaptersList.innerHTML = getSortedChapters()
      .map(function (chapter) {
        var state = getChapterState(chapter);

        if (state === "completed") {
          return renderCompletedChapter(chapter);
        }

        if (state === "available") {
          return renderAvailableChapter(chapter);
        }

        return renderLockedChapter(chapter);
      })
      .join("");
  }

  function showMessage(chapterId, text, type) {
    var message = document.getElementById("message-" + chapterId);
    var chapterCard = document.getElementById(chapterId);

    if (!message) {
      return;
    }

    message.textContent = text;
    message.className = "form-message message-" + type;

    if (type === "error" && chapterCard) {
      chapterCard.classList.remove("shake");
      window.requestAnimationFrame(function () {
        chapterCard.classList.add("shake");
      });
    }
  }

  function setCheckingProgress(form, percent) {
    var meter = form.querySelector(".checking-meter");
    var fill = form.querySelector(".checking-meter-fill");
    var safePercent = Math.max(0, Math.min(100, percent));

    if (!meter || !fill) {
      return;
    }

    fill.style.width = safePercent + "%";
    meter.setAttribute("aria-valuenow", String(Math.round(safePercent)));
  }

  function startCheckingProgress(form, duration) {
    var meter = form.querySelector(".checking-meter");
    var timeouts = [];
    var steps = [
      { part: 0.08, percent: 12 },
      { part: 0.18, percent: 27 },
      { part: 0.37, percent: 43 },
      { part: 0.51, percent: 61 },
      { part: 0.74, percent: 78 },
      { part: 0.9, percent: 92 }
    ];

    if (!meter) {
      return function () {};
    }

    form.classList.add("is-checking");
    meter.setAttribute("aria-hidden", "false");
    setCheckingProgress(form, 0);

    steps.forEach(function (step) {
      timeouts.push(
        window.setTimeout(function () {
          setCheckingProgress(form, step.percent);
        }, Math.round(duration * step.part))
      );
    });

    return function (finalPercent) {
      timeouts.forEach(function (timeoutId) {
        window.clearTimeout(timeoutId);
      });

      setCheckingProgress(form, finalPercent);
    };
  }

  function stopCheckingProgress(form) {
    var meter = form.querySelector(".checking-meter");

    form.classList.remove("is-checking");
    setCheckingProgress(form, 0);

    if (meter) {
      meter.setAttribute("aria-hidden", "true");
    }
  }

  function scrollToRevealedReward(completedChapterId) {
    var completedChapter = document.getElementById(completedChapterId);
    var target = completedChapter
      ? completedChapter.querySelector(".reward-block") || completedChapter
      : null;

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      target.setAttribute("tabindex", "-1");
      target.focus({
        preventScroll: true
      });
    }
  }

  function handleSubmit(event) {
    var form = event.target.closest(".answer-form");

    if (!form) {
      return;
    }

    event.preventDefault();

    var chapterId = form.getAttribute("data-chapter-id");
    var chapter = getSortedChapters().find(function (item) {
      return item.id === chapterId;
    });
    var submitButton = form.querySelector('button[type="submit"]');
    var input = form.querySelector('input[name="answer"]');

    if (form.dataset.busy === "true") {
      return;
    }

    form.dataset.busy = "true";

    if (!chapter || !input || !isChapterUnlocked(chapterId)) {
      showMessage(chapterId, "Este capítulo todavía no está disponible.", "error");
      form.dataset.busy = "false";
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    showMessage(chapterId, "Comprobando la contraseña...", "checking");

    if (validateAnswer(chapter, input.value)) {
      var finishCorrectProgress = startCheckingProgress(form, CORRECT_ANSWER_DELAY_MS);

      window.setTimeout(function () {
        finishCorrectProgress(100);
        showMessage(chapterId, "Respuesta correcta. Guardando el progreso...", "success");
        completeChapter(chapterId);
      }, CORRECT_ANSWER_DELAY_MS);
    } else {
      var finishWrongProgress = startCheckingProgress(form, WRONG_ANSWER_DELAY_MS);

      window.setTimeout(function () {
        finishWrongProgress(100);
        showMessage(
        chapterId,
        "Todavía no es esa. Revisa las pistas y vuelve a intentarlo.",
        "error"
        );

        if (submitButton) {
          submitButton.disabled = false;
        }

        form.dataset.busy = "false";
        stopCheckingProgress(form);
      }, WRONG_ANSWER_DELAY_MS);
    }
  }

  function handleResetClick() {
    var confirmed = window.confirm(
      "Se borrará todo el progreso guardado en este teléfono. ¿Quieres reiniciar la aventura?"
    );

    if (!confirmed) {
      return;
    }

    resetProgress();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function setupBackButtons() {
    var backButtons = document.querySelectorAll(".js-back-button");

    backButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = "../index.html";
        }
      });
    });
  }

  function renderState() {
    renderAdventureText();
    renderProgress();
    renderChapters();
  }

  function initMainPage() {
    var chaptersList = document.getElementById("chapters-list");
    var resetButton = document.getElementById("reset-button");

    if (!chaptersList) {
      return;
    }

    progress = loadProgress();
    renderState();
    chaptersList.addEventListener("submit", handleSubmit);

    if (resetButton) {
      resetButton.addEventListener("click", handleResetClick);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupBackButtons();
    initMainPage();
  });
})();
