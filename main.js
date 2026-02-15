const WORKER_URL = "https://aviatesair-signup.dexterhsrees.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("homeHero");
  if (hero) {
    const heroImages = [
      "images/hero.jpg?slide=1",
      "images/hero.jpg?slide=2",
      "images/hero.jpg?slide=3",
      "images/hero.jpg?slide=4",
      "images/hero.jpg?slide=5"
    ];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % heroImages.length;
      hero.classList.remove("fade");
      hero.style.backgroundImage = `url('${heroImages[i]}')`;
      void hero.offsetWidth;
      hero.classList.add("fade");
    }, 5500);
  }

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
          result.textContent = "Signup complete! Opening Pilot Portal...";
          window.open("pilotportal.html", "_blank", "noopener,noreferrer");
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
          result.textContent = "Login successful. Opening Pilot Portal...";
          window.open("pilotportal.html", "_blank", "noopener,noreferrer");
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
