const CONFIG = {
  mission: {code:"MISSION 00", title:"Report for Duty", progress:40},
  readiness:92,
  announcements:[
    "Review the newest Canvas announcement before class",
    "Complete the next unlocked Mission 00 requirement",
    "Team leaders: verify accountability and equipment",
    "Uniform inspection Tuesday and Wednesday"
  ]
};
function setText(id,v){const e=document.getElementById(id);if(e)e.textContent=v}
function initTicker(){
  const t=document.getElementById("ticker-track");
  if(t)t.innerHTML=[...CONFIG.announcements,...CONFIG.announcements].map(x=>`<span>${x}</span>`).join("");
}
document.addEventListener("DOMContentLoaded",()=>{
  initTicker();
  setText("mission-code",CONFIG.mission.code);
  setText("mission-title",CONFIG.mission.title);
  setText("mission-progress",`${CONFIG.mission.progress}%`);
  const p=document.getElementById("mission-bar");if(p)p.style.width=`${CONFIG.mission.progress}%`;
  setText("ready-value",`${CONFIG.readiness}%`);
  const b=document.querySelector(".menu-btn"),n=document.querySelector(".navlinks");
  if(b&&n)b.addEventListener("click",()=>n.classList.toggle("open"));
});


function animateCounters(){
  const counters = document.querySelectorAll(".counter");
  counters.forEach(counter => {
    const target = Number(counter.dataset.target || counter.textContent);
    if (!Number.isFinite(target)) return;
    const duration = 900;
    const start = performance.now();
    function tick(now){
      const progress = Math.min(1, (now - start) / duration);
      counter.textContent = Math.floor(progress * target);
      if(progress < 1) requestAnimationFrame(tick);
      else counter.textContent = target;
    }
    requestAnimationFrame(tick);
  });
}
document.addEventListener("DOMContentLoaded", animateCounters);

function updateSchoolCountdown(){
  const event = {
    name: "Adventure Training Unit",
    target: "2026-09-19T08:00:00-05:00",
    display: "19 SEPTEMBER 2026",
    status: "Prepare for Adventure Training Unit."
  };

  const target = new Date(event.target).getTime();
  const now = Date.now();
  const distance = target - now;

  const nameEl = document.getElementById("event-name");
  const dateEl = document.getElementById("event-display-date");
  const statusEl = document.getElementById("event-status-text");
  if(nameEl) nameEl.textContent = event.name.toUpperCase();
  if(dateEl) dateEl.textContent = event.display;
  if(statusEl) statusEl.textContent = event.status;

  const daysEl = document.getElementById("school-days");
  const hoursEl = document.getElementById("school-hours");
  const minutesEl = document.getElementById("school-minutes");

  if(distance <= 0){
    if(daysEl) daysEl.textContent = "00";
    if(hoursEl) hoursEl.textContent = "00";
    if(minutesEl) minutesEl.textContent = "00";
    if(statusEl) statusEl.textContent = "Event day — execute the mission.";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);

  if(daysEl) daysEl.textContent = String(days).padStart(2, "0");
  if(hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if(minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
}
document.addEventListener("DOMContentLoaded",()=>{updateSchoolCountdown();setInterval(updateSchoolCountdown,60000);});


function initializeCommandersChallenge(){
  const button = document.getElementById("challenge-complete");
  if(!button) return;
  const key = "callaway-let3-commanders-challenge-week1";
  if(localStorage.getItem(key) === "complete"){
    button.classList.add("completed");
    button.textContent = "CHALLENGE COMPLETE";
  }
  button.addEventListener("click", () => {
    const completed = !button.classList.contains("completed");
    button.classList.toggle("completed", completed);
    button.textContent = completed ? "CHALLENGE COMPLETE" : "MARK COMPLETE";
    localStorage.setItem(key, completed ? "complete" : "incomplete");
  });
}
document.addEventListener("DOMContentLoaded", initializeCommandersChallenge);
