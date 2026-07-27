
const EVENT = {
  name: "Adventure Training Unit",
  target: "2026-09-19T08:00:00-05:00",
  display: "19 September 2026"
};

function updateEventCountdown(){
  const target = new Date(EVENT.target).getTime();
  const distance = target - Date.now();

  const name = document.getElementById("event-name");
  const date = document.getElementById("event-date");
  const days = document.getElementById("event-days");
  const hours = document.getElementById("event-hours");
  const minutes = document.getElementById("event-minutes");
  const seconds = document.getElementById("event-seconds");

  if(name) name.textContent = EVENT.name;
  if(date) date.textContent = EVENT.display;

  if(distance <= 0){
    if(days) days.textContent = "00";
    if(hours) hours.textContent = "00";
    if(minutes) minutes.textContent = "00";
    if(seconds) seconds.textContent = "00";
    return;
  }

  const d = Math.floor(distance / 86400000);
  const h = Math.floor((distance % 86400000) / 3600000);
  const m = Math.floor((distance % 3600000) / 60000);
  const s = Math.floor((distance % 60000) / 1000);

  if(days) days.textContent = String(d).padStart(2,"0");
  if(hours) hours.textContent = String(h).padStart(2,"0");
  if(minutes) minutes.textContent = String(m).padStart(2,"0");
  if(seconds) seconds.textContent = String(s).padStart(2,"0");
}

function initializeMenu(){
  const button = document.getElementById("menu-button");
  const nav = document.getElementById("main-nav");
  if(!button || !nav) return;

  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeMenu();
  updateEventCountdown();
  setInterval(updateEventCountdown, 1000);
});
