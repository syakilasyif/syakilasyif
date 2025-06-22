const questionsByTopic = {
  integration: Array.from({ length: 50 }, (_, i) => ({
    q: `Integration Question ${i + 1}: What is ∫x^${i + 1} dx?`,
    choices: shuffle([
      `1/${i + 2} x^${i + 2} + C`,
      `x^${i} + C`,
      `x^${i + 2} + C`,
      `x^${i + 1} + C`
    ]),
    answer: `1/${i + 2} x^${i + 2} + C`
  })),
  algebra: Array.from({ length: 50 }, (_, i) => ({
    q: `Algebra Q${i + 1}: Solve for x in x + ${i + 1} = ${i + 3}`,
    choices: shuffle([
      `x = ${i + 1}`,
      `x = ${i + 2}`,
      `x = ${i}`,
      `x = ${i + 3}`
    ]),
    answer: `x = ${i + 2}`
  })),
  trigonometry: Array.from({ length: 50 }, (_, i) => {
    const angle = (i * 7) % 180;
    let answer = "0";
    if (angle === 30) answer = "0.5";
    else if (angle === 90) answer = "1";
    else if (angle === 150) answer = "0.5";
    return {
      q: `Trig Q${i + 1}: What is sin(${angle}°)?`,
      choices: shuffle(["0", "0.5", "1", "-1"]),
      answer
    };
  }),
  misc: Array.from({ length: 50 }, (_, i) => {
    const a = i + 2, b = i + 3;
    return {
      q: `Misc Q${i + 1}: What is ${a} × ${b}?`,
      choices: shuffle([`${a * b}`, `${a * b + 1}`, `${a * b + 2}`, `${a * b - 1}`]),
      answer: `${a * b}`
    };
  })
};

let current = 0;
let currentTopic = "";
let score = 0;
let currentSet = [];

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function selectTopic() {
  const topic = document.getElementById("topicSelect").value;
  if (!questionsByTopic[topic]) return;
  currentTopic = topic;
  current = 0;
  score = 0;
  currentSet = shuffle([...questionsByTopic[topic]]);
  document.getElementById("quizBox").style.display = "block";
  loadQuestion();
}

function loadQuestion() {
  if (current >= currentSet.length) {
    document.getElementById("question").innerText = `🎉 Done! Score: ${score}/${currentSet.length}`;
    document.getElementById("choices").innerHTML = "";
    document.getElementById("progressBar").style.width = `100%`;
    return;
  }

  const question = currentSet[current];
  document.getElementById("question").innerText = question.q;

  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";

  question.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-button";
    btn.innerText = choice;
    btn.onclick = () => {
      playSound("clickSound");
      document.querySelectorAll(".choice-button").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    };
    choicesContainer.appendChild(btn);
  });

  document.getElementById("result").innerText = "";
  document.getElementById("progressBar").style.width = `${(current / currentSet.length) * 100}%`;
}

function checkAnswer() {
  const selected = document.querySelector(".choice-button.selected");
  if (!selected) return;

  const answer = selected.innerText;
  const correct = currentSet[current].answer;

  if (answer === correct) {
    document.getElementById("result").innerText = "✅ Correct!";
    playSound("correctSound");
    score++;
  } else {
    document.getElementById("result").innerText = "❌ Wrong!";
    playSound("wrongSound");
  }

  setTimeout(() => {
    current++;
    loadQuestion();
  }, 1000);
}

function resetQuiz() {
  document.getElementById("topicSelect").value = "";
  document.getElementById("quizBox").style.display = "none";
  document.getElementById("result").innerText = "";
  document.getElementById("question").innerText = "Question will appear here";
  document.getElementById("choices").innerHTML = "";
  document.getElementById("progressBar").style.width = "0%";
  score = 0;
  current = 0;
}