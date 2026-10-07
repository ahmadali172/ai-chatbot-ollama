import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

const MODEL = "llama3.2";            // EXPERIMENT: try "qwen2.5:7b"
const MAX_HISTORY = 10;              // EXPERIMENT: try 4, 10, 20
const SYSTEM_PROMPT = "You are a friendly assistant. Keep answers short.";   // EXPERIMENT: change the personality

const messages = [{ role: "system", content: SYSTEM_PROMPT }];

console.log('Chat started. Type "reset" to clear memory, "exit" to quit.\n');

while (true) {
  const userText = (await rl.question("You: ")).trim();

  if (userText === "exit") break;
  if (userText === "reset") {
    messages.length = 1;
    console.log("Memory cleared.\n");
    continue;
  }
  if (!userText) continue;

  messages.push({ role: "user", content: userText });

  let reply;
  try {
    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: false,
        options: {
          temperature: 0.7,          // EXPERIMENT: 0, 0.7, 1.5
          num_predict: 200,          // EXPERIMENT: 20, 200, 500 (max answer length)
        },
      }),
    });
    if (!res.ok) throw new Error("Ollama returned status " + res.status);
    const data = await res.json();
    reply = data.message.content;
  } catch (err) {
    console.log("Error: " + err.message + ". Is Ollama running?\n");
    messages.pop();
    continue;
  }

  messages.push({ role: "assistant", content: reply });
  console.log("AI: " + reply + "\n");

  // console.log(messages);          // EXPERIMENT: remove the // to watch the notebook grow

  while (messages.length > MAX_HISTORY + 1) {
    messages.splice(1, 2);
  }
}

rl.close();