
// alert("chatbot.js loaded");

window.askAI = async function () {
  const input = document.getElementById("chatInput");
  const output = document.getElementById("chatOutput");
  const status = document.getElementById("chatStatus");

  const question = input.value.trim();
  if (!question) {
    alert("Please enter a question");
    return;
  }

  status.innerText = "⏳ AI is thinking...";
  output.innerHTML = ""; // ✅ use innerHTML

  try {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: question })
    });

    const data = await res.json();

    // ✅ SAFETY CHECK
    if (!data.reply) {
      throw new Error("Empty AI response");
    }

    // ✅ MARKDOWN RENDER
    output.innerHTML = marked.parse(data.reply);

    status.innerText = "✅ Answer generated";
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Failed to get response";
    output.innerHTML = "<p>Something went wrong. Please try again.</p>";
  }
};
