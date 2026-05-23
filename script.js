const key = "sahonomics-finpilot-theme";
const saved = localStorage.getItem(key);
if (saved === "dark") document.body.classList.add("dark");

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(key, document.body.classList.contains("dark") ? "dark" : "light");
});
