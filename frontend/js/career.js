window.getCareerGuidance = async function () {
  const branch = document.getElementById("branch").value.trim();
  const interest = document.getElementById("interest").value.trim();
  const output = document.getElementById("careerOutput");

  if (!branch || !interest) {
    alert("Please enter branch and interest");
    return;
  }

  output.innerText = "⏳ Generating career roadmap...";

  const prompt = `
You are a career guidance expert.

Student details:
- Branch: ${branch}
- Interest: ${interest}

Suggest:
1. Suitable career roles
2. Required technical & soft skills
3. Recommended courses / certifications
4. Academic preparation roadmap
5. Final motivation tip
please keep answer in to the points. straight to the point.

Keep the response structured and easy to understand.
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
    output.innerText = "❌ Failed to generate career guidance";
  }
};
