const storyOutput = document.getElementById("story-output");
const commandInput = document.getElementById("command-input");
const langSelection = document.getElementById("language-selection");
const gameContainer = document.getElementById("game-container");
const loadingIndicator = document.getElementById("loading-indicator");
const newCaseButton = document.getElementById("new-case-button");

let selectedLang = "en";

const initialMessages = {
  en: "You are a private detective in a rain-soaked, neon-lit city in the year 1949. Your office is on the third floor of a dilapidated building.",
  pt: "Você é um detetive particular em uma cidade encharcada de chuva e neon no ano de 1949. Seu escritório fica no terceiro andar de um prédio em ruínas.",
};

function typeWriter(text, element, i = 0, callback = () => {}) {
  if (i < text.length) {
    element.innerHTML += text.charAt(i);
    storyOutput.scrollTop = storyOutput.scrollHeight;
    setTimeout(() => typeWriter(text, element, i + 1, callback), 25);
  } else {
    callback(); // Call callback when done
  }
}

// New function to append messages
function appendMessage(sender, message = "") {
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    sender === "user" ? "user-message" : "ai-message"
  );
  messageElement.innerHTML = message;
  storyOutput.appendChild(messageElement);
  storyOutput.scrollTop = storyOutput.scrollHeight;
  return messageElement; // Return the created element
}

async function callAI(prompt) {
  const response = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, lang: selectedLang }),
  });
  const data = await response.json();
  return data.response;
}

function startGame(lang) {
  selectedLang = lang;
  langSelection.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  storyOutput.innerHTML = ""; // Clear previous story
  const initialMessageElement = appendMessage("ai"); // Create element for initial message
  typeWriter(initialMessages[lang], initialMessageElement, 0, async () => {
    // After initial message is typed, request the AI to generate the scenario
    loadingIndicator.classList.remove("hidden");
    const aiResponse = await callAI("GENERATE_INITIAL_SCENARIO"); // Special prompt
    loadingIndicator.classList.add("hidden");
    const aiScenarioElement = appendMessage("ai");
    typeWriter(aiResponse, aiScenarioElement, 0, () => {
      commandInput.disabled = false;
      commandInput.focus();
    });
  });
}

async function handleCommand(command) {
  commandInput.disabled = true;
  loadingIndicator.classList.remove("hidden");

  appendMessage("user", `> ${command}`); // Display user command
  commandInput.value = ""; // Clear input immediately

  const aiResponse = await callAI(command);

  loadingIndicator.classList.add("hidden");
  const aiMessageElement = appendMessage("ai"); // Create element for AI response

  if (aiResponse.includes("[FIM_DE_JOGO]")) {
    const finalResponse = aiResponse.replace("[FIM_DE_JOGO]", "").trim();
    typeWriter(finalResponse, aiMessageElement, 0, () => {
      appendMessage("ai", "<br>--- FIM DE JOGO ---<br>");
      commandInput.disabled = true;
      newCaseButton.classList.remove("hidden"); // Show new game button
    });
  } else {
    typeWriter(aiResponse, aiMessageElement, 0, () => {
      commandInput.disabled = false;
      commandInput.focus();
    });
  }
}

newCaseButton.addEventListener("click", () => {
  newCaseButton.classList.add("hidden");
  gameContainer.classList.add("hidden");
  langSelection.classList.remove("hidden");
  storyOutput.innerHTML = ""; // Clear story output
  commandInput.disabled = false;
  commandInput.value = "";
});

commandInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !commandInput.disabled) {
    const command = commandInput.value.trim();
    if (command) handleCommand(command);
  }
});

document
  .getElementById("lang-en")
  .addEventListener("click", () => startGame("en"));
document
  .getElementById("lang-pt")
  .addEventListener("click", () => startGame("pt"));
