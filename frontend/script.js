const BACKEND_URL = "https://emberlight-backend.onrender.com";

const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function appendMessage(text, role) {
  const div = document.createElement("div");
  div.classList.add("message", role);
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  userInput.value = "";

  appendMessage("Emberlight is thinking...", "assistant");

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    // remove the "thinking" message
    const last = chatWindow.lastChild;
    if (last && last.textContent === "Emberlight is thinking...") {
      chatWindow.removeChild(last);
    }

    if (data.reply) {
      appendMessage(data.reply, "assistant");
    } else {
      appendMessage("I’m sorry, I couldn’t generate a response.", "assistant");
    }
  } catch (err) {
    console.error(err);
    appendMessage("There was an error talking to Emberlight.", "assistant");
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
