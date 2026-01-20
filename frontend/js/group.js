import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tbqjszeixvwrwcstwohg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicWpzemVpeHZ3cndjc3R3b2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjMzOTcsImV4cCI6MjA4MjkzOTM5N30.IF_s1CDKYVHs4PV_KoZsCQp0MipH2hR3IZvr_o2Ik9o"

);

let userId = null;
let currentGroupId = null;
// 📥 Load existing groups
async function loadGroups() {
  const { data: groups } = await supabase
    .from("groups")
    .select("*");

  const list = document.getElementById("groupList");
  list.innerHTML = "";

  if (!groups || groups.length === 0) {
    list.innerHTML = "<li>No groups yet</li>";
    return;
  }

  groups.forEach(group => {
    const li = document.createElement("li");
    li.innerText = group.name;
    li.style.cursor = "pointer";

    li.onclick = () => joinGroup(group.id, group.name);
    list.appendChild(li);
  });
}


// 🔐 Get user
async function initUser() {
  const { data } = await supabase.auth.getUser();
  userId = data.user.id;
}

window.createGroup = async function () {
  const name = document.getElementById("groupName").value.trim();
  if (!name) return alert("Enter group name");

  // Check if group exists
  let { data: groups } = await supabase
    .from("groups")
    .select("*")
    .eq("name", name)
    .limit(1);

  if (groups.length === 0) {
    const { data } = await supabase
      .from("groups")
      .insert({ name })
      .select()
      .single();
    currentGroupId = data.id;
  } else {
    currentGroupId = groups[0].id;
  }

  document.getElementById("currentGroup").innerText =
    "Joined Group: " + name;

  document.getElementById("chatBox").style.display = "block";
  loadMessages();
};
function joinGroup(groupId, groupName) {
  currentGroupId = groupId;

  document.getElementById("currentGroup").innerText =
    "Joined Group: " + groupName;

  document.getElementById("chatBox").style.display = "block";
  loadMessages();
}

window.sendMessage = async function () {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  await supabase.from("group_messages").insert({
    group_id: currentGroupId,
    sender: userId,
    message: text
  });

  input.value = "";
  loadMessages();
};

async function loadMessages() {
  const { data: messages } = await supabase
    .from("group_messages")
    .select("*")
    .eq("group_id", currentGroupId)
    .order("created_at", { ascending: true });

  const box = document.getElementById("messages");
  box.innerHTML = "";

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.innerText =
      (msg.sender === userId ? "You: " : "User: ") + msg.message;
    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

// 🔄 Realtime updates
supabase
  .channel("group-chat")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "group_messages" },
    payload => {
      if (payload.new.group_id === currentGroupId) {
        loadMessages();
      }
    }
  )
  .subscribe();

initUser().then(loadGroups);

