// Xử lý slider chính (main__left)
function initMainSlider() {
  const sliderContainer = document.querySelector(".main__left");
  if (!sliderContainer) return;

  const slides = Array.from(
    sliderContainer.querySelectorAll(".main__left--img"),
  );
  const prevBtn = sliderContainer.querySelector(".main__left--prev");
  const nextBtn = sliderContainer.querySelector(".main__left--next");
  const dotsContainer = sliderContainer.querySelector(".main__left--dots");
  if (!slides.length || !prevBtn || !nextBtn || !dotsContainer) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  // Tạo các dot
  dotsContainer.innerHTML = "";
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === currentIndex) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  const dots = Array.from(dotsContainer.querySelectorAll(".dot"));

  function updateSlides() {
    slides.forEach((slide, idx) => {
      slide.style.display = idx === currentIndex ? "block" : "none";
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateSlides();
  }

  prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

  // Ẩn hết slide trừ slide đầu
  updateSlides();

  // Tự động chuyển sau 5 giây
  setInterval(() => goToSlide(currentIndex + 1), 5000);
}

// ==================== Flash Sale Countdown ====================
function initFlashSaleTimer() {
  const timerElement = document.querySelector(".flashsale__header--timer");
  if (!timerElement) return;

  // Đặt thời gian kết thúc sau 2 giờ kể từ lúc load trang (có thể sửa)
  let endTime = new Date();
  endTime.setHours(endTime.getHours() + 2);

  function updateCountdown() {
    const now = new Date();
    const diff = endTime - now;
    if (diff <= 0) {
      timerElement.innerHTML = `<span>Kết thúc</span><span>00</span><span class="sep">:</span><span>00</span><span class="sep">:</span><span>00</span>`;
      return;
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    timerElement.innerHTML = `<span>Kết thúc trong</span>
      <span>${hours.toString().padStart(2, "0")}</span><span class="sep">:</span>
      <span>${minutes.toString().padStart(2, "0")}</span><span class="sep">:</span>
      <span>${seconds.toString().padStart(2, "0")}</span>`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ==================== Tab Switching (Xu hướng, Sách ngoại ngữ, BXH, Combo) ====================
function initTabs() {
  // Xử lý tab "Xu hướng mua sắm"
  const trendTabs = document.querySelector(".seccard__tabs");
  if (trendTabs && trendTabs.closest(".main__seccard")) {
    const tabHeaders = trendTabs.querySelectorAll(".tab");
    const productContainer = trendTabs
      .closest(".main__seccard")
      ?.querySelector(".seccard__products");
    if (tabHeaders.length && productContainer) {
      // Lưu nội dung gốc của từng tab (giả lập dữ liệu - thực tế có thể lấy từ dataset hoặc fetch)
      const tabContents = [
        Array.from(
          productContainer.querySelectorAll(".seccard__products--card"),
        ),
        // Ở đây bạn có thể định nghĩa nội dung cho tab 2,3. Vì demo nên tạm clone lại
      ];
      // Đơn giản: khi click tab, bạn có thể thay đổi nội dung bằng AJAX hoặc hiển thị/ẩn.
      // Do HTML có sẵn nhiều sản phẩm, ta chỉ làm hiệu ứng active cho demo.
      tabHeaders.forEach((tab, idx) => {
        tab.addEventListener("click", () => {
          tabHeaders.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");
          // Ở đây nên gọi hàm load sản phẩm theo danh mục
          console.log(`Chuyển sang tab ${idx + 1} - cần load dữ liệu động`);
        });
      });
    }
  }

  // Xử lý các tab của "Sách ngoại ngữ" (class tương tự)
  const allSecCard = document.querySelectorAll(".main__seccard");
  allSecCard.forEach((sec) => {
    const tabs = sec.querySelector(".seccard__tabs");
    if (!tabs) return;
    const tabItems = tabs.querySelectorAll(".tab");
    if (!tabItems.length) return;
    tabItems.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabItems.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        // Tại đây bạn có thể thay đổi nội dung products tương ứng
      });
    });
  });
}

// ==================== Xem thêm (giả lập load thêm) ====================
function initLoadMore() {
  const moreButtons = document.querySelectorAll(".dieuhuong__btn--more");
  moreButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Chức năng đang được phát triển. Sẽ tải thêm sản phẩm ở đây!");
      // Thực tế bạn sẽ gọi API và thêm sản phẩm vào container phía trước
    });
  });
}

// ==================== Hamburger Menu (Mobile) ====================
function initHamburger() {
  const header = document.querySelector(".header");
  const nav = document.querySelector(".header__nav");
  if (!header || !nav) return;

  // Tạo nút hamburger và chèn vào header (sau logo)
  const logo = header.querySelector(".header__logo");
  const btn = document.createElement("button");
  btn.className = "hamburger-btn";
  btn.setAttribute("aria-label", "Mở menu");
  btn.innerHTML = "&#9776;"; // ☰
  logo.insertAdjacentElement("afterend", btn);

  // Toggle mở/đóng nav khi click
  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    btn.innerHTML = isOpen ? "&#10005;" : "&#9776;"; // ✕ / ☰
    btn.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
  });

  // Đóng nav khi click vào một link bên trong
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      btn.innerHTML = "&#9776;";
    });
  });

  // Đóng nav khi click ra ngoài
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) {
      nav.classList.remove("nav--open");
      btn.innerHTML = "&#9776;";
    }
  });
}

function initAccount() {
  const accLi = document.querySelector(".header__quan-trong li:nth-child(3)");
  if (!accLi) return;

  const panel = document.createElement("div");
  panel.className = "dropdown-panel";
  panel.id = "acc-panel";
  panel.innerHTML = `
    <div class="dropdown-panel__head">
      <div class="acc-avatar"></div>
      <div><div class="acc-name">Xin chào, Bạn!</div><div class="acc-email">Đăng nhập để mua hàng</div></div>
    </div>
    <div class="dropdown-panel__body">
      <a class="acc-menu-item" href="dangnhap.html"><span></span> Đăng nhập</a>
      <a class="acc-menu-item" href="dangky.html"><span></span> Đăng ký</a>
      <hr class="acc-divider"/>
      <a class="acc-menu-item" href="#"><span></span> Đơn hàng của tôi</a>
      <a class="acc-menu-item" href="#"><span></span> Sản phẩm yêu thích</a>
      <a class="acc-menu-item" href="#"><span></span> Cài đặt tài khoản</a>
      <hr class="acc-divider"/>
      <a class="acc-menu-item acc-logout" href="#"><span></span> Đăng xuất</a>
    </div>`;
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

// ==================== Khởi chạy toàn bộ khi DOM sẵn sàng ====================
document.addEventListener("DOMContentLoaded", () => {
  initMainSlider();
  initFlashSaleTimer();
  initTabs();
  initLoadMore();
  initHamburger();

  console.log("Đã khởi tạo giao diện thành công!");
});
