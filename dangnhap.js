/* Toggle hiện/ẩn mật khẩu */
const toggleBtn = document.getElementById("toggle-pw");
const pwInput = document.getElementById("password");

toggleBtn.addEventListener("click", () => {
  const isHidden = pwInput.type === "password";
  pwInput.type = isHidden ? "text" : "password";
  toggleBtn.querySelector("img").style.opacity = isHidden ? "0.8" : "0.4";
});

/* Validate + submit */
document.getElementById("btn-login").addEventListener("click", (e) => {
  e.preventDefault();
  const emailEl = document.getElementById("email");
  const email = emailEl.value.trim();
  const pw = pwInput.value;
  let ok = true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailEl.style.borderColor = "#d0021b";
    emailEl.style.boxShadow = "0 0 0 3px rgba(208,2,27,.12)";
    emailEl.focus();
    ok = false;
  }
  if (pw.length < 6) {
    pwInput.style.borderColor = "#d0021b";
    pwInput.style.boxShadow = "0 0 0 3px rgba(208,2,27,.12)";
    if (ok) pwInput.focus();
    ok = false;
  }
  if (!ok) return;

  const btn = document.getElementById("btn-login");
  btn.textContent = "Đang đăng nhập...";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = "Đăng nhập";
    btn.disabled = false;
    alert("Đăng nhập thành công!");
    /* TODO: window.location.href = "index.html"; */
  }, 1500);
});

/* Xoá lỗi khi gõ lại */
["email", "password"].forEach((id) => {
  document.getElementById(id)?.addEventListener("input", function () {
    this.style.borderColor = "";
    this.style.boxShadow = "";
  });
});
