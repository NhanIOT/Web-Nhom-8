"use strict";
/* ============================================================
   BOOKGROUP8 — LIENHE.JS
   Dùng cho: lienhe.html
   Bao gồm: header chung (sticky, search, cart, thông báo,
            tài khoản, hamburger, scroll-to-top, nav active)
            + xử lý form liên hệ
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  injectGlobalStyles();
  initStickyHeader();
  initSearch();
  initCart();
  initNotification();
  initAccount();
  initNewsletter();
  initHamburger();
  initScrollToTop();
  initNavActiveLink();
  initContactForm();
});

/* ══════════════════════════════════════════════════════════
   INJECT STYLES DÙNG CHUNG (hamburger, dropdown, cart…)
══════════════════════════════════════════════════════════ */
function injectGlobalStyles() {
  const s = document.createElement("style");
  s.textContent = `
.banner.hidden{max-height:0!important;padding-top:0!important;padding-bottom:0!important}
.header.scrolled{box-shadow:0 4px 16px rgba(0,0,0,.14)!important}
.header__nav a.nav-active{color:var(--p-600,#d0021b)!important;font-weight:700}
.hamburger-btn{display:none;background:none;border:none;font-size:22px;cursor:pointer;color:var(--gray-700,#333);padding:4px 8px;line-height:1}
@media(max-width:768px){
  .hamburger-btn{display:block}
  .header__nav{display:none;position:absolute;top:100%;left:0;right:0;background:#fff;z-index:1000;box-shadow:0 6px 18px rgba(0,0,0,.12);border-top:1px solid #f0f0f0}
  .header__nav.nav--open{display:block}
  .header__nav ul{flex-direction:column!important;padding:8px 0!important;gap:0!important}
  .header__nav ul li a{display:block!important;padding:12px 20px!important;font-size:14px!important;border-bottom:1px solid #f5f5f5}
}
.cart-badge{position:absolute;top:-4px;right:-6px;background:var(--p-500,#e53935);color:#fff;font-size:9px;font-weight:700;min-width:16px;height:16px;border-radius:8px;display:none;align-items:center;justify-content:center;padding:0 3px;z-index:10}
#cart-panel{position:fixed;top:0;right:-360px;width:340px;height:100vh;background:#fff;z-index:9000;box-shadow:-4px 0 24px rgba(0,0,0,.15);display:flex;flex-direction:column;transition:right .3s ease}
#cart-panel.open{right:0}
.cart-panel__head{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #f0f0f0;font-size:15px;font-weight:700}
#cart-panel-close{background:none;border:none;font-size:18px;cursor:pointer;color:#888}
#cart-panel-close:hover{color:var(--p-600,#d0021b)}
.cart-panel__body{flex:1;overflow-y:auto;padding:12px 20px}
.cart-empty{text-align:center;color:#bbb;padding:40px 0;font-size:14px}
.cart-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f5f5f5}
.cart-item:last-child{border-bottom:none}
.cart-item__info{flex:1;min-width:0}
.cart-item__name{font-size:13px;color:#444;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cart-item__price{font-size:12px;color:var(--p-600,#d0021b);font-weight:700;margin-top:3px}
.cart-item__remove{background:none;border:none;color:#bbb;cursor:pointer;font-size:14px;padding:4px}
.cart-item__remove:hover{color:var(--p-600,#d0021b)}
.cart-panel__foot{padding:14px 20px;border-top:1px solid #f0f0f0}
.cart-total{font-size:15px;font-weight:700;margin-bottom:10px}
.cart-checkout{width:100%;padding:11px 0;background:var(--p-600,#d0021b);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;transition:background .2s}
.cart-checkout:hover{background:var(--p-800,#7f0000)}
.dropdown-panel{position:absolute;top:calc(100% + 8px);right:0;width:280px;background:#fff;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.15);z-index:8000;opacity:0;visibility:hidden;transform:translateY(-8px);transition:opacity .2s,transform .2s,visibility .2s;overflow:hidden}
.dropdown-panel.open{opacity:1;visibility:visible;transform:translateY(0)}
.dropdown-panel__head{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;font-weight:700}
.dropdown-panel__body{max-height:280px;overflow-y:auto}
.dropdown-panel__foot{padding:10px 16px;border-top:1px solid #f0f0f0;text-align:center}
.dropdown-panel__foot a{font-size:13px;color:var(--p-600,#d0021b);text-decoration:none}
.dp-mark-all{background:none;border:none;font-size:11.5px;color:var(--p-600,#d0021b);cursor:pointer;margin-left:auto;padding:0;white-space:nowrap}
.noti-item{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border-bottom:1px solid #f5f5f5;cursor:pointer;transition:background .15s}
.noti-item:last-child{border-bottom:none}
.noti-item:hover,.noti-item.unread{background:#fff8f8}
.noti-item.unread .noti-title{font-weight:600}
.noti-icon{font-size:18px;flex-shrink:0;margin-top:2px}
.noti-title{font-size:13px;color:#444;line-height:1.4}
.noti-time{font-size:11px;color:#bbb;margin-top:3px}
.acc-avatar{width:38px;height:38px;border-radius:50%;background:var(--p-100,#ffe0e0);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.acc-name{font-size:14px;font-weight:700}
.acc-email{font-size:11.5px;color:#bbb}
.acc-menu-item{display:flex;align-items:center;gap:10px;padding:11px 16px;font-size:13.5px;color:#444;text-decoration:none;transition:background .15s}
.acc-menu-item:hover{background:#fafafa;color:var(--p-600,#d0021b)}
.acc-divider{border:none;border-top:1px solid #f0f0f0;margin:4px 0}
.acc-logout{color:var(--p-600,#d0021b)!important}
#search-dropdown{position:absolute;top:calc(100% + 2px);left:0;right:0;background:#fff;border:1px solid #e0e0e0;border-radius:0 0 10px 10px;list-style:none;margin:0;padding:0;z-index:2000;box-shadow:0 6px 18px rgba(0,0,0,.12);display:none;max-height:300px;overflow-y:auto}
#search-dropdown li{display:flex;justify-content:space-between;align-items:center;padding:9px 16px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:13px;transition:background .15s}
#search-dropdown li:last-child{border-bottom:none}
#search-dropdown li:hover{background:#fff5f5}
#search-dropdown li small{color:#bbb;margin-left:8px}
#search-dropdown .dd-price{color:var(--p-600,#d0021b);font-weight:700;white-space:nowrap;margin-left:12px}
#search-dropdown mark{background:#fff0a0;border-radius:2px;padding:0 1px}
.nl-error{color:#fff;font-size:11.5px;margin-left:8px;white-space:nowrap}
#scroll-top{position:fixed;bottom:24px;right:20px;z-index:9999;width:44px;height:44px;border-radius:50%;background:var(--p-600,#d0021b);color:#fff;border:none;font-size:24px;cursor:pointer;display:none;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,.2);line-height:1;transition:transform .2s;outline:none}
#scroll-top.visible{display:flex}
#scroll-top:hover{transform:scale(1.1)}
#toast-container{position:fixed;bottom:72px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.toast-item{background:#222;color:#fff;padding:11px 18px;border-radius:8px;font-size:13px;max-width:300px;box-shadow:0 4px 14px rgba(0,0,0,.2);line-height:1.5;opacity:0;transform:translateY(10px);transition:opacity .25s,transform .25s;pointer-events:none}
.toast-item.toast-show{opacity:1;transform:translateY(0)}
`;
  document.head.appendChild(s);
}

/* ══════════════════════════════════════════════════════════
   STICKY HEADER
══════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════
   TÌM KIẾM
══════════════════════════════════════════════════════════ */
function initSearch() {
  const input = document.querySelector(".header__search input");
  const searchBtn = document.querySelector(".header__search button");
  if (!input) return;

  const dropdown = document.createElement("ul");
  dropdown.id = "search-dropdown";
  const wrap = input.closest(".header__search");
  if (wrap) {
    wrap.style.position = "relative";
    wrap.appendChild(dropdown);
  }

  let debounce;
  input.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = input.value.trim().toLowerCase();
      dropdown.style.display = q ? "block" : "none";
      if (q)
        dropdown.innerHTML = `<li style="padding:12px 16px;color:#aaa;font-size:13px;">Nhập để tìm kiếm "<b>${q}</b>"</li>`;
    }, 250);
  });
  document.addEventListener("click", (e) => {
    if (!wrap?.contains(e.target)) dropdown.style.display = "none";
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      dropdown.style.display = "none";
      if (input.value.trim()) showToast(`Tìm: "${input.value.trim()}"`);
    }
    if (e.key === "Escape") dropdown.style.display = "none";
  });
  searchBtn?.addEventListener("click", () => {
    dropdown.style.display = "none";
    if (input.value.trim()) showToast(`Tìm: "${input.value.trim()}"`);
  });
}

/* ══════════════════════════════════════════════════════════
   GIỎ HÀNG
══════════════════════════════════════════════════════════ */
function initCart() {
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("bg8_cart") || "[]");
  } catch (_) {
    cart = [];
  }

  const cartLi = document.querySelector(".header__quan-trong li:nth-child(2)");
  const badge = document.createElement("span");
  badge.className = "cart-badge";
  if (cartLi) {
    cartLi.style.position = "relative";
    cartLi.appendChild(badge);
  }

  const panel = document.createElement("div");
  panel.id = "cart-panel";
  panel.innerHTML = `<div class="cart-panel__head"><span>Giỏ hàng</span><button id="cart-panel-close">✕</button></div><div class="cart-panel__body" id="cart-body"></div><div class="cart-panel__foot"><div class="cart-total" id="cart-total">Tổng: 0đ</div><button class="cart-checkout">Thanh toán</button></div>`;
  document.body.appendChild(panel);

  document
    .getElementById("cart-panel-close")
    ?.addEventListener("click", () => panel.classList.remove("open"));
  panel.querySelector(".cart-checkout")?.addEventListener("click", () => {
    if (!cart.length) {
      showToast("Giỏ hàng đang trống!");
      return;
    }
    showToast("Chuyển đến trang thanh toán...");
  });
  cartLi?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    renderCartPanel();
    panel.classList.toggle("open");
    document.getElementById("noti-panel")?.classList.remove("open");
    document.getElementById("acc-panel")?.classList.remove("open");
  });
  document.addEventListener("click", (e) => {
    if (
      panel.classList.contains("open") &&
      !panel.contains(e.target) &&
      !cartLi?.contains(e.target)
    )
      panel.classList.remove("open");
  });

  function updateBadge() {
    const t = cart.reduce((s, c) => s + (c.qty || 1), 0);
    badge.textContent = t > 99 ? "99+" : String(t);
    badge.style.display = t > 0 ? "flex" : "none";
  }
  function renderCartPanel() {
    const body = document.getElementById("cart-body");
    const total = document.getElementById("cart-total");
    if (!body) return;
    if (!cart.length) {
      body.innerHTML = `<div class="cart-empty">Giỏ hàng trống</div>`;
      if (total) total.textContent = "Tổng: 0đ";
      return;
    }
    body.innerHTML = cart
      .map(
        (item) =>
          `<div class="cart-item"><div class="cart-item__info"><div class="cart-item__name">${item.name}</div><div class="cart-item__price">${item.price} × ${item.qty || 1}</div></div><button class="cart-item__remove" data-remove="${item.id}">✕</button></div>`,
      )
      .join("");
    body.querySelectorAll("[data-remove]").forEach((btn) =>
      btn.addEventListener("click", () => {
        cart = cart.filter((c) => c.id !== btn.dataset.remove);
        localStorage.setItem("bg8_cart", JSON.stringify(cart));
        updateBadge();
        renderCartPanel();
      }),
    );
    const sum = cart.reduce((s, c) => {
      const n =
        parseInt((c.price || "0").replace(/[^0-9]/g, "")) * (c.qty || 1);
      return s + (isNaN(n) ? 0 : n);
    }, 0);
    if (total) total.textContent = `Tổng: ${sum.toLocaleString("vi-VN")}đ`;
  }
  updateBadge();
  window.BG8Cart = {
    getAll: () => [...cart],
    add: (item) => {
      const found = cart.find((c) => c.id === item.id);
      if (found) found.qty = (found.qty || 1) + 1;
      else cart.push({ ...item, qty: 1 });
      localStorage.setItem("bg8_cart", JSON.stringify(cart));
      updateBadge();
      showToast(`Đã thêm "${item.name}" vào giỏ`);
    },
  };
}

/* ══════════════════════════════════════════════════════════
   THÔNG BÁO
══════════════════════════════════════════════════════════ */
function initNotification() {
  const notiLi = document.querySelector(".header__quan-trong li:nth-child(1)");
  if (!notiLi) return;
  const badge = document.createElement("span");
  badge.className = "cart-badge";
  badge.textContent = "3";
  badge.style.display = "flex";
  notiLi.style.position = "relative";
  notiLi.appendChild(badge);

  const panel = document.createElement("div");
  panel.className = "dropdown-panel";
  panel.id = "noti-panel";
  panel.innerHTML = `<div class="dropdown-panel__head"><span>Thông báo</span><button class="dp-mark-all">Đánh dấu tất cả đã đọc</button></div><div class="dropdown-panel__body"><div class="noti-item unread"><div class="noti-icon">🔔</div><div class="noti-content"><div class="noti-title">Flash Sale sắp bắt đầu!</div><div class="noti-time">5 phút trước</div></div></div><div class="noti-item unread"><div class="noti-icon">🎁</div><div class="noti-content"><div class="noti-title">Bạn có phiếu giảm giá mới</div><div class="noti-time">1 giờ trước</div></div></div><div class="noti-item unread"><div class="noti-icon">🚚</div><div class="noti-content"><div class="noti-title">Đơn hàng đang được giao</div><div class="noti-time">2 giờ trước</div></div></div><div class="noti-item"><div class="noti-icon">✅</div><div class="noti-content"><div class="noti-title">Đặt hàng thành công</div><div class="noti-time">Hôm qua</div></div></div></div><div class="dropdown-panel__foot"><a href="#">Xem tất cả thông báo</a></div>`;
  notiLi.appendChild(panel);

  notiLi.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("open");
    document.getElementById("cart-panel")?.classList.remove("open");
    document.getElementById("acc-panel")?.classList.remove("open");
  });
  panel.querySelector(".dp-mark-all")?.addEventListener("click", (e) => {
    e.stopPropagation();
    panel
      .querySelectorAll(".noti-item.unread")
      .forEach((el) => el.classList.remove("unread"));
    badge.style.display = "none";
    showToast("✓ Đã đánh dấu tất cả đã đọc");
  });
  document.addEventListener("click", (e) => {
    if (!notiLi.contains(e.target)) panel.classList.remove("open");
  });
}

/* ══════════════════════════════════════════════════════════
   TÀI KHOẢN
══════════════════════════════════════════════════════════ */
function initAccount() {
  const accLi = document.querySelector(".header__quan-trong li:nth-child(3)");
  if (!accLi) return;
  const panel = document.createElement("div");
  panel.className = "dropdown-panel";
  panel.id = "acc-panel";
  panel.innerHTML = `<div class="dropdown-panel__head"><div class="acc-avatar">👤</div><div><div class="acc-name">Xin chào, Bạn!</div><div class="acc-email">Đăng nhập để mua hàng</div></div></div><div class="dropdown-panel__body"><a class="acc-menu-item" href="dangnhap.html"><span>🔑</span> Đăng nhập</a><a class="acc-menu-item" href="dangky.html"><span>📝</span> Đăng ký</a><hr class="acc-divider"/><a class="acc-menu-item" href="#"><span>📦</span> Đơn hàng của tôi</a><a class="acc-menu-item" href="#"><span>❤️</span> Sản phẩm yêu thích</a><a class="acc-menu-item" href="#"><span>⚙️</span> Cài đặt tài khoản</a><hr class="acc-divider"/><a class="acc-menu-item acc-logout" href="#"><span>🚪</span> Đăng xuất</a></div>`;
  accLi.style.position = "relative";
  accLi.appendChild(panel);

  accLi.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("open");
    document.getElementById("cart-panel")?.classList.remove("open");
    document.getElementById("noti-panel")?.classList.remove("open");
  });
  document.addEventListener("click", (e) => {
    if (!accLi.contains(e.target)) panel.classList.remove("open");
  });
  panel.querySelector(".acc-logout")?.addEventListener("click", (e) => {
    e.preventDefault();
    panel.classList.remove("open");
    showToast("Đã đăng xuất");
  });
}

/* ══════════════════════════════════════════════════════════
   NEWSLETTER
══════════════════════════════════════════════════════════ */
function initNewsletter() {
  const input = document.querySelector(".newsletter-input");
  const btn = document.querySelector(".newsletter-btn");
  if (!input || !btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = input.value.trim();
    document.querySelector(".nl-error")?.remove();
    if (!email) {
      input.style.outline = "2px solid #e53935";
      const err = document.createElement("span");
      err.className = "nl-error";
      err.textContent = "Vui lòng nhập email.";
      input.insertAdjacentElement("afterend", err);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.outline = "2px solid #e53935";
      const err = document.createElement("span");
      err.className = "nl-error";
      err.textContent = "Email không hợp lệ.";
      input.insertAdjacentElement("afterend", err);
      return;
    }
    btn.disabled = true;
    btn.textContent = "Đang xử lý...";
    setTimeout(() => {
      input.value = "";
      input.style.outline = "";
      btn.disabled = false;
      btn.textContent = "ĐĂNG KÝ";
      showToast("Đăng ký thành công!");
    }, 1200);
  });
  input.addEventListener("input", () => {
    document.querySelector(".nl-error")?.remove();
    input.style.outline = "";
  });
}

/* ══════════════════════════════════════════════════════════
   HAMBURGER
══════════════════════════════════════════════════════════ */
function initHamburger() {
  const header = document.querySelector(".header");
  const nav = document.querySelector(".header__nav");
  if (!header || !nav) return;
  const burger = document.createElement("button");
  burger.className = "hamburger-btn";
  burger.innerHTML = "&#9776;";
  burger.setAttribute("aria-label", "Mở menu");
  burger.setAttribute("aria-expanded", "false");
  const logo = header.querySelector(".header__logo");
  logo
    ? logo.insertAdjacentElement("afterend", burger)
    : header.prepend(burger);
  let isOpen = false;
  const close = () => {
    isOpen = false;
    nav.classList.remove("nav--open");
    burger.innerHTML = "&#9776;";
    burger.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    isOpen = true;
    nav.classList.add("nav--open");
    burger.innerHTML = "&#10005;";
    burger.setAttribute("aria-expanded", "true");
  };
  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen ? close() : open();
  });
  document.addEventListener("click", (e) => {
    if (isOpen && !header.contains(e.target)) close();
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      if (isOpen) close();
    }),
  );
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && isOpen) close();
  });
}

/* ══════════════════════════════════════════════════════════
   SCROLL TO TOP
══════════════════════════════════════════════════════════ */
function initScrollToTop() {
  const btn = document.createElement("button");
  btn.id = "scroll-top";
  btn.innerHTML = "&#8679;";
  btn.setAttribute("aria-label", "Lên đầu trang");
  document.body.appendChild(btn);
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("visible", window.scrollY > 320),
    { passive: true },
  );
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

/* ══════════════════════════════════════════════════════════
   NAV ACTIVE LINK
══════════════════════════════════════════════════════════ */
function initNavActiveLink() {
  const links = document.querySelectorAll(".header__nav a");
  if (!links.length) return;
  const page = location.pathname.split("/").pop() || "index.html";
  links.forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === page) a.classList.add("nav-active");
  });
}

/* ══════════════════════════════════════════════════════════
   FORM LIÊN HỆ
══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.querySelector(
    ".lienhe__form, .contact__form, form.form-lienhe",
  );
  if (!form) return;

  const fields = {
    name: form.querySelector("#name, [name='name'], [name='ho-ten']"),
    email: form.querySelector("#email, [name='email']"),
    phone: form.querySelector("#phone, [name='phone'], [name='sdt']"),
    message: form.querySelector(
      "#message, [name='message'], [name='noi-dung']",
    ),
  };

  const submitBtn = form.querySelector(
    "button[type='submit'], .lienhe__submit, .contact__submit",
  );

  const clearError = (el) => {
    if (!el) return;
    el.style.borderColor = "";
    el.style.boxShadow = "";
  };
  const showError = (el, msg) => {
    if (!el) return;
    el.style.borderColor = "#d0021b";
    el.style.boxShadow = "0 0 0 3px rgba(208,2,27,.12)";
    el.focus();
    showToast(msg);
  };

  // Xoá lỗi khi người dùng nhập lại
  Object.values(fields).forEach((el) =>
    el?.addEventListener("input", () => clearError(el)),
  );

  submitBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    Object.values(fields).forEach(clearError);

    if (fields.name && !fields.name.value.trim()) {
      showError(fields.name, "Vui lòng nhập họ tên");
      return;
    }
    if (fields.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) {
        showError(fields.email, "Email không hợp lệ");
        return;
      }
    }
    if (
      fields.phone &&
      fields.phone.value.trim() &&
      !/^[0-9\s+\-()]{7,15}$/.test(fields.phone.value.trim())
    ) {
      showError(fields.phone, "Số điện thoại không hợp lệ");
      return;
    }
    if (fields.message && !fields.message.value.trim()) {
      showError(fields.message, "Vui lòng nhập nội dung");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Đang gửi...";
    }
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Gửi liên hệ";
      }
      form.reset();
      showToast("✓ Đã gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.");
    }, 1500);
  });
}

/* ══════════════════════════════════════════════════════════
   TOAST HELPER
══════════════════════════════════════════════════════════ */
function showToast(msg, ms = 2800) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast-item";
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => toast.classList.add("toast-show")),
  );
  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 300);
  }, ms);
}
