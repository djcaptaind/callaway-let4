const labState = new Map();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-lab-item]').forEach((item, index) => {
    item.querySelectorAll('.lab-choice').forEach(button => {
      button.addEventListener('click', () => {
        const selected = button.dataset.choice;
        const correct = item.dataset.answer;
        const feedback = item.querySelector('.feedback');
        const isCorrect = selected === correct;

        labState.set(index, isCorrect);
        feedback.className = 'feedback ' + (isCorrect ? 'good' : 'try');
        feedback.textContent = isCorrect
          ? 'Correct. This behavior supports preparation, respect, engagement, or accountability.'
          : 'Not quite. Consider whether this behavior protects learning time and helps the team succeed.';

        item.querySelectorAll('.lab-choice').forEach(choice => {
          choice.disabled = true;
        });

        updateLabResult();
      });
    });
  });

  const reflection = document.getElementById('lesson2-reflection');
  if (reflection) {
    reflection.value = localStorage.getItem('callaway_week1_lesson2_reflection') || '';
  }
});

function updateLabResult() {
  const result = document.getElementById('lab-result');
  if (labState.size < 5) {
    result.textContent = `Completed ${labState.size} of 5 decisions.`;
    return;
  }
  const score = [...labState.values()].filter(Boolean).length;
  result.textContent = `Decision Lab Score: ${score}/5. ${
    score === 5
      ? 'Excellent. You correctly identified every behavior.'
      : 'Review the feedback and connect each choice to preparation, respect, engagement, safety, or accountability.'
  }`;
}

function lesson2Scenario(kind) {
  const box = document.getElementById('lesson2-scenario-feedback');
  box.className = 'feedback ' + (kind === 'good' ? 'good' : 'try');
  box.textContent = kind === 'good'
    ? 'Strong choice. Leadership is shown by maintaining the standard and redirecting others respectfully, even when supervision is limited.'
    : 'This response does not protect the team’s learning time. A leader should model the standard and redirect the group appropriately.';
}

function gradeLesson2Check() {
  const key = { l2q1: 'b', l2q2: 'c', l2q3: 'a' };
  let score = 0;

  Object.entries(key).forEach(([name, correct]) => {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (selected && selected.value === correct) score++;
  });

  const result = document.getElementById('lesson2-check-result');
  result.textContent = `Score: ${score}/3. ${
    score === 3
      ? 'Excellent work. You understand the classroom standard.'
      : 'Review the routines and expectations, then try again.'
  }`;
}

function saveLesson2Reflection() {
  const field = document.getElementById('lesson2-reflection');
  const status = document.getElementById('lesson2-reflection-status');

  if (!field.value.trim()) {
    status.textContent = 'Enter a response before saving.';
    return;
  }

  localStorage.setItem('callaway_week1_lesson2_reflection', field.value);
  status.textContent = 'Saved on this device. Submit the graded response in Canvas.';
}
