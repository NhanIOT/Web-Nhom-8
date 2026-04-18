// ==================== dangnhap.js ====================
document.addEventListener("DOMContentLoaded", () => {
  // --- Toggle hiện/ẩn mật khẩu (theo đúng id trong HTML) ---
  const togglePassword = () => {
    const pwInput = document.getElementById("password");
    const toggleBtn = document.getElementById("toggle-pw");
    if (!pwInput || !toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
      const isHidden = pwInput.type === "password";
      pwInput.type = isHidden ? "text" : "password";
      const img = toggleBtn.querySelector("img");
      if (img) {
        // Thay đổi opacity hoặc src nếu muốn
        img.style.opacity = isHidden ? "0.8" : "0.4";
      }
    });
  };
  togglePassword();

  // --- Validate và submit ---
  const loginBtn = document.getElementById("btn-login");
  const emailEl = document.getElementById("email");
  const pwInput = document.getElementById("password");

  if (!loginBtn || !emailEl || !pwInput) return;

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const email = emailEl.value.trim();
    const password = pwInput.value;
    let ok = true;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailEl.style.borderColor = "#d0021b";
      emailEl.style.boxShadow = "0 0 0 3px rgba(208,2,27,.12)";
      emailEl.focus();
      ok = false;
    } else {
      emailEl.style.borderColor = "";
      emailEl.style.boxShadow = "";
    }

    // Validate password (ít nhất 6 ký tự)
    if (password.length < 6) {
      pwInput.style.borderColor = "#d0021b";
      pwInput.style.boxShadow = "0 0 0 3px rgba(208,2,27,.12)";
      if (ok) pwInput.focus();
      ok = false;
    } else {
      pwInput.style.borderColor = "";
      pwInput.style.boxShadow = "";
    }

    if (!ok) return;

    // Giả lập đăng nhập thành công
    loginBtn.textContent = "Đang đăng nhập...";
    loginBtn.disabled = true;
    setTimeout(() => {
      loginBtn.textContent = "Đăng nhập";
      loginBtn.disabled = false;
      alert("Đăng nhập thành công!");
      // Lưu trạng thái (tuỳ chọn)
      localStorage.setItem("isLoggedIn", "true");
      // Chuyển hướng về trang chủ (bỏ comment khi muốn)
      // window.location.href = "index.html";
    }, 1500);
  });

  // --- Xoá lỗi khi người dùng gõ lại ---
  const clearErrorOnInput = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", function () {
        this.style.borderColor = "";
        this.style.boxShadow = "";
      });
    }
  };
  clearErrorOnInput("email");
  clearErrorOnInput("password");
});
