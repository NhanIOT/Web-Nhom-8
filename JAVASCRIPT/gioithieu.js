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

// ==================== Khởi chạy toàn bộ khi DOM sẵn sàng ====================
document.addEventListener("DOMContentLoaded", () => {
  initMainSlider();
  initFlashSaleTimer();
  initTabs();
  initLoadMore();

  // Xử lý lỗi thường gặp: nếu thiếu ảnh thì không báo lỗi console
  console.log("Đã khởi tạo giao diện thành công!");
});
