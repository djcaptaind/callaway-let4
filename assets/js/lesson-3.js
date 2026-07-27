const profileScores={organizer:0,supporter:0,example:0};
let answeredProfileQuestions=0;

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-profile-question]').forEach(question=>{
    question.querySelectorAll('.profile-choice').forEach(button=>{
      button.addEventListener('click',()=>{
        if(question.dataset.answered==='true') return;
        question.dataset.answered='true';
        answeredProfileQuestions++;
        profileScores[button.dataset.style]++;
        question.querySelectorAll('.profile-choice').forEach(choice=>choice.disabled=true);
        button.style.fontWeight='900';
        updateProfileResult();
      });
    });
  });

  const reflection=document.getElementById('lesson3-reflection');
  if(reflection) reflection.value=localStorage.getItem('callaway_week1_lesson3_reflection')||'';
});

function updateProfileResult(){
  const result=document.getElementById('profile-result');
  if(answeredProfileQuestions<3){
    result.textContent=`Completed ${answeredProfileQuestions} of 3 profile questions.`;
    return;
  }
  const topStyle=Object.entries(profileScores).sort((a,b)=>b[1]-a[1])[0][0];
  const descriptions={
    organizer:'Organizer: You tend to lead by creating structure, clarifying tasks, and helping the group move forward.',
    supporter:'Supporter: You tend to lead by encouraging others, building inclusion, and helping teammates recover.',
    example:'Example Setter: You tend to lead through dependable action, focus, and personal example.'
  };
  result.textContent=`${descriptions[topStyle]} Strong leaders learn to use all three approaches when the situation requires them.`;
}

function lesson3Scenario(kind){
  const box=document.getElementById('lesson3-scenario-feedback');
  box.className='feedback '+(kind==='good'?'good':'try');
  box.textContent=kind==='good'
    ? 'Strong choice. Effective leadership creates space for others to contribute and protects respectful teamwork.'
    : 'This response does not fully support the team. A leader should help every member contribute while maintaining respect.';
}

function gradeLesson3Check(){
  const key={l3q1:'b',l3q2:'a',l3q3:'c'};
  let score=0;
  Object.entries(key).forEach(([name,correct])=>{
    const selected=document.querySelector(`input[name="${name}"]:checked`);
    if(selected&&selected.value===correct) score++;
  });
  document.getElementById('lesson3-check-result').textContent=
    `Score: ${score}/3. ${score===3?'Excellent work. You understand the foundation of effective leadership.':'Review the leadership concepts and try again.'}`;
}

function saveLesson3Reflection(){
  const field=document.getElementById('lesson3-reflection');
  const status=document.getElementById('lesson3-reflection-status');
  if(!field.value.trim()){
    status.textContent='Enter a response before saving.';
    return;
  }
  localStorage.setItem('callaway_week1_lesson3_reflection',field.value);
  status.textContent='Saved on this device. Submit the graded response in Canvas.';
}
