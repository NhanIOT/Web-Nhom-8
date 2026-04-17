// gioithieu.js - Chức năng cho trang giới thiệu
document.addEventListener("DOMContentLoaded", () => {
  // 1. Sticky header (giống index)
  initStickyHeader();

  // 2. Dropdown: thông báo, tài khoản, giỏ hàng (tái sử dụng logic từ index)
  initNotification();
  initAccount();
  initCart();

  // 3. Active nav link
  initNavActiveLink();

  // 4. Có thể thêm hiệu ứng cho slide thuyết trình (nếu có)
  initMemberAnimation();

  function initStickyHeader() {
    const banner = document.querySelector(".banner");
    const header = document.querySelector(".header");
    if (!banner) return;
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        banner.classList.toggle("hidden", y > 60);
        header?.classList.toggle("scrolled", y > 10);
      },
      { passive: true },
    );
  }

  function initNavActiveLink() {
    const links = document.querySelectorAll(".header__nav a");
    const page = location.pathname.split("/").pop() || "gioithieu.html";
    links.forEach((a) => {
      const href = (a.getAttribute("href") || "").split("/").pop();
      if (href === page) a.classList.add("nav-active");
    });
  }

  // Dropdown Thông báo (giả lập)
  function initNotification() {
    const notiLi = document.querySelector(
      ".header__quan-trong li:nth-child(1)",
    );
    if (!notiLi) return;
    // Tạo badge
    const badge = document.createElement("span");
    badge.className = "cart-badge";
    badge.textContent = "3";
    badge.style.display = "flex";
    notiLi.style.position = "relative";
    notiLi.appendChild(badge);

    const panel = document.createElement("div");
    panel.className = "dropdown-panel";
    panel.id = "noti-panel";
    panel.innerHTML = `
      <div class="dropdown-panel__head">
        <span>Thông báo</span>
        <button class="dp-mark-all">Đánh dấu tất cả đã đọc</button>
      </div>
      <div class="dropdown-panel__body">
        <div class="noti-item unread">...</div> <!-- Tương tự index -->
      </div>
      <div class="dropdown-panel__foot"><a href="#">Xem tất cả</a></div>`;
    notiLi.appendChild(panel);
    // Xử lý sự kiện (viết gọn)
    notiLi.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!notiLi.contains(e.target)) panel.classList.remove("open");
    });
  }

  function initAccount() {
    const accLi = document.querySelector(".header__quan-trong li:nth-child(3)");
    if (!accLi) return;
    const panel = document.createElement("div");
    panel.className = "dropdown-panel";
    panel.id = "acc-panel";
    panel.innerHTML = `
      <div class="dropdown-panel__head">...</div>
      <div class="dropdown-panel__body">...</div>`;
    accLi.style.position = "relative";
    accLi.appendChild(panel);
    accLi.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!accLi.contains(e.target)) panel.classList.remove("open");
    });
  }

  function initCart() {
    // Tạm thời có thể tái sử dụng code giỏ hàng từ index (rút gọn)
    const cartLi = document.querySelector(
      ".header__quan-trong li:nth-child(2)",
    );
    if (!cartLi) return;
    // Tạo badge giỏ hàng (đọc localStorage)
    let cart = JSON.parse(localStorage.getItem("bg8_cart") || "[]");
    const badge = document.createElement("span");
    badge.className = "cart-badge";
    cartLi.style.position = "relative";
    cartLi.appendChild(badge);
    const updateBadge = () => {
      const total = cart.reduce((s, c) => s + (c.qty || 1), 0);
      badge.textContent = total > 99 ? "99+" : String(total);
      badge.style.display = total > 0 ? "flex" : "none";
    };
    updateBadge();
    // Panel giỏ hàng (tạo nhanh)
    const panel = document.createElement("div");
    panel.id = "cart-panel";
    panel.innerHTML = `...`; // Có thể copy từ index.js
    document.body.appendChild(panel);
    cartLi.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.toggle("open");
    });
  }

  function initMemberAnimation() {
    // Có thể thêm hiệu ứng fade-in khi scroll
    const members = document.querySelectorAll(
      ".container__gioithieu--member-left, .container__gioithieu--member-right",
    );
    if (members.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.2 },
    );
    members.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  }
});
