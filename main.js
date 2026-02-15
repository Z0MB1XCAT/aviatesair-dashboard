// main.js — update WORKER_URL to your deployed Worker before using any backend calls
const WORKER_URL = "https://aviatesair-signup.dexterhsrees.workers.dev"; // <-- REPLACE this

// If index has a "Get Your ACARS Key" action in the future, it can call generate or link to signup.
// For signup page, we wire the button below.

document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const callsign = document.getElementById("callsign").value.trim();
      const simbrief = document.getElementById("simbrief").value.trim();
      const result = document.getElementById("result");

      result.style.display = "block";
      result.textContent = "Creating account...";
      signupBtn.disabled = true;

      if (!email || !password) {
        result.textContent = "Please fill email and password.";
        signupBtn.disabled = false;
        return;
      }

      if (password.length < 8) {
        result.textContent = "Password must be at least 8 characters.";
        signupBtn.disabled = false;
        return;
      }

      try {
        const resp = await fetch(WORKER_URL + "/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, callsign, simbrief })
        });

        const json = await resp.json().catch(() => ({}));

        if (resp.ok && json.success) {
          result.textContent = "Signup complete! Your ACARS Key: " + json.acarsKey;
        } else {
          result.textContent = json.error || "Signup failed. Try again.";
        }
      } catch (err) {
        result.textContent = "Backend unreachable. Check WORKER_URL in main.js";
      } finally {
        signupBtn.disabled = false;
      }
    });
  }

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const result = document.getElementById("loginResult");

      result.style.display = "block";
      result.textContent = "Signing in...";
      loginBtn.disabled = true;

      if (!email || !password) {
        result.textContent = "Please fill email and password.";
        loginBtn.disabled = false;
        return;
      }

      try {
        const resp = await fetch(WORKER_URL + "/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const json = await resp.json().catch(() => ({}));

        if (resp.ok && json.session) {
          sessionStorage.setItem("session", json.session);
          result.textContent = "Login successful. Your ACARS Key: " + json.acarsKey;
        } else {
          result.textContent = json.error || "Login failed. Try again.";
        }
      } catch (err) {
        result.textContent = "Backend unreachable. Check WORKER_URL in main.js";
      } finally {
        loginBtn.disabled = false;
      }
    });
  }
});
