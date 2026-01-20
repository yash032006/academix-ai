import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
"https://tbqjszeixvwrwcstwohg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicWpzemVpeHZ3cndjc3R3b2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjMzOTcsImV4cCI6MjA4MjkzOTM5N30.IF_s1CDKYVHs4PV_KoZsCQp0MipH2hR3IZvr_o2Ik9o"

);

let userId = null;

// 🔐 Get logged-in user safely
async function initUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    alert("User not logged in");
    return;
  }

  userId = data.user.id;
  loadTasks();
}

// ➕ Add Task
window.addTask = async function () {
  const title = document.getElementById("taskTitle").value.trim();
  const date = document.getElementById("taskDate").value;

  if (!title || !date) {
    alert("Please enter task and date");
    return;
  }

  await supabase.from("tasks").insert({
    user_id: userId,
    title,
    deadline: date,
    status: "pending"
  });

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDate").value = "";

  loadTasks(); // 🔄 Refresh UI
};

// 📥 Load Tasks
async function loadTasks() {
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("deadline", { ascending: true });

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let completedCount = 0;

  if (!tasks || tasks.length === 0) {
    list.innerHTML = "<li>No tasks added yet</li>";
    updateProgress(0, 0);
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <label>
        <input type="checkbox" ${task.status === "completed" ? "checked" : ""}>
        <strong>${task.title}</strong>
        <span> (Due: ${task.deadline})</span>
      </label>
      <button style="margin-left:10px;">❌</button>
    `;

    const checkbox = li.querySelector("input");
    const deleteBtn = li.querySelector("button");

    // ✅ Toggle status
    checkbox.addEventListener("change", async () => {
      await supabase
        .from("tasks")
        .update({
          status: checkbox.checked ? "completed" : "pending"
        })
        .eq("id", task.id);

      loadTasks();
    });

    // ❌ Delete task
    deleteBtn.addEventListener("click", async () => {
      await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id);

      loadTasks();
    });

    if (task.status === "completed") completedCount++;
    list.appendChild(li);
  });

  updateProgress(completedCount, tasks.length);
}

// 📊 Progress Bar
function updateProgress(done, total) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").innerText =
    `${percent}% Completed (${done}/${total})`;
}

// 🚀 Init
initUser();
