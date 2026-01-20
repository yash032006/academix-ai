import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tbqjszeixvwrwcstwohg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicWpzemVpeHZ3cndjc3R3b2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjMzOTcsImV4cCI6MjA4MjkzOTM5N30.IF_s1CDKYVHs4PV_KoZsCQp0MipH2hR3IZvr_o2Ik9o"

);

// Save Goal
window.saveGoal = async function () {
  const goalType = document.getElementById("goalType").value;
  const target = document.getElementById("goalTarget").value.trim();

  if (!goalType || !target) {
    alert("Please select goal and target");
    return;
  }

  const { data } = await supabase.auth.getUser();

  await supabase.from("goals").insert({
    user_id: data.user.id,
    goal_type: goalType,
    target: target
  });

  alert("✅ Goal saved successfully");
};

// AI Goal Strategy
window.getGoalStrategy = async function () {
  const goalType = document.getElementById("goalType").value;
  const target = document.getElementById("goalTarget").value;
  const output = document.getElementById("goalOutput");

  if (!goalType || !target) {
    alert("Please set goal first");
    return;
  }

  output.innerText = "⏳ Generating strategy...";

  const prompt = `
You are an academic mentor.

A student has the goal:
Goal Type: ${goalType}
Target: ${target}

Suggest:
- Study strategy
- Time allocation tips
- Exam preparation advice
- Motivation tips
all above in 4 points.
Keep it concise and practical.
`;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  output.innerHTML = marked.parse(data.reply);
};
