import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* 🔹 Supabase client */
const supabase = createClient(
 "https://tbqjszeixvwrwcstwohg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicWpzemVpeHZ3cndjc3R3b2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjMzOTcsImV4cCI6MjA4MjkzOTM5N30.IF_s1CDKYVHs4PV_KoZsCQp0MipH2hR3IZvr_o2Ik9o"

);

/* 🔹 GENERATE STUDY PLAN */
window.generatePlan = async function () {
  const subjects = document.getElementById("subjects").value.trim();
  const examDateValue = document.getElementById("examDate").value;
  const hours = document.getElementById("hours").value;

  const output = document.getElementById("planOutput");
  const status = document.getElementById("planStatus");

  if (!subjects || !examDateValue || !hours) {
    alert("Please fill all fields");
    return;
  }

  const today = new Date();
  const examDate = new Date(examDateValue);
  const totalDays = Math.ceil(
    (examDate - today) / (1000 * 60 * 60 * 24)
  );

  if (totalDays <= 0) {
    alert("Exam date must be in the future");
    return;
  }

  status.innerText = "⏳ Generating AI study plan...";
  output.innerHTML = ""; // ✅ important

  const prompt = `
You are an expert academic study planner.

Subjects: ${subjects}
Daily Study Hours: ${hours}
Total Available Days: ${totalDays}

Rules:
- Start from Day 1 to Day ${totalDays}
- Do NOT use calendar dates
- Include revision and buffer days

Respond in Markdown with:
- Headings
- Bullet points
- Tables if helpful
`;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    if (!data.reply) throw new Error("Empty plan");

    // ✅ MARKDOWN RENDER
    output.innerHTML = marked.parse(data.reply);
    status.innerText = "✅ Study plan generated";

  } catch (err) {
    console.error(err);
    status.innerText = "❌ Failed to generate plan";
    output.innerHTML = "<p>Please try again.</p>";
  }
};

/* 🔹 SAVE STUDY PLAN */
window.savePlan = async function () {
  const planText = document.getElementById("planOutput").innerHTML;
  if (!planText) {
    alert("No study plan to save");
    return;
  }

  const { data } = await supabase.auth.getUser();

  await supabase.from("study_plans").insert({
    user_id: data.user.id,
    content: planText
  });

  alert("✅ Study plan saved successfully");
};

/* 🔹 LOAD SAVED PLANS */
window.loadSavedPlans = async function () {
  const container = document.getElementById("savedPlans");
  container.innerHTML = "⏳ Loading saved plans...";

  const { data: userData } = await supabase.auth.getUser();

  const { data: plans } = await supabase
    .from("study_plans")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (!plans || plans.length === 0) {
    container.innerHTML = "<p>No saved study plans</p>";
    return;
  }

  container.innerHTML = "";

  plans.forEach(plan => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <small>Saved on: ${new Date(plan.created_at).toLocaleString()}</small>
      <div class="ai-output">${plan.content}</div>
    `;
    container.appendChild(div);
  });
};
