# AI Chatbot with Memory (Ollama)

A terminal chatbot that runs a local AI model (llama3.2 via Ollama) and remembers the conversation.

## Run
1. Install Ollama and Node.js
2. ollama pull llama3.2
3. node chatbot.mjs

## Features
- Remembers the whole chat (messages list)
- System prompt, "reset" and "exit" commands
- Error handling if Ollama isn't running
- Memory limit that drops the oldest messages