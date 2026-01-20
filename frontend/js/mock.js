window.generateMock = async function () {
  const subject = document.getElementById("mockSubject").value.trim();
  const output = document.getElementById("mockOutput");
  const status = document.getElementById("mockStatus");

  if (!subject) {
    alert("Please enter a subject");
    return;
  }

  status.innerText = "⏳ Generating mock test...";
  output.innerText = "";

  const prompt = `
You are an exam preparation assistant.

Generate 5 multiple choice questions (MCQs) for the subject "${subject}".

Rules:
- Each question should have 4 options (A, B, C, D)
- Clearly mention the correct answer after each question
- Keep questions exam-oriented
`;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    output.innerHTML = marked.parse(data.reply);
    status.innerText = "✅ Mock test generated";
  } catch (err) {
    status.innerText = "❌ Failed to generate mock test";
  }
};
