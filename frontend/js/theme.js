// ===== THEME HANDLER (SAFE & CORRECT) =====

const THEME_KEY = "academix-theme";

// Apply saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});

// Toggle theme
function toggleDark() {
  const isDark = document.body.classList.toggle("dark");

  localStorage.setItem(
    THEME_KEY,
    isDark ? "dark" : "light"
  );
}
