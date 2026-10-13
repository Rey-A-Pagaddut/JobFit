/* JobFit authentication UI controller. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const DB_KEY = "jobfit_demo_v1";
  const USERS_KEY = "jobfit_users";
  const SESSION_KEY = "jobfit_demo_session";
  const demoAccount = { name: "JobFit Admin", email: "Admin@123", password: "Admin@123", headline: "Open to opportunities", location: "Philippines", initials: "JA", demo: true };

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function setMessage(message, success = false) {
    const target = $("#authMessage");
    if (target) { target.textContent = message; target.classList.toggle("success", success); }
  }
  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    window.setTimeout(() => el.classList.remove("show"), 2600);
  }
  function startSession(account) {
    const current = readJSON(DB_KEY, {});
    current.user = { name: account.name, email: account.email, headline: account.headline || "Open to opportunities", location: account.location || "Philippines", demo: Boolean(account.demo) };
    if (!current.profile || current.profile.ownerEmail !== account.email) {
      current.profile = { ownerEmail: account.email, headline: account.headline || "Open to opportunities", about: "Curious professional excited to learn, collaborate, and build great things.", location: account.location || "Philippines", skills: ["Communication", "Problem Solving", "Teamwork"], experience: [], education: [] };
    }
    localStorage.setItem(DB_KEY, JSON.stringify(current));
    sessionStorage.setItem(SESSION_KEY, "1");
    window.location.href = "dashboard.html";
  }
  function validForm(form) {
    if (!form.checkValidity()) { form.reportValidity(); return false; }
    return true;
  }

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-toggle-password]");
    if (toggle) {
      const input = $("#" + toggle.dataset.togglePassword);
      if (input) {
        input.type = input.type === "password" ? "text" : "password";
        toggle.innerHTML = `<i class="bi bi-eye${input.type === "password" ? "" : "-slash"}"></i>`;
      }
    }
    const social = event.target.closest("[data-social]");
    if (social) toast(`${social.dataset.social} sign-in needs to be configured for this account.`);
    const info = event.target.closest("[data-info]");
    if (info) { event.preventDefault(); toast(`${info.dataset.info} page is not connected in this prototype.`); }
  });

  const loginForm = $("#loginForm");
  if (loginForm) loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validForm(loginForm)) return;
    const identifier = $("#loginEmail").value.trim();
    const password = $("#loginPassword").value;
    if (identifier.toLowerCase() === demoAccount.email.toLowerCase() && password === demoAccount.password) {
      startSession(demoAccount);
      return;
    }
    const accounts = readJSON(USERS_KEY, []);
    const account = accounts.find((item) => item.email.toLowerCase() === identifier.toLowerCase() && item.password === password);
    if (account) { startSession(account); return; }
    setMessage("We couldn't find an account with those details. Check your email and password.");
  });

  const signupForm = $("#signupForm");
  if (signupForm) signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validForm(signupForm)) return;
    const name = $("#signupName").value.trim();
    const email = $("#signupEmail").value.trim();
    const password = $("#signupPassword").value;
    if (name.length < 2) { setMessage("Please enter your full name."); return; }
    if (password.length < 6) { setMessage("Your password must contain at least 6 characters."); return; }
    if (!$("#termsAccepted").checked) { setMessage("Please accept the Terms of Service and Privacy Policy."); return; }
    const accounts = readJSON(USERS_KEY, []);
    if (accounts.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
      setMessage("An account with this email already exists. Please log in instead.");
      return;
    }
    accounts.push({ name, email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
    startSession({ name, email, headline: "New JobFit member", location: "Philippines" });
  });

  const testButton = $("#testModeBtn");
  if (testButton) testButton.addEventListener("click", () => startSession(demoAccount));
  const forgotButton = $("#forgotBtn");
  if (forgotButton) forgotButton.addEventListener("click", () => setMessage("Password recovery is not available yet. Please contact support."));
})();
