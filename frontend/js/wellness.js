window.analyzeWellness = async function () {
  const dailyHours = document.getElementById("dailyHours").value;
  const sleepHours = document.getElementById("sleepHours").value;
  const stress = document.getElementById("stressLevel").value;
  const output = document.getElementById("wellnessOutput");

  if (!dailyHours || !sleepHours || !stress) {
    alert("Please fill all fields");
    return;
  }

  output.innerText = "⏳ Analyzing wellness...";

  const prompt = `
You are a student wellness advisor.

Student data:
- Daily study hours: ${dailyHours}
- Sleep hours per day: ${sleepHours}
- Self-reported stress level: ${stress}

Tasks:
1. Determine burnout risk (Low / Medium / High)
2. Explain reasoning briefly
3. Suggest practical actions:
   - Study breaks
   - Sleep habits
   - Stress reduction
4. Keep advice academic-focused and supportive
all this in very short 4 points.
`;

  try {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
     output.innerHTML = marked.parse(data.reply);
  } catch (err) {
    output.innerText = "❌ Failed to analyze wellness";
  }
};
