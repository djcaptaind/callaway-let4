
const STORAGE_KEY = "callaway-let4-w2l2-leadership-choice-v1";
let state = {};

try {
  state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
} catch {
  state = {};
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function lessonState() {
  state.lesson02 = state.lesson02 || {};
  return state.lesson02;
}

function showStatus(button, message) {
  const status = button.nextElementSibling;
  if (status && status.classList.contains("status")) {
    status.textContent = message;
  }
}

function saveOne(id, button) {
  const el = document.getElementById(id);
  if (!el) return;
  const value = el.value.trim();
  if (!value) {
    showStatus(button, "Enter a response before saving.");
    return;
  }
  lessonState()[id] = value;
  persist();
  showStatus(button, "Saved on this device.");
  updateProgress();
}

function saveGroup(ids, button) {
  const missing = [];
  ids.forEach(id => {
    const el = document.getElementById(id);
    const value = el?.value.trim() || "";
    if (!value) missing.push(id);
    else lessonState()[id] = value;
  });
  if (missing.length) {
    showStatus(button, "Complete every response in this section before saving.");
    return;
  }
  persist();
  showStatus(button, "Section saved on this device.");
  updateProgress();
}

function restoreResponses() {
  const saved = lessonState();
  document.querySelectorAll("textarea[id]").forEach(el => {
    if (saved[el.id]) el.value = saved[el.id];
  });
  if (saved.challengeSelection) {
    document.querySelectorAll("[data-challenge]").forEach(btn => {
      btn.classList.toggle("selected", btn.dataset.challenge === saved.challengeSelection);
    });
  }
  if (saved.pledge) document.getElementById("pledgeCheck").checked = true;
  if (saved.completed) document.getElementById("completion").classList.add("show");
}

function setupChoices() {
  document.querySelectorAll("[data-choice-group]").forEach(group => {
    group.querySelectorAll(".choice").forEach(btn => {
      btn.addEventListener("click", () => {
        group.querySelectorAll(".choice").forEach(x => x.classList.remove("selected"));
        btn.classList.add("selected");
        const key = group.dataset.choiceGroup;
        lessonState().choices = lessonState().choices || {};
        lessonState().choices[key] = btn.textContent.trim();
        group.parentElement.querySelector(".reveal")?.classList.add("show");
        persist();
        updateProgress();
      });
    });
  });

  document.querySelectorAll("[data-challenge]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-challenge]").forEach(x => x.classList.remove("selected"));
      btn.classList.add("selected");
      lessonState().challengeSelection = btn.dataset.challenge;
      const plan = document.getElementById("challengePlan");
      if (plan && !plan.value.trim()) plan.value = btn.dataset.challenge + " My plan: ";
      persist();
      updateProgress();
    });
  });
}

function setupNavigation() {
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.scroll)?.scrollIntoView({behavior:"smooth"});
    });
  });

  const navButtons = [...document.querySelectorAll(".lesson-nav button[data-scroll]")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.scroll === entry.target.id));
      }
    });
  }, {rootMargin:"-35% 0px -55%"});
  sections.forEach(section => observer.observe(section));
}

function updateProgress() {
  const s = lessonState();
  let points = 5;
  const choices = Object.keys(s.choices || {}).length;
  points += choices * 8;

  const responseGroups = [
    ["videoResponse"],
    ["s1facts","s1values","s1action","s1second"],
    ["s2immediate","s2boundary","s2choice","s2tradeoff"],
    ["s3protect","s3account","s3response","s3trust"],
    ["courtRuling","courtOpposition","courtSafeguards"],
    ["journalEntry"],
    ["challengePlan"]
  ];

  responseGroups.forEach(group => {
    if (group.every(id => Boolean(s[id]))) points += 9;
  });

  if (s.challengeSelection) points += 4;
  if (s.pledge) points += 4;
  if (s.completed) points = 100;

  const pct = Math.min(100, points);
  const bar = document.querySelector("#lessonProgress i");
  if (bar) bar.style.width = pct + "%";
  const text = document.getElementById("lessonPct");
  if (text) text.textContent = pct + "%";
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupChoices();
  restoreResponses();
  updateProgress();

  document.querySelectorAll("[data-save]").forEach(btn => {
    btn.addEventListener("click", () => saveOne(btn.dataset.save, btn));
  });

  document.querySelectorAll("[data-save-group]").forEach(btn => {
    btn.addEventListener("click", () => saveGroup(btn.dataset.saveGroup.split(","), btn));
  });

  document.getElementById("instructorToggle")?.addEventListener("click", () => {
    document.body.classList.toggle("instructor");
  });

  document.getElementById("pledgeCheck")?.addEventListener("change", event => {
    lessonState().pledge = event.target.checked;
    persist();
    updateProgress();
  });

  document.getElementById("completeLesson")?.addEventListener("click", () => {
    const s = lessonState();
    const required = [
      "videoResponse",
      "s1facts","s1values","s1action","s1second",
      "s2immediate","s2boundary","s2choice","s2tradeoff",
      "s3protect","s3account","s3response","s3trust",
      "courtRuling","courtOpposition","courtSafeguards",
      "journalEntry","challengePlan"
    ];
    const missing = required.filter(id => !s[id]);
    const missingChoices = ["scenario1","scenario2","scenario3"].filter(id => !(s.choices || {})[id]);

    if (missing.length || missingChoices.length || !s.challengeSelection || !s.pledge) {
      alert("Complete and save all three LET 4 decision analyses, the executive recommendation, reflection, action challenge, and leadership pledge before finishing.");
      return;
    }

    s.completed = true;
    persist();
    document.getElementById("completion").classList.add("show");
    document.getElementById("completion").scrollIntoView({behavior:"smooth", block:"center"});
    updateProgress();
  });
});
