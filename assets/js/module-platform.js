
function scenarioFeedback(kind){
  const box=document.getElementById('scenario-feedback');
  box.className='feedback '+(kind==='good'?'good':'try');
  box.textContent=kind==='good'
    ? 'Strong choice. You showed initiative, responsibility, and respect for the learning environment.'
    : 'This response misses an opportunity to lead. Effective leaders act responsibly even before they are given a title.';
}
function gradeCheck(){
  const key={q1:'b',q2:'c',q3:'a'};
  let score=0;
  Object.entries(key).forEach(([name,correct])=>{
    const answer=document.querySelector(`input[name="${name}"]:checked`);
    if(answer && answer.value===correct) score++;
  });
  document.getElementById('check-result').textContent=
    `Score: ${score}/3. ${score===3?'Excellent work.':'Review the lesson, then try again.'}`;
}
function saveReflection(){
  const field=document.getElementById('reflection');
  const status=document.getElementById('reflection-status');
  if(!field.value.trim()){
    status.textContent='Enter a response before saving.';
    return;
  }
  localStorage.setItem('callaway_week1_lesson1_reflection',field.value);
  status.textContent='Saved on this device. Submit the graded response in Canvas.';
}
document.addEventListener('DOMContentLoaded',()=>{
  const field=document.getElementById('reflection');
  if(field) field.value=localStorage.getItem('callaway_week1_lesson1_reflection')||'';
});
