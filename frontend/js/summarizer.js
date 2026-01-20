import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* 🔹 Supabase client */
const supabase = createClient(
   "https://tbqjszeixvwrwcstwohg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicWpzemVpeHZ3cndjc3R3b2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjMzOTcsImV4cCI6MjA4MjkzOTM5N30.IF_s1CDKYVHs4PV_KoZsCQp0MipH2hR3IZvr_o2Ik9o"

);

/* 🔹 SUMMARIZE FUNCTION */
window.summarize = async function () {
  const input = document.getElementById("sumInput");
  const output = document.getElementById("sumOutput");
  const status = document.getElementById("sumStatus");

  const text = input.value.trim();
  if (!text) {
    alert("Please paste some content");
    return;
  }

  status.innerText = "⏳ Summarizing...";
  output.innerHTML = "";

  try {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `
Summarize the following content into **exam-oriented bullet points**.

Respond in Markdown with:
- Headings
- Bullet points
- Bold important terms

Content:
${text}
`
      })
    });

    const data = await res.json();
    if (!data.reply) throw new Error("No summary generated");

    // ✅ MARKDOWN RENDER
    output.innerHTML = marked.parse(data.reply);
    status.innerText = "✅ Summary ready";

  } catch (err) {
    console.error(err);
    status.innerText = "❌ Failed to summarize";
    output.innerHTML = "<p>Please try again.</p>";
  }
};

/* 🔹 SAVE SUMMARY */
window.saveSummary = async function () {
  const summaryHTML = document.getElementById("sumOutput").innerHTML;
  if (!summaryHTML) {
    alert("No summary to save");
    return;
  }

  const { data } = await supabase.auth.getUser();

  await supabase.from("summaries").insert({
    user_id: data.user.id,
    content: summaryHTML
  });

  alert("✅ Summary saved successfully");
};

/* 🔹 LOAD SAVED SUMMARIES */
window.loadSavedSummaries = async function () {
  const container = document.getElementById("savedSummaries");
  container.innerHTML = "⏳ Loading saved summaries...";

  const { data: userData } = await supabase.auth.getUser();

  const { data: summaries } = await supabase
    .from("summaries")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (!summaries || summaries.length === 0) {
    container.innerHTML = "<p>No saved summaries</p>";
    return;
  }

  container.innerHTML = "";

  summaries.forEach(summary => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <small>Saved on: ${new Date(summary.created_at).toLocaleString()}</small>
      <div class="ai-output">${summary.content}</div>
    `;
    container.appendChild(div);
  });
};
