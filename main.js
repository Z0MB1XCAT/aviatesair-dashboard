// main.js — update WORKER_URL to your deployed Worker before using any backend calls
const WORKER_URL = "https://aviatesair-signup.dexterhsrees.workers.dev"; // <-- REPLACE this

// If index has a "Get Your ACARS Key" action in the future, it can call generate or link to signup.
// For signup page, we wire the button below.

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("signupBtn");
  if (btn) {
    btn.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const callsign = document.getElementById("callsign").value.trim();
      const simbrief = document.getElementById("simbrief").value.trim();
      const result = document.getElementById("result");

      result.style.display = "block";
      result.textContent = "Creating account...";

      if (!email || !password) {
        result.textContent = "Please fill email and password.";
        return;
      }

      try {
        const resp = await fetch(WORKER_URL + "/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, callsign, simbrief })
        });

        const json = await resp.json();

        if (resp.ok && json.success) {
          result.textContent = "Signup complete! Your ACARS Key: " + json.acarsKey;
        } else {
          result.textContent = json.error || "Signup failed. Try again.";
        }
      } catch (err) {
        result.textContent = "Backend unreachable. Check WORKER_URL in main.js";
      }
    });
  }

  // small convenience: let hero image be changed locally in dev (not required)
  const hero = document.getElementById("hero");
  if (hero) {
    // if user has hero.jpg in images folder it'll show automatically
  }
});
