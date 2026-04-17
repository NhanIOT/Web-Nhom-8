// dangky.js - Xử lý form đăng ký
document.addEventListener("DOMContentLoaded", () => {
  // Toggle hiện/ẩn mật khẩu
  const togglePassword = (inputId, toggleIconSelector) => {
    const input = document.getElementById(inputId);
    const toggleBtn = document.querySelector(toggleIconSelector);
    if (!input || !toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      const img = toggleBtn.querySelector("img");
      if (img) img.style.opacity = isHidden ? "0.8" : "0.4";
    });
  };

  togglePassword("password", ".input__icon--showpass");
  togglePassword("confirm-password", ".input__icon--showcfpass");

  // Xử lý submit form
  const form = document.querySelector(".signin__left");
  const submitBtn = document.querySelector(".signin__left--finalbtn");
  const inputs = {
    lastName: document.getElementById("lastname"),
    firstName: document.getElementById("firstname"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirm-password"),
    agree: document.getElementById("agree"),
  };

  const clearErrors = () => {
    document
      .querySelectorAll(
        ".signin__left--name input, .signin__left--email input, .signin__left--password input, .signin__left--confirm-password input",
      )
      .forEach((el) => {
        el.style.borderColor = "";
        el.style.boxShadow = "";
      });
  };

  const showError = (element, message) => {
    element.style.borderColor = "#d0021b";
    element.style.boxShadow = "0 0 0 3px rgba(208,2,27,0.12)";
    element.focus();
    // Có thể thêm toast thông báo
    showToast(message);
  };

  const showToast = (msg) => {
    alert(msg); // Đơn giản dùng alert, có thể thay bằng toast như index.js
  };

  submitBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    clearErrors();

    // Validate
    if (!inputs.lastName.value.trim()) {
      showError(inputs.lastName, "Vui lòng nhập họ");
      return;
    }
    if (!inputs.firstName.value.trim()) {
      showError(inputs.firstName, "Vui lòng nhập tên");
      return;
    }
    const email = inputs.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError(inputs.email, "Email không hợp lệ");
      return;
    }
    const password = inputs.password.value;
    if (password.length < 8) {
      showError(inputs.password, "Mật khẩu tối thiểu 8 ký tự");
      return;
    }
    if (password !== inputs.confirmPassword.value) {
      showError(inputs.confirmPassword, "Mật khẩu xác nhận không khớp");
      return;
    }
    if (!inputs.agree.checked) {
      showToast("Bạn phải đồng ý với điều khoản");
      inputs.agree.focus();
      return;
    }

    // Giả lập gửi form
    submitBtn.disabled = true;
    submitBtn.textContent = "Đang xử lý...";
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Tạo tài khoản";
      alert("Đăng ký thành công! (Mô phỏng)");
      // window.location.href = 'dangnhap.html';
    }, 1500);
  });

  // Xóa lỗi khi người dùng nhập lại
  Object.values(inputs).forEach((input) => {
    if ((input && input.tagName !== "INPUT") || input.type === "checkbox")
      return;
    input?.addEventListener("input", function () {
      this.style.borderColor = "";
      this.style.boxShadow = "";
    });
  });
});
