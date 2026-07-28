(() => {
  const STORAGE_KEY = "callaway-let4-week2-lesson1-v1";
  const sectionIds = ["opening","leadership","myths","video","choices","compass","challenge","reflection","action","complete"];
  const requiredSections = ["leadership","myths","video","choices","compass","challenge","reflection","action"];

  const defaultState = {
    currentSection: "opening",
    completed: [],
    mythsOpened: [],
    scenarios: {},
    responses: {
      videoQ1: "", videoQ2: "", videoQ3: "",
      challengeChoice: "", challengeWhy: "", challengeWords: "",
      journalText: "", selectedAction: "", actionWhen: ""
    },
    compass: {
      integrity: 3, respect: 3, courage: 3,
      responsibility: 3, service: 3, discipline: 3
    }
  };

  let state = loadState();

  const $ = (id) => document.getElementById(id);
  const toast = $("toast");

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved ? mergeDeep(defaultState, saved) : structuredClone(defaultState);
    } catch {
      return structuredClone(defaultState);
    }
  }

  function mergeDeep(base, incoming) {
    const out = structuredClone(base);
    for (const [key, value] of Object.entries(incoming || {})) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        out[key] = { ...(out[key] || {}), ...value };
      } else {
        out[key] = value;
      }
    }
    return out;
  }

  function saveState(message) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateProgress();
    if (message) showToast(message);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function showSection(id) {
    if (!sectionIds.includes(id)) return;
    document.querySelectorAll(".lesson-section").forEach(section => section.classList.toggle("active", section.id === id));
    document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.target === id));
    state.currentSection = id;
    saveState();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id === "complete") renderCompletion();
  }

  function markComplete(id, message) {
    if (!state.completed.includes(id)) state.completed.push(id);
    saveState(message || "Section complete.");
  }

  function updateProgress() {
    const completeCount = requiredSections.filter(id => state.completed.includes(id)).length;
    const percent = Math.round((completeCount / requiredSections.length) * 100);
    $("progressFill").style.width = `${percent}%`;
    $("progressText").textContent = `${percent}%`;
    $("finalProgress").textContent = `${percent}%`;

    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.classList.toggle("complete", state.completed.includes(btn.dataset.target));
    });

    $("completionMessage").textContent = percent === 100
      ? "Lesson complete. Your leadership choices, reflection, and commitment have been saved on this device."
      : `Complete ${requiredSections.length - completeCount} remaining section${requiredSections.length - completeCount === 1 ? "" : "s"} to finish the lesson.`;
  }

  document.querySelectorAll(".nav-item").forEach(btn => btn.addEventListener("click", () => showSection(btn.dataset.target)));
  document.querySelectorAll("[data-next]").forEach(btn => btn.addEventListener("click", () => showSection(btn.dataset.next)));

  document.querySelectorAll("[data-complete]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.complete;
      markComplete(id, "Leadership section complete.");
      btn.textContent = "Section Complete ✓";
      btn.classList.add("done");
    });
  });

  const mythCards = [...document.querySelectorAll(".flip-card")];
  mythCards.forEach((card, index) => {
    if (state.mythsOpened.includes(index)) card.classList.add("flipped");
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
      if (!state.mythsOpened.includes(index)) state.mythsOpened.push(index);
      const count = state.mythsOpened.length;
      $("mythStatus").textContent = `${count} of 6 leadership realities revealed.`;
      if (count === 6) {
        $("mythStatus").textContent = "All leadership realities revealed. Section complete.";
        $("mythStatus").classList.add("success");
        markComplete("myths");
      } else saveState();
    });
  });

  ["videoQ1","videoQ2","videoQ3","challengeWhy","challengeWords","journalText","actionWhen"].forEach(id => {
    const el = $(id);
    if (!el) return;
    el.value = state.responses[id] || "";
    el.addEventListener("input", () => {
      state.responses[id] = el.value;
      saveState();
      if (id === "journalText") updateWordCount();
    });
  });

  document.querySelector("[data-check='video']").addEventListener("click", () => {
    const values = ["videoQ1","videoQ2","videoQ3"].map(id => $(id).value.trim());
    if (values.some(value => value.length < 15)) {
      $("videoStatus").textContent = "Add a thoughtful response to all three questions before saving.";
      $("videoStatus").className = "status-message warning";
      return;
    }
    values.forEach((value, i) => state.responses[`videoQ${i+1}`] = value);
    markComplete("video", "Video analysis saved.");
    $("videoStatus").textContent = "Analysis saved. Section complete.";
    $("videoStatus").className = "status-message success";
  });

  document.querySelectorAll(".scenario-card").forEach(card => {
    const number = card.dataset.scenario;
    const buttons = [...card.querySelectorAll(".choice-list button")];
    const feedback = card.querySelector(".choice-feedback");

    if (state.scenarios[number] !== undefined) {
      const selected = buttons[state.scenarios[number]];
      if (selected) {
        selected.classList.add("selected");
        feedback.textContent = selected.dataset.feedback;
        feedback.classList.add("show");
      }
    }

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        feedback.textContent = button.dataset.feedback;
        feedback.classList.add("show");
        state.scenarios[number] = index;
        const count = Object.keys(state.scenarios).length;
        $("scenarioStatus").textContent = `${count} of 5 scenarios complete.`;
        if (count === 5) {
          $("scenarioStatus").textContent = "All five scenarios complete.";
          $("scenarioStatus").className = "status-message success";
          markComplete("choices", "Everyday leadership scenarios complete.");
        } else saveState();
      });
    });
  });

  const compassIds = ["integrity","respect","courage","responsibility","service","discipline"];
  compassIds.forEach(id => {
    const input = $(id);
    input.value = state.compass[id] ?? 3;
    $(`${id}Value`).textContent = input.value;
    input.addEventListener("input", () => {
      state.compass[id] = Number(input.value);
      $(`${id}Value`).textContent = input.value;
      renderCompass();
      saveState();
    });
  });

  function renderCompass() {
    const labels = {
      integrity: "Integrity",
      respect: "Respect",
      courage: "Courage",
      responsibility: "Responsibility",
      service: "Selfless Service",
      discipline: "Discipline"
    };
    const values = compassIds.map(id => Number(state.compass[id]));
    const total = values.reduce((a,b) => a+b, 0);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const maxIds = compassIds.filter((id,i) => values[i] === max);
    const minIds = compassIds.filter((id,i) => values[i] === min);
    const strength = maxIds.length === compassIds.length ? "Balanced" : maxIds.map(id => labels[id]).join(", ");
    const growth = minIds.length === compassIds.length ? "Balanced" : minIds.map(id => labels[id]).join(", ");

    $("compassScore").textContent = total;
    $("finalCompass").textContent = `${total}/30`;
    $("strengthValue").textContent = strength;
    $("growthValue").textContent = growth;

    let title = "Developing Leader";
    let feedback = "You have a growing foundation. Focus on one value and practice it intentionally this week.";
    if (total >= 26) {
      title = "Consistent Leader";
      feedback = "Your ratings show strong leadership habits. Continue testing those habits when situations become difficult.";
    } else if (total >= 21) {
      title = "Emerging Leader";
      feedback = "You demonstrate several leadership strengths. Strengthen your lowest area through deliberate practice.";
    } else if (total <= 14) {
      title = "Leadership Starting Point";
      feedback = "This is a starting point, not a label. Select one value and make a specific plan to improve it.";
    }
    $("compassTitle").textContent = title;
    $("compassFeedback").textContent = feedback;
    const degree = Math.round((total / 30) * 360);
    document.querySelector(".score-ring").style.background =
      `conic-gradient(var(--orange) ${degree}deg, rgba(255,255,255,.08) 0)`;
  }

  $("saveCompass").addEventListener("click", () => {
    markComplete("compass", "Leadership Compass saved.");
    $("compassStatus").textContent = "Compass saved. Section complete.";
    $("compassStatus").className = "status-message success";
  });

  document.querySelectorAll('input[name="challengeChoice"]').forEach(input => {
    if (input.value === state.responses.challengeChoice) input.checked = true;
    input.addEventListener("change", () => {
      state.responses.challengeChoice = input.value;
      saveState();
    });
  });

  $("submitChallenge").addEventListener("click", () => {
    const choice = document.querySelector('input[name="challengeChoice"]:checked')?.value || "";
    const why = $("challengeWhy").value.trim();
    const words = $("challengeWords").value.trim();
    const feedback = $("challengeFeedback");

    if (!choice || why.length < 25 || words.length < 15) {
      feedback.textContent = "Select a response and provide thoughtful answers to both written prompts.";
      feedback.className = "challenge-feedback show developing";
      return;
    }

    state.responses.challengeChoice = choice;
    state.responses.challengeWhy = why;
    state.responses.challengeWords = words;

    if (choice === "B") {
      feedback.innerHTML = "<strong>Strong leadership response.</strong> You selected a leader-centered response that combines direct communication, clear ownership, standards, and a defined follow-up point. The next requirement is to monitor execution, support the responsible cadets, and verify that the team recovers.";
      feedback.className = "challenge-feedback show strong";
    } else {
      feedback.innerHTML = "<strong>Leadership growth opportunity.</strong> Your response may address part of the immediate problem, but a senior leader must also communicate the standard, assign ownership, anticipate consequences, develop the responsible cadets, and verify execution.";
      feedback.className = "challenge-feedback show developing";
    }
    markComplete("challenge", "Leadership Challenge submitted.");
  });

  function updateWordCount() {
    const text = $("journalText").value.trim();
    const count = text ? text.split(/\s+/).length : 0;
    $("wordCount").textContent = `${count} word${count === 1 ? "" : "s"}`;
    $("finalWords").textContent = count;
  }

  $("saveJournal").addEventListener("click", () => {
    const text = $("journalText").value.trim();
    const count = text ? text.split(/\s+/).length : 0;
    if (count < 60) {
      $("journalStatus").textContent = "Continue your reflection. Write at least 60 words before marking this section complete.";
      $("journalStatus").className = "status-message warning";
      return;
    }
    state.responses.journalText = text;
    markComplete("reflection", "Leadership reflection saved.");
    $("journalStatus").textContent = "Reflection saved. Section complete.";
    $("journalStatus").className = "status-message success";
  });

  document.querySelectorAll(".action-card").forEach(card => {
    if (card.dataset.action === state.responses.selectedAction) card.classList.add("selected");
    card.addEventListener("click", () => {
      document.querySelectorAll(".action-card").forEach(item => item.classList.remove("selected"));
      card.classList.add("selected");
      state.responses.selectedAction = card.dataset.action;
      $("selectedAction").textContent = card.dataset.action;
      saveState();
    });
  });

  $("saveAction").addEventListener("click", () => {
    const when = $("actionWhen").value.trim();
    if (!state.responses.selectedAction || when.length < 4) {
      $("actionStatus").textContent = "Select one action and identify when you will complete it.";
      $("actionStatus").className = "status-message warning";
      return;
    }
    state.responses.actionWhen = when;
    markComplete("action", "Leadership commitment saved.");
    $("actionStatus").textContent = "Commitment saved. Section complete.";
    $("actionStatus").className = "status-message success";
  });

  function renderCompletion() {
    updateProgress();
    updateWordCount();
    renderCompass();
    const labels = {
      leadership: "Leadership foundation",
      myths: "Myth or Reality",
      video: "Video analysis",
      choices: "Everyday choices",
      compass: "Leadership Compass",
      challenge: "Leadership Challenge",
      reflection: "Reflection journal",
      action: "Leadership in Action"
    };
    $("completionChecklist").innerHTML = requiredSections.map(id => {
      const done = state.completed.includes(id);
      return `<div class="check-item ${done ? "done" : ""}">${done ? "✓" : "○"} ${labels[id]}</div>`;
    }).join("");
  }

  $("instructorBtn").addEventListener("click", () => {
    $("instructorPanel").classList.toggle("hidden");
    showToast($("instructorPanel").classList.contains("hidden") ? "Instructor Mode hidden." : "Instructor Mode visible.");
  });

  $("resetBtn").addEventListener("click", () => {
    const confirmed = window.confirm("Reset all saved Lesson 1 progress on this device?");
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });

  $("printSummary").addEventListener("click", () => window.print());

  if (state.responses.selectedAction) $("selectedAction").textContent = state.responses.selectedAction;

  const leadershipBtn = document.querySelector("[data-complete='leadership']");
  if (state.completed.includes("leadership")) {
    leadershipBtn.textContent = "Section Complete ✓";
    leadershipBtn.classList.add("done");
  }

  $("mythStatus").textContent = `${state.mythsOpened.length} of 6 leadership realities revealed.`;
  if (state.mythsOpened.length === 6) {
    $("mythStatus").textContent = "All leadership realities revealed. Section complete.";
    $("mythStatus").classList.add("success");
  }

  const scenarioCount = Object.keys(state.scenarios).length;
  $("scenarioStatus").textContent = scenarioCount === 5 ? "All five scenarios complete." : `${scenarioCount} of 5 scenarios complete.`;
  if (scenarioCount === 5) $("scenarioStatus").classList.add("success");

  renderCompass();
  updateWordCount();
  updateProgress();
  showSection(state.currentSection || "opening");
})();