import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* 🔹 SUPABASE CLIENT (PASTE YOUR REAL KEYS) */
const supabase = createClient(
   "https://tbqjszeixvwrwcstwohg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicWpzemVpeHZ3cndjc3R3b2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjMzOTcsImV4cCI6MjA4MjkzOTM5N30.IF_s1CDKYVHs4PV_KoZsCQp0MipH2hR3IZvr_o2Ik9o"

);

/* 🔹 LOAD PROFILE ON PAGE LOAD */
document.addEventListener("DOMContentLoaded", loadProfile);

async function loadProfile() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return;

  const { data, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (fetchError || !data) return;

  document.getElementById("fullName").value = data.full_name || "";
  document.getElementById("college").value = data.college || "";
  document.getElementById("branch").value = data.branch || "";
  document.getElementById("semester").value = data.semester || "";
  document.getElementById("studyHours").value = data.study_hours || "";
  document.getElementById("goal").value = data.goal || "";
}

/* 🔹 SAVE / UPDATE PROFILE */
window.saveProfile = async function () {
  const status = document.getElementById("profileStatus");
  status.innerText = "⏳ Saving profile...";

  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !user) {
    status.innerText = "❌ User not logged in";
    return;
  }

  const payload = {
    user_id: user.id,
    full_name: document.getElementById("fullName").value,
    college: document.getElementById("college").value,
    branch: document.getElementById("branch").value,
    semester: document.getElementById("semester").value,
    study_hours: document.getElementById("studyHours").value || null,
    goal: document.getElementById("goal").value
  };

  const { error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    console.error(error);
    status.innerText = "❌ " + error.message;
  } else {
    status.innerText = "✅ Profile saved successfully";
  }
};

/* 🔹 LOGOUT */
window.logout = async function () {
  await supabase.auth.signOut();
  window.location.href = "index.html";
};
