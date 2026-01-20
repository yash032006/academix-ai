

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tbqjszeixvwrwcstwohg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicWpzemVpeHZ3cndjc3R3b2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjMzOTcsImV4cCI6MjA4MjkzOTM5N30.IF_s1CDKYVHs4PV_KoZsCQp0MipH2hR3IZvr_o2Ik9o"

);

// SIGN UP
window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Signup successful! Now login.");
  }
};

// LOGIN
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
  } else {
    window.location.href = "dashboard.html";
  }
};
