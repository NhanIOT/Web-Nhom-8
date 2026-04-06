/* ============================================================
   BOOKGROUP8 — MAIN.JS
   Chức năng:
     1. Carousel / Banner tự động
     2. Sticky header shrink khi scroll
     3. Flash Sale countdown timer
     4. Tabs switching
     5. Tìm kiếm realtime (DOM + JSON)
     6. Lọc sản phẩm (filter)
     7. Giỏ hàng (thêm / xoá / cập nhật)
     8. Kiểm tra form Newsletter
     9. Menu động (mobile hamburger)
    10. AJAX – load sản phẩm từ JSON
    11. Lazy loading ảnh
    12. Scroll-to-top button
   ============================================================ */

"use strict";

/* ──────────────────────────────────────────────────────────
   0. DOMContentLoaded — khởi tạo tất cả khi DOM sẵn sàng
────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initStickyHeader();
  initFlashSaleTimer();
  initTabs();
  initSearch();
  initCart();
  initNewsletterForm();
  initHamburgerMenu();
  initLazyLoad();
  initScrollToTop();
  loadProductsFromJSON(); // AJAX / JSON
  initFilterButtons(); // Lọc sản phẩm
});

/* ══════════════════════════════════════════════════════════
   1. CAROUSEL — tự chạy + nút prev/next + dots
══════════════════════════════════════════════════════════ */
function initCarousel() {
  const wrapper = document.querySelector(".container__main--left");
  if (!wrapper) return;

  const img = wrapper.querySelector(".main__left--img img");
  const prevBtn = wrapper.querySelector(".main__left--prev");
  const nextBtn = wrapper.querySelector(".main__left--next");
  const dotsWrap = wrapper.querySelector(".main__left--dots");

  // Dữ liệu banner (thực tế lấy từ JSON / API)
  const slides = [
    "asset/img/primary-banner.png",
    "asset/img/banner-slide-2.png",
    "asset/img/banner-slide-3.png",
    "asset/img/banner-slide-4.png",
  ];

  let current = 0;
  let autoTimer = null;

  // Tạo dots động theo số slide
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function updateSlide() {
    if (img) {
      img.style.opacity = "0";
      setTimeout(() => {
        img.src = slides[current];
        img.style.opacity = "1";
      }, 200);
    }

    if (dotsWrap) {
      dotsWrap
        .querySelectorAll(".dot")
        .forEach((d, i) => d.classList.toggle("active", i === current));
    }
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    updateSlide();
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }

  if (img) img.style.transition = "opacity 0.3s ease";
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));

  // Swipe cảm ứng
  let touchStartX = 0;
  wrapper.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );
  wrapper.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  resetAuto();
}

/* ══════════════════════════════════════════════════════════
   2. STICKY HEADER — thu nhỏ khi scroll xuống
══════════════════════════════════════════════════════════ */
function initStickyHeader() {
  const sticky = document.querySelector(".container__sticky");
  const banner = document.querySelector(".container__banner");
  if (!sticky) return;

  let lastY = 0;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;

      // Ẩn top-banner khi scroll > 60px
      if (banner) {
        banner.style.maxHeight = y > 60 ? "0" : "50px";
        banner.style.overflow = "hidden";
        banner.style.transition = "max-height 0.3s ease";
        banner.style.padding = y > 60 ? "0" : "";
      }

      // Thêm class shadow khi scroll
      sticky.classList.toggle("scrolled", y > 10);

      lastY = y;
    },
    { passive: true },
  );
}

/* ══════════════════════════════════════════════════════════
   3. FLASH SALE COUNTDOWN TIMER
══════════════════════════════════════════════════════════ */
function initFlashSaleTimer() {
  const hEl = document.getElementById("t-h");
  const mEl = document.getElementById("t-m");
  const sEl = document.getElementById("t-s");
  if (!hEl || !mEl || !sEl) return;

  // Lưu thời điểm kết thúc vào sessionStorage để không reset khi F5
  const KEY = "flashSaleEnd";
  let endTime = parseInt(sessionStorage.getItem(KEY));

  if (!endTime || endTime < Date.now()) {
    // Flash sale kéo dài 2 tiếng từ lúc vào trang
    endTime = Date.now() + 2 * 60 * 60 * 1000;
    sessionStorage.setItem(KEY, endTime);
  }

  function tick() {
    const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;

    hEl.textContent = String(h).padStart(2, "0");
    mEl.textContent = String(m).padStart(2, "0");
    sEl.textContent = String(s).padStart(2, "0");

    if (diff === 0) {
      clearInterval(timer);
      document
        .querySelector(".container__main--flash-sale")
        ?.classList.add("flash-sale--ended");
    }
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* ══════════════════════════════════════════════════════════
   4. TABS — chuyển tab nội dung
══════════════════════════════════════════════════════════ */
function initTabs() {
  document.querySelectorAll(".tabs").forEach((tabGroup) => {
    tabGroup.querySelectorAll(".tab").forEach((tab, idx) => {
      tab.addEventListener("click", () => {
        // Deactivate tất cả
        tabGroup
          .querySelectorAll(".tab")
          .forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Tìm content tương ứng (nếu có)
        const section = tabGroup.closest(
          ".sec-card, .container__main--danhmuc-sanpham, .container__main--giftcard",
        );
        const contents = section?.querySelectorAll("[data-tab-content]");
        if (contents && contents.length) {
          contents.forEach((c, i) => {
            c.style.display = i === idx ? "block" : "none";
          });
        }
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════
   5. TÌM KIẾM REALTIME (DOM + dữ liệu JSON giả lập)
══════════════════════════════════════════════════════════ */
function initSearch() {
  const input = document.querySelector(".container__header--search input");
  const searchBtn = document.querySelector(".container__header--search button");
  if (!input) return;

  // Tạo dropdown gợi ý
  const dropdown = document.createElement("ul");
  dropdown.className = "search-dropdown";
  dropdown.style.cssText = `
    position:absolute; top:100%; left:0; right:0;
    background:#fff; border:1px solid #e0e0e0; border-radius:0 0 8px 8px;
    list-style:none; margin:0; padding:0; z-index:999;
    box-shadow:0 4px 12px rgba(0,0,0,0.1); display:none; max-height:320px; overflow-y:auto;
  `;

  const searchWrap = input.closest(".container__header--search");
  if (searchWrap) {
    searchWrap.style.position = "relative";
    searchWrap.appendChild(dropdown);
  }

  // Dữ liệu giả — thực tế fetch từ API
  const BOOKS = [
    { id: 1, name: "Đắc Nhân Tâm", price: "68.000đ", cat: "Kỹ năng" },
    { id: 2, name: "Nhà Giả Kim", price: "79.000đ", cat: "Văn học" },
    { id: 3, name: "Tuổi Trẻ Đáng Giá", price: "95.000đ", cat: "Kỹ năng" },
    { id: 4, name: "Sapiens", price: "189.000đ", cat: "Lịch sử" },
    { id: 5, name: "Atomic Habits", price: "145.000đ", cat: "Kỹ năng" },
    { id: 6, name: "Harry Potter", price: "230.000đ", cat: "Văn học" },
    { id: 7, name: "Lập Trình Python", price: "120.000đ", cat: "Khoa học" },
    { id: 8, name: "Triết Học Aristotle", price: "98.000đ", cat: "Triết học" },
    { id: 9, name: "Tôi Tài Giỏi", price: "75.000đ", cat: "Thiếu nhi" },
    { id: 10, name: "Thế Giới Phẳng", price: "110.000đ", cat: "Kinh tế" },
  ];

  let debounceTimer;

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        dropdown.style.display = "none";
        return;
      }

      const results = BOOKS.filter((b) => b.name.toLowerCase().includes(q));
      renderDropdown(results, q);
    }, 280);
  });

  function renderDropdown(results, q) {
    dropdown.innerHTML = "";
    if (!results.length) {
      dropdown.innerHTML = `<li style="padding:12px 16px;color:#999;font-size:13px;">Không tìm thấy kết quả</li>`;
    } else {
      results.forEach((book) => {
        const li = document.createElement("li");
        li.style.cssText =
          "display:flex;justify-content:space-between;align-items:center;padding:10px 16px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:13px;";
        li.innerHTML = `
          <span>
            <strong style="color:#d0021b">${highlight(book.name, q)}</strong>
            <small style="color:#aaa;margin-left:8px;">${book.cat}</small>
          </span>
          <span style="color:#d0021b;font-weight:700;">${book.price}</span>
        `;
        li.addEventListener("click", () => {
          input.value = book.name;
          dropdown.style.display = "none";
          performSearch(book.name);
        });
        li.addEventListener(
          "mouseenter",
          () => (li.style.background = "#fff5f5"),
        );
        li.addEventListener("mouseleave", () => (li.style.background = "#fff"));
        dropdown.appendChild(li);
      });
    }
    dropdown.style.display = "block";
  }

  function highlight(text, q) {
    const re = new RegExp(`(${q})`, "gi");
    return text.replace(
      re,
      `<mark style="background:#fff0a0;border-radius:2px;">$1</mark>`,
    );
  }

  // Ẩn dropdown khi click ra ngoài
  document.addEventListener("click", (e) => {
    if (!searchWrap?.contains(e.target)) dropdown.style.display = "none";
  });

  // Bấm Enter hoặc nút search
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      dropdown.style.display = "none";
      performSearch(input.value.trim());
    }
  });

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      dropdown.style.display = "none";
      performSearch(input.value.trim());
    });
  }

  function performSearch(query) {
    if (!query) return;
    console.log("[Search]", query);
    // TODO: điều hướng đến trang kết quả — ví dụ:
    // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    alert(`Tìm kiếm: "${query}"`);
  }
}

/* ══════════════════════════════════════════════════════════
   6. LỌC SẢN PHẨM
══════════════════════════════════════════════════════════ */
function initFilterButtons() {
  // Áp dụng cho mọi nhóm tabs có data-filter trên section
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const target = document.querySelector(group.dataset.filterTarget);
    if (!target) return;

    group.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        group
          .querySelectorAll("[data-filter]")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        target.querySelectorAll("[data-cat]").forEach((card) => {
          const show = filter === "all" || card.dataset.cat === filter;
          card.style.display = show ? "" : "none";

          // Animation nhẹ
          if (show) {
            card.style.animation = "fadeIn .25s ease";
          }
        });
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════
   7. GIỎ HÀNG — thêm / xoá / badge cập nhật
══════════════════════════════════════════════════════════ */
function initCart() {
  // Lấy giỏ hàng từ localStorage
  let cart = JSON.parse(localStorage.getItem("bg8_cart") || "[]");

  const cartBadge = document.querySelector(".cart-badge");
  updateBadge();

  // Lắng nghe nút "Thêm vào giỏ" trên mọi product card
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn) return;

    const card = btn.closest("[data-product-id]");
    const id = card?.dataset.productId || Date.now().toString();
    const name = card?.dataset.productName || "Sản phẩm";
    const price = card?.dataset.productPrice || "0";
    const img =
      card?.querySelector(".prod-thumb img, .flash-sale__product--element img")
        ?.src || "";

    addToCart({ id, name, price, img });
  });

  function addToCart(item) {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    save();
    updateBadge();
    showToast(`✓ Đã thêm "${item.name}" vào giỏ hàng`);
  }

  function removeFromCart(id) {
    cart = cart.filter((c) => c.id !== id);
    save();
    updateBadge();
  }

  function save() {
    localStorage.setItem("bg8_cart", JSON.stringify(cart));
  }

  function updateBadge() {
    const total = cart.reduce((sum, c) => sum + (c.qty || 1), 0);
    if (cartBadge) {
      cartBadge.textContent = total;
      cartBadge.style.display = total > 0 ? "flex" : "none";
    }

    // Cập nhật badge trên nav icon giỏ hàng
    const navCart = document.querySelector("[data-nav='cart'] .badge-count");
    if (navCart) navCart.textContent = total;
  }

  // Expose để các module khác dùng
  window.BG8Cart = {
    add: addToCart,
    remove: removeFromCart,
    getAll: () => cart,
  };
}

/* ══════════════════════════════════════════════════════════
   8. KIỂM TRA FORM NEWSLETTER
══════════════════════════════════════════════════════════ */
function initNewsletterForm() {
  const form = document.querySelector(".newsletter");
  const input = document.querySelector(".newsletter-input");
  const btn = document.querySelector(".newsletter-btn");
  if (!input || !btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = input.value.trim();
    const error = validateEmail(email);

    // Xoá lỗi cũ
    form?.querySelector(".newsletter-error")?.remove();

    if (error) {
      showFieldError(input, error);
      return;
    }

    // Giả lập gửi đi (thực tế dùng fetch/AJAX)
    btn.disabled = true;
    btn.textContent = "Đang xử lý...";

    setTimeout(() => {
      input.value = "";
      btn.disabled = false;
      btn.textContent = "ĐĂNG KÝ";
      showToast("🎉 Đăng ký nhận bản tin thành công!");
    }, 1200);
  });

  // Xoá lỗi khi người dùng gõ lại
  input.addEventListener("input", () => {
    form?.querySelector(".newsletter-error")?.remove();
    input.style.borderColor = "";
  });

  function validateEmail(email) {
    if (!email) return "Vui lòng nhập địa chỉ email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email không hợp lệ.";
    return null;
  }

  function showFieldError(field, msg) {
    field.style.borderColor = "#e53935";
    const err = document.createElement("span");
    err.className = "newsletter-error";
    err.textContent = msg;
    err.style.cssText = "color:#fff;font-size:11.5px;margin-left:8px;";
    field.insertAdjacentElement("afterend", err);
  }
}

/* ══════════════════════════════════════════════════════════
   9. MENU ĐỘNG — HAMBURGER (mobile)
══════════════════════════════════════════════════════════ */
function initHamburgerMenu() {
  const header = document.querySelector(".container__header");
  const nav = document.querySelector(".container__header--danh-muc");
  if (!header || !nav) return;

  // Tạo nút hamburger
  const burger = document.createElement("button");
  burger.className = "hamburger-btn";
  burger.innerHTML = "&#9776;";
  burger.setAttribute("aria-label", "Mở menu");
  burger.style.cssText = `
    display:none; background:none; border:none; font-size:22px;
    color:#333; cursor:pointer; padding:4px 8px; border-radius:4px;
    line-height:1;
  `;

  // Chèn sau logo
  const logo = header.querySelector(".container__header--logo");
  logo
    ? logo.insertAdjacentElement("afterend", burger)
    : header.prepend(burger);

  // Style cho mobile nav khi mở
  nav.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
  nav.style.overflow = "hidden";

  let isOpen = false;

  function closeMobileMenu() {
    isOpen = false;
    nav.style.maxHeight = "0";
    nav.style.opacity = "0";
    nav.style.display = "none";
    burger.innerHTML = "&#9776;";
    burger.setAttribute("aria-expanded", "false");
  }

  function openMobileMenu() {
    isOpen = true;
    nav.style.display = "block";
    nav.style.maxHeight = "300px";
    nav.style.opacity = "1";
    burger.innerHTML = "&#10005;";
    burger.setAttribute("aria-expanded", "true");
  }

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  // Đóng khi click ra ngoài
  document.addEventListener("click", (e) => {
    if (isOpen && !header.contains(e.target)) closeMobileMenu();
  });

  // Responsive: chỉ hiện hamburger trên mobile
  function checkWidth() {
    if (window.innerWidth <= 768) {
      burger.style.display = "block";
      if (!isOpen) nav.style.display = "none";

      // Mobile nav dọc
      const ul = nav.querySelector("ul");
      if (ul) {
        ul.style.cssText = `
          flex-direction:column; padding:10px 0; gap:0;
          background:#fff; border-top:1px solid #f0f0f0;
        `;
        ul.querySelectorAll("a").forEach((a) => {
          a.style.cssText = "display:block;padding:10px 20px;font-size:14px;";
        });
      }
    } else {
      burger.style.display = "none";
      nav.style.display = "";
      nav.style.maxHeight = "";
      nav.style.opacity = "";
    }
  }

  checkWidth();
  window.addEventListener("resize", checkWidth);
}

/* ══════════════════════════════════════════════════════════
   10. AJAX — Load sản phẩm từ JSON
══════════════════════════════════════════════════════════ */
async function loadProductsFromJSON() {
  // Giả lập fetch từ API endpoint
  // Thực tế: const res = await fetch("/api/products.json");
  const fakeJSON = {
    flashSale: [
      {
        id: "fs1",
        name: "Đắc Nhân Tâm",
        price: "68.000đ",
        originalPrice: "85.000đ",
        discount: "-20%",
        img: "asset/img/flash-sale-1.png",
      },
      {
        id: "fs2",
        name: "Nhà Giả Kim",
        price: "55.000đ",
        originalPrice: "79.000đ",
        discount: "-30%",
        img: "asset/img/flash-sale-2.png",
      },
      {
        id: "fs3",
        name: "Atomic Habits",
        price: "99.000đ",
        originalPrice: "145.000đ",
        discount: "-32%",
        img: "asset/img/flash-sale-3.png",
      },
      {
        id: "fs4",
        name: "Sapiens",
        price: "120.000đ",
        originalPrice: "189.000đ",
        discount: "-36%",
        img: "asset/img/flash-sale-4.png",
      },
    ],
    trending: [
      {
        id: "t1",
        name: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
        price: "95.000đ",
        cat: "ky-nang",
        img: "",
      },
      {
        id: "t2",
        name: "Tôi Tài Giỏi",
        price: "75.000đ",
        cat: "thieu-nhi",
        img: "",
      },
      {
        id: "t3",
        name: "Lập Trình Python Cơ Bản",
        price: "120.000đ",
        cat: "khoa-hoc",
        img: "",
      },
      {
        id: "t4",
        name: "Harry Potter Tập 1",
        price: "95.000đ",
        cat: "van-hoc",
        img: "",
      },
      {
        id: "t5",
        name: "Thế Giới Phẳng",
        price: "110.000đ",
        cat: "kinh-te",
        img: "",
      },
      {
        id: "t6",
        name: "Dám Nghĩ Lớn",
        price: "89.000đ",
        cat: "ky-nang",
        img: "",
      },
    ],
  };

  // Giả lập delay mạng 500ms
  await new Promise((r) => setTimeout(r, 500));

  renderFlashSaleProducts(fakeJSON.flashSale);
  renderTrendingProducts(fakeJSON.trending);
}

function renderFlashSaleProducts(products) {
  const container = document.querySelector(".main__flash-sale--products");
  if (!container) return;

  // Chỉ thêm vào nếu container rỗng (tránh duplicate)
  if (container.children.length > 0) return;

  container.innerHTML = "";
  products.forEach((p) => {
    const el = document.createElement("div");
    el.className = "flash-sale__product--element";
    el.dataset.productId = p.id;
    el.dataset.productName = p.name;
    el.dataset.productPrice = p.price;
    el.innerHTML = `
      <img src="${p.img}" alt="${p.name}" loading="lazy" />
      <div class="product__sale"><span class="sale__percent">${p.discount}</span></div>
      <span class="product__name">${p.name}</span>
      <span class="product__price">${p.price}</span>
      <button class="product__add-btn" data-add-to-cart style="
        width:100%;padding:7px;background:#d0021b;color:#fff;border:none;
        font-size:12px;font-weight:600;cursor:pointer;margin-top:auto;
        transition:background .2s;
      ">Thêm vào giỏ</button>
    `;
    el.querySelector(".product__add-btn")?.addEventListener(
      "mouseenter",
      function () {
        this.style.background = "#a00014";
      },
    );
    el.querySelector(".product__add-btn")?.addEventListener(
      "mouseleave",
      function () {
        this.style.background = "#d0021b";
      },
    );
    container.appendChild(el);
  });
}

function renderTrendingProducts(products) {
  const grid = document.querySelector(".prod-grid");
  if (!grid || grid.children.length > 0) return;

  grid.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "prod-card";
    card.dataset.cat = p.cat;
    card.dataset.productId = p.id;
    card.dataset.productName = p.name;
    card.dataset.productPrice = p.price;
    card.innerHTML = `
      <div class="prod-thumb ph">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        <div class="badge">${p.price}</div>
      </div>
      <div class="prod-info">
        <div class="prod-name">${p.name}</div>
        <button data-add-to-cart style="
          margin-top:6px;width:100%;padding:6px;background:#d0021b;
          color:#fff;border:none;border-radius:4px;font-size:11.5px;
          font-weight:600;cursor:pointer;
        ">+ Giỏ hàng</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════════════
   11. LAZY LOADING ẢNH
══════════════════════════════════════════════════════════ */
function initLazyLoad() {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          obs.unobserve(img);
        });
      },
      { rootMargin: "200px" },
    );

    document
      .querySelectorAll("img[data-src]")
      .forEach((img) => observer.observe(img));
  } else {
    // Fallback: load tất cả luôn
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = img.dataset.src;
    });
  }
}

/* ══════════════════════════════════════════════════════════
   12. SCROLL-TO-TOP BUTTON
══════════════════════════════════════════════════════════ */
function initScrollToTop() {
  const btn = document.createElement("button");
  btn.id = "scroll-top-btn";
  btn.innerHTML = "&#8679;";
  btn.setAttribute("aria-label", "Lên đầu trang");
  btn.style.cssText = `
    position:fixed; bottom:24px; right:20px; z-index:999;
    width:42px; height:42px; border-radius:50%;
    background:#d0021b; color:#fff; border:none;
    font-size:22px; cursor:pointer; display:none;
    align-items:center; justify-content:center;
    box-shadow:0 3px 12px rgba(0,0,0,0.2);
    transition:opacity 0.3s, transform 0.2s;
    line-height:1;
  `;
  document.body.appendChild(btn);

  window.addEventListener(
    "scroll",
    () => {
      const show = window.scrollY > 300;
      btn.style.display = show ? "flex" : "none";
      btn.style.opacity = show ? "1" : "0";
    },
    { passive: true },
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  btn.addEventListener(
    "mouseenter",
    () => (btn.style.transform = "scale(1.1)"),
  );
  btn.addEventListener("mouseleave", () => (btn.style.transform = "scale(1)"));
}

/* ══════════════════════════════════════════════════════════
   HELPER — Toast thông báo
══════════════════════════════════════════════════════════ */
function showToast(message, duration = 2800) {
  // Tạo container nếu chưa có
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position:fixed; bottom:72px; right:20px; z-index:9999;
      display:flex; flex-direction:column; gap:8px; pointer-events:none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    background:#222; color:#fff; padding:11px 18px; border-radius:8px;
    font-size:13px; box-shadow:0 4px 14px rgba(0,0,0,0.2);
    opacity:0; transform:translateY(10px);
    transition:opacity 0.25s, transform 0.25s;
    pointer-events:none; max-width:300px; line-height:1.4;
  `;
  container.appendChild(toast);

  // Animate vào
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });
  });

  // Animate ra và xoá
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ══════════════════════════════════════════════════════════
   CSS animation fadeIn (inject vào <head>)
══════════════════════════════════════════════════════════ */
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .scrolled { box-shadow: 0 3px 12px rgba(0,0,0,0.14) !important; }
  .flash-sale--ended .flash-sale__header h2::after {
    content: " (Đã kết thúc)";
    font-size: 11px;
    font-weight: 400;
    opacity: 0.8;
  }
`;
document.head.appendChild(styleSheet);
