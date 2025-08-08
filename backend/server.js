require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    "GEMINI_API_KEY environment variable is not set. Please set it before running the server."
  );
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static("."));

let conversationHistory = [];

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.prompt;
  const lang = req.body.lang || "en";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let currentPrompt;
    if (userMessage === "GENERATE_INITIAL_SCENARIO") {
      currentPrompt = `You are a noir text adventure game master. Create a unique opening scenario for a new detective story set in 1949.

SETTING:
- Rain-soaked neon-lit city, dark atmosphere
- Player is a private investigator in office (3rd floor, dilapidated building)
- Night time, raining

INSTRUCTIONS:
- Create a completely new and different opening
- Vary gender/characteristics of the first character introduced
- Immediately establish a mystery or situation requiring investigation
- End with player needing to make a decision
- Maintain cinematic noir tone throughout
- NEVER break character or mention this is a game

VARIATION EXAMPLES:
- Desperate client arrives at midnight
- Mysterious phone call interrupts the rain
- Violent event in the alley draws attention
- Suspicious envelope appears at door
- Injured person seeks help

Respond in 2-4 concise, atmospheric sentences. Response language: ${lang}`;
      conversationHistory = []; // Clear history for a new game start
    } else {
      conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }],
      });
      currentPrompt = `You are a noir text adventure game master specializing in 1949 detective stories.

CORE RULES:
- NEVER break character or mention this is a game
- Respond DIRECTLY to the player's last action with realistic consequences
- Maintain absolute consistency with previous events
- Dark, cinematic tone with sharp dialogue
- Accept any player action, even morally questionable ones

PLAYER'S LAST ACTION: "${userMessage}"

REQUIRED RESPONSE:
- Show immediate, realistic consequences of this action
- If talked to someone → show person's reaction
- If examined something → describe findings
- If went somewhere → describe arrival/environment
- If acted violently → realistic consequences

NARRATIVE GUIDELINES:
- 2-4 impactful, concise sentences
- Evocative language, noir atmosphere
- Build tension gradually
- Introduce subtle clues when appropriate
- End allowing player's next action
- If case solved → end with [FIM_DE_JOGO]

CONVERSATION HISTORY:
${conversationHistory
  .map(
    (h) => `${h.role === "user" ? "PLAYER" : "NARRATOR"}: ${h.parts[0].text}`
  )
  .join("\n")}

Stay focused on the immediate action. Be consistent with established characters and locations. Response language: ${lang}`;
    }

    const result = await model.generateContent(currentPrompt);
    const response = await result.response;
    const text = response.text();

    conversationHistory.push({ role: "model", parts: [{ text }] });

    res.json({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
