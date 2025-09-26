// scripts/theme.js

// Apply saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  updateThemeToggleIcon();

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
});

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeToggleIcon();
}

function updateThemeToggleIcon() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.src = isDark ? "icons/moon.png" : "icons/sun.png";
}
