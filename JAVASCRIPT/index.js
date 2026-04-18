"use strict";

/* ============================================================
   BOOKGROUP8 — INDEX.JS
   1.  Carousel hero banner (multi-slide HTML)
   2.  Sticky header
   3.  Flash Sale countdown timer
   4.  Tabs switching
   5.  Tìm kiếm realtime + dropdown
   6.  Giỏ hàng — badge + mini panel
   7.  Thông báo — dropdown panel
   8.  Tài khoản — dropdown panel
   9.  Newsletter validate
   10. Hamburger menu mobile
   11. Scroll-to-top
   12. Lazy load ảnh
   13. Arrow buttons cuộn ngang
   14. Ranking click
   15. Nav active link
   16. Theloai marquee (tự tạo track từ elements)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  injectGlobalStyles();
  initCarousel();
  initStickyHeader();
  initFlashSaleTimer();
  initTabs();
  initSearch();
  initCart();
  initNotification();
  initAccount();
  initNewsletter();
  initHamburger();
  initScrollToTop();
  initLazyLoad();
  initArrowButtons();
  initRanking();
  initNavActiveLink();
  initTheloaiMarquee();
});

/* CAROUSEL */
function initCarousel() {
  const wrapper = document.querySelector(".main__left");
  if (!wrapper) return;

  const slideEls = [...wrapper.querySelectorAll(".main__left--img")];
  if (!slideEls.length) return;

  const prevBtn = wrapper.querySelector(".main__left--prev");
  const nextBtn = wrapper.querySelector(".main__left--next");
  const dotsWrap = wrapper.querySelector(".main__left--dots");

  let cur = 0,
    timer = null;

  slideEls.forEach((el, i) => {
    el.style.opacity = i === 0 ? "1" : "0";
    el.style.transition = "opacity 0.35s ease";
    el.style.position = "absolute";
    el.style.inset = "0";
    el.style.width = "100%";
    el.style.height = "100%";
  });

  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slideEls.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function updateUI() {
    slideEls.forEach((el, i) => {
      el.style.opacity = i === cur ? "1" : "0";
    });
    dotsWrap
      ?.querySelectorAll(".dot")
      .forEach((d, i) => d.classList.toggle("active", i === cur));
  }
  function goTo(idx) {
    cur = ((idx % slideEls.length) + slideEls.length) % slideEls.length;
    updateUI();
    resetAuto();
  }
  function resetAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(cur + 1), 4500);
  }

  prevBtn?.addEventListener("click", () => goTo(cur - 1));
  nextBtn?.addEventListener("click", () => goTo(cur + 1));

  let tx = 0;
  wrapper.addEventListener(
    "touchstart",
    (e) => {
      tx = e.touches[0].clientX;
    },
    { passive: true },
  );
  wrapper.addEventListener("touchend", (e) => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? cur + 1 : cur - 1);
  });
  wrapper.addEventListener("mouseenter", () => clearInterval(timer));
  wrapper.addEventListener("mouseleave", () => resetAuto());

  updateUI();
  resetAuto();
}

/* STICKY HEADER */
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

/* FLASH SALE TIMES */
function initFlashSaleTimer() {
  const timerWrap = document.querySelector(".flashsale__header--timer");
  if (!timerWrap) return;
  const numSpans = [...timerWrap.querySelectorAll("span:not(.sep)")].slice(1);
  if (numSpans.length < 3) return;
  const [hEl, mEl, sEl] = numSpans;

  const KEY = "bg8_flashEnd";
  let endTime = parseInt(sessionStorage.getItem(KEY) || "0");
  if (!endTime || endTime < Date.now()) {
    endTime = Date.now() + 2 * 3600 * 1000;
    sessionStorage.setItem(KEY, String(endTime));
  }
  function tick() {
    const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    hEl.textContent = String(Math.floor(diff / 3600)).padStart(2, "0");
    mEl.textContent = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    sEl.textContent = String(diff % 60).padStart(2, "0");
    if (diff === 0) {
      clearInterval(id);
      document
        .querySelector(".main__flashsale")
        ?.classList.add("flashsale--ended");
    }
  }
  tick();
  const id = setInterval(tick, 1000);
}

/* TABS */
function initTabs() {
  document.querySelectorAll(".seccard__tabs").forEach((group) => {
    group.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        group
          .querySelectorAll(".tab")
          .forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
      });
    });
  });
}

/* TÌM KIẾM */
function initSearch() {
  const input = document.querySelector(".header__search input");
  const searchBtn = document.querySelector(".header__search button");
  if (!input) return;

  const BOOKS = [
    { name: "Khế Ước Bán Dâu", price: "99.000", cat: "Kinh Dị" },
    { name: "Lời Tiên Tri Cuối Cùng", price: "99.000", cat: "Kinh Dị" },
    { name: "Nhà Tù Shawshank", price: "99.000", cat: "Kinh Dị" },
    { name: "Sĩ Số Lớp Vắng 0", price: "99.000", cat: "Kinh Dị" },
    { name: "Tổng Đài Kể Chuyện Lúc 0h", price: "99.000", cat: "Kinh Dị" },

    { name: "Chiến tranh Việt Nam", price: "89.000", cat: "Ký Sử" },
    { name: "Đà Lạt", price: "59.000", cat: "Ký Sử" },
    { name: "Đi Dọc Hà Nội", price: "69.000", cat: "Ký Sử" },
    { name: "Mãi Mãi Tuổi 20", price: "49.000", cat: "Ký Sử" },
    { name: "Sài Gòn", price: "56.000", cat: "Ký Sử" },
    { name: "Theo Dấu Chân Người", price: "86.000", cat: "Ký Sử" },

    { name: "Bến Xe", price: "299.000", cat: "Ngôn Tình" },
    { name: "Cà Phê Đợi Một Người", price: "199.000", cat: "Ngôn Tình" },
    { name: "Kết Thúc Của Chúng Ta", price: "245.000", cat: "Ngôn Tình" },
    { name: "Ngoảnh Lại Đã Một Đời ", price: "399.000", cat: "Ngôn Tình" },
    { name: "Phút Giây Gặp Gỡ", price: "199.000", cat: "Ngôn Tình" },

    { name: "Conan", price: "19.000", cat: "Truyện Tranh" },
    { name: "Doraemon", price: "19.000", cat: "Truyện Tranh" },
    { name: "Shin", price: "19.000", cat: "Truyện Tranh" },
    { name: "Spy Family", price: "19.000", cat: "Truyện Tranh" },
    { name: "TonTon Friends", price: "19.000", cat: "Truyện Tranh" },

    {
      name: "Art ofMemoir Mary Karr",
      price: "199.000",
      cat: "Sách Nước Ngoài",
    },
    {
      name: "Earth's incredible places EVEREST",
      price: "45.000",
      cat: "Sách Nước Ngoài",
    },
    { name: "How to Negotiate", price: "235.000", cat: "Sách Nước Ngoài" },
    { name: "Ikigai", price: "19.000", cat: "Sách Nước Ngoài" },
    {
      name: "Meditation In Every Moment",
      price: "300.000",
      cat: "Sách Nước Ngoài",
    },
    { name: "Scattered Minds", price: "129.000", cat: "Sách Nước Ngoài" },
    { name: "The Green Lotus Bud", price: "239.000", cat: "Sách Nước Ngoài" },
    { name: "The Little Prince", price: "99.000", cat: "Sách Nước Ngoài" },
    { name: "The Money Trap", price: "49.000", cat: "Sách Nước Ngoài" },
    { name: "The Story of a Heart", price: "56.000", cat: "Sách Nước Ngoài" },
    { name: "Viet Nam Style", price: "39.000", cat: "Sách Nước Ngoài" },
    {
      name: "Violet Bent Backwards over the grass",
      price: "59.000",
      cat: "Sách Nước Ngoài",
    },
    { name: "You'll Love This", price: "29.000", cat: "Sách Nước Ngoài" },

    {
      name: "Hơi Thở Nối Dài Sự Sống",
      price: "234.000",
      cat: "Khoa Học - Kỹ Thuật",
    },
    {
      name: "Tuyệt Chiêu Giữ Ấm, Trục Hàn",
      price: "199.000",
      cat: "Khoa Học - Kỹ Thuật",
    },
    { name: "Hiểu Về ADHD", price: "123.000", cat: "Khoa Học - Kỹ Thuật" },
    { name: "Kỹ Thuật AI", price: "153.000", cat: "Khoa Học - Kỹ Thuật" },
    {
      name: "Lịch Sử Của Lên Men",
      price: "129.000",
      cat: "Khoa Học - Kỹ Thuật",
    },
    { name: "Nhịn Ăn Khoa Học", price: "999.000", cat: "Khoa Học - Kỹ Thuật" },
    { name: "Stem Toán Học", price: "126.000", cat: "Khoa Học - Kỹ Thuật" },
    {
      name: "Kỹ Thuật Sửa Chữa Ô Tô",
      price: "23.000",
      cat: "Khoa Học - Kỹ Thuật",
    },
    { name: "Suy Nghĩ Thống Kê", price: "470.000", cat: "Khoa Học - Kỹ Thuật" },
    { name: "Tarot", price: "599.000", cat: "Khoa Học - Kỹ Thuật" },
    {
      name: "Thư Giãn Với Y Học",
      price: "123.000",
      cat: "Khoa Học - Kỹ Thuật",
    },
    { name: "Hướng Dẫn Về Phim", price: "552.000", cat: "Khoa Học - Kỹ Thuật" },
    { name: "Vòng Tròn Của Khỉ", price: "23.000", cat: "Khoa Học - Kỹ Thuật" },
    {
      name: "Tại Sao Chúng Ta Lại Ngủ",
      price: "123.000",
      cat: "Khoa Học - Kỹ Thuật",
    },

    { name: "12 Nguyên Tắc Kinh Doanh", price: "600.000", cat: "Kinh Tế" },
    { name: "Tiền Mặt Là Vua", price: "566.000", cat: "Kinh Tế" },
    { name: "Chiến Tranh Tiền Tệ", price: "231.000", cat: "Kinh Tế" },
    { name: "Giao Dịch Sự Bất Định", price: "199.000", cat: "Kinh Tế" },
    { name: "Good Strategy Bad Strategy", price: "569.000", cat: "Kinh Tế" },
    { name: "Không Đếm Một", price: "24.000", cat: "Kinh Tế" },
    { name: "Lần Đầu Làm Sếp", price: "256.000", cat: "Kinh Tế" },
    { name: "Nghĩ Giàu Làm Giàu", price: "599.000", cat: "Kinh Tế" },
    { name: "Nhà Đầu Tư Thông Minh", price: "563.000", cat: "Kinh Tế" },
    { name: "Phân Tích Kỹ Thuật", price: "499.000", cat: "Kinh Tế" },
    { name: "Richer, Wiser, Happier", price: "239.000", cat: "Kinh Tế" },

    {
      name: "Chia Sẻ Từ Trái Tim",
      price: "99.000",
      cat: "Lịch Sử - Địa lý - Tôn Giáo",
    },
    {
      name: "Đại Việt Thông Sử",
      price: "199.000",
      cat: "Lịch Sử - Địa lý - Tôn Giáo",
    },
    {
      name: "Lịch Sử Chữ Quốc Ngữ",
      price: "123.000",
      cat: "Lịch Sử - Địa lý - Tôn Giáo",
    },
    {
      name: "Lược Sử Loại Người",
      price: "122.000",
      cat: "Lịch Sử - Địa lý - Tôn Giáo",
    },
    {
      name: "Muôn Kiếp Nhân Sinh",
      price: "256.000",
      cat: "Lịch Sử - Địa lý - Tôn Giáo",
    },
    { name: "Nam Bộ", price: "123.000", cat: "Lịch Sử - Địa lý - Tôn Giáo" },
    {
      name: "Nhân Chứng Và Lịch Sử",
      price: "256.000",
      cat: "Lịch Sử - Địa lý - Tôn Giáo",
    },
    {
      name: "Những Bức Di thư Thành Cổ",
      price: "126.000",
      cat: "Lịch Sử - Địa lý - Tôn Giáo",
    },
    {
      name: "Sự Trả Thù Của Địa Lý",
      price: "129.000",
      cat: "Lịch Sử - Địa lý - Tôn Giáo",
    },
    {
      name: "Tổ Chức Và Diễn Đàn Trên Thế Giới",
      price: "223.000",
      cat: "Lịch Sử - Địa lý - Tôn Giáo",
    },
    {
      name: "Trang Tử Tinh Hoa",
      price: "159.000",
      cat: "Lịch Sử - Địa lý - Tôn Giáo",
    },
    { name: "Trường Sa", price: "129.000", cat: "Lịch Sử - Địa lý - Tôn Giáo" },
    {
      name: "Trường Sa Kì Vĩ và Gian Lao",
      price: "126.000",
      cat: "Lịch Sử - Địa lý - Tôn Giáo",
    },

    { name: "Chém Tiếng Anh", price: "200.000", cat: "Ngoại Ngữ" },
    {
      name: "Giải Thích Ngữ Pháp Tiếng Anh",
      price: "152.000",
      cat: "Ngoại Ngữ",
    },
    { name: "10 Phút Tự Học Tiếng Hàn", price: "145.000", cat: "Ngoại Ngữ" },
    { name: "Katakana", price: "263.000", cat: "Ngoại Ngữ" },
    { name: "MinMap", price: "123.000", cat: "Ngoại Ngữ" },
    { name: "Tập Viết Chữ Hán", price: "123.000", cat: "Ngoại Ngữ" },
    { name: "Tiếng Anh GenZ", price: "124.000", cat: "Ngoại Ngữ" },
    {
      name: "Top 1000 Từ Vựng Tiếng Trung",
      price: "256.000",
      cat: "Ngoại Ngữ",
    },
    { name: "Tự Nguyên Hán Tự", price: "321.000", cat: "Ngoại Ngữ" },
    { name: "Từ Vựng Tiếng Nhật", price: "129.000", cat: "Ngoại Ngữ" },
    { name: "Word Fomartion", price: "256.000", cat: "Ngoại Ngữ" },

    { name: "Atomic Habits", price: "123.000", cat: "Tâm Lý - Kỹ Năng" },
    {
      name: "Chữa Lành Những Sang Chấn Tuổi Thơ",
      price: "123.000",
      cat: "Tâm Lý - Kỹ Năng",
    },
    { name: "Dám Bị Ghét", price: "563.000", cat: "Tâm Lý - Kỹ Năng" },
    { name: "Định Luật Murphy", price: "230.000", cat: "Tâm Lý - Kỹ Năng" },
    {
      name: "Đời Ngắn Đừng Ngủ Dài",
      price: "125.000",
      cat: "Tâm Lý - Kỹ Năng",
    },
    { name: "Dophamine Detox", price: "222.000", cat: "Tâm Lý - Kỹ Năng" },
    { name: "Mukbang Nỗi Buồn", price: "269.000", cat: "Tâm Lý - Kỹ Năng" },
    {
      name: "Sức Mạnh Của Sự Dịu Dàng",
      price: "333.000",
      cat: "Tâm Lý - Kỹ Năng",
    },
    {
      name: "Thiên Tài Bến Trái ,Kẻ Điên Bên Phải",
      price: "125.000",
      cat: "Tâm Lý - Kỹ Năng",
    },
    { name: "Tư Duy Mở", price: "156.000", cat: "Tâm Lý - Kỹ Năng" },
    { name: "Vãn Tình", price: "222.000", cat: "Tâm Lý - Kỹ Năng" },
    { name: "Viết Từ Số 0", price: "456.000", cat: "Tâm Lý - Kỹ Năng" },

    { name: "Alice và Xứ Sở Diệu Kỳ", price: "23.000", cat: "Thiếu Nhi" },
    { name: "Chú Cuội", price: "14.000", cat: "Thiếu Nhi" },
    { name: "Chuột Típ đi học muộn", price: "45.000", cat: "Thiếu Nhi" },
    { name: "Cừu Đen Không Giống Ai", price: "19.000", cat: "Thiếu Nhi" },
    { name: "Điều Ước Mùa Đông", price: "11.000", cat: "Thiếu Nhi" },
    { name: "Khu Vườn Bí Mật", price: "65.000", cat: "Thiếu Nhi" },
    { name: "Lược Sử Việt Nam Bằng Tranh", price: "12.000", cat: "Thiếu Nhi" },
    { name: "Người Bán Tưởng Tượng", price: "23.000", cat: "Thiếu Nhi" },
    { name: "Trò Chơi Trốn Tìm", price: "45.000", cat: "Thiếu Nhi" },
    { name: "Vì Sao Tớ Yêu Bố", price: "26.000", cat: "Thiếu Nhi" },
    { name: "Vì Sao Tớ Yêu Mẹ", price: "12.000", cat: "Thiếu Nhi" },
    { name: "Xe Nâng Cừ Khôi", price: "11.000", cat: "Thiếu Nhi" },

    { name: "Cảm Ơn Người Lớn", price: "56.000", cat: "Văn Học" },
    { name: "Mưa Đỏ", price: "120.000", cat: "Văn Học" },
    { name: "Nếu Biết Trăm Năm Là Hữu Hạn", price: "25.000", cat: "Văn Học" },
    { name: "Người Đàn Ông Mang Tên OVE", price: "56.000", cat: "Văn Học" },
    { name: "Người Quảng Đi Ăn Mì Quảng", price: "123.000", cat: "Văn Học" },
    { name: "Nhật Ký Trong Tù", price: "78.000", cat: "Văn Học" },
    { name: "Nơi Nào Có Mẹ Nơi Ấy Là Nhà", price: "89.000", cat: "Văn Học" },
    { name: "Sương Khói Quê Nhà", price: "123.000", cat: "Văn Học" },
    { name: "Thơ Tố Hữu", price: "45.000", cat: "Văn Học" },
    { name: "Thơ Xuân Diệu", price: "78.000", cat: "Văn Học" },
    { name: "Truyện Kiều", price: "256.000", cat: "Văn Học" },
    { name: "Truyện Ngắn Nam Cao", price: "56.000", cat: "Văn Học" },
    { name: "Vợ Nhặt", price: "123.000", cat: "Văn Học" },

    /*
    { name: "Chém Tiếng Anh", price: "169.000đ", cat: "Ngoại ngữ" },
    { name: "Đời ngắn đừng ngủ dài", price: "60.000đ", cat: "Tâm lý" },
    { name: "Sức mạnh của sự dịu dàng", price: "85.500đ", cat: "Tâm lý" },
    { name: "Viết từ số 0", price: "165.000đ", cat: "Kỹ năng" },
    {
      name: "Giải thích ngữ pháp tiếng Anh",
      price: "190.000đ",
      cat: "Ngoại ngữ",
    },
    { name: "Học Tiếng Hàn mỗi ngày", price: "85.000đ", cat: "Ngoại ngữ" },
    { name: "Chiến tranh tiền tệ", price: "185.000đ", cat: "Kinh tế" },
    { name: "Lần đầu làm sếp", price: "195.000đ", cat: "Kinh tế" },
    { name: "Nhà đầu tư thông minh", price: "280.000đ", cat: "Kinh tế" },
    { name: "Why We Sleep", price: "486.000đ", cat: "Khoa học" },
    { name: "Alice xứ sở diệu kỳ", price: "79.000đ", cat: "Thiếu nhi" },
    { name: "Cảm ơn người lớn", price: "110.000đ", cat: "Văn học" },
    { name: "Tiếng Anh Gen Z", price: "81.000đ", cat: "Ngoại ngữ" },
    { name: "Chiến tranh Việt Nam", price: "200.000đ", cat: "Lịch sử" },
    { name: "Nhà giả kim", price: "79.000đ", cat: "Văn học" },
    { name: "Đắc nhân tâm", price: "68.000đ", cat: "Kỹ năng" },
    { name: "Sapiens: Lược sử loài người", price: "189.000đ", cat: "Khoa học" },
    { name: "Tư duy nhanh và chậm", price: "175.000đ", cat: "Tâm lý" },
    {
      name: "Người giàu có nhất thành Babylon",
      price: "62.000đ",
      cat: "Kinh tế",
      
    },
    */
  ];

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
      if (!q) {
        dropdown.style.display = "none";
        return;
      }
      renderDropdown(
        BOOKS.filter((b) => b.name.toLowerCase().includes(q)),
        q,
      );
    }, 250);
  });

  function renderDropdown(hits, q) {
    dropdown.innerHTML = "";
    if (!hits.length) {
      dropdown.innerHTML = `<li style="padding:12px 16px;color:#aaa;font-size:13px;">Không tìm thấy "<b>${q}</b>"</li>`;
    } else {
      hits.forEach((book) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${highlight(book.name, q)}<small>${book.cat}</small></span><span class="dd-price">${book.price}</span>`;
        li.addEventListener("mousedown", (e) => {
          e.preventDefault();
          input.value = book.name;
          dropdown.style.display = "none";
          showToast(`Tìm: "${book.name}"`);
        });
        dropdown.appendChild(li);
      });
    }
    dropdown.style.display = "block";
  }

  function highlight(text, q) {
    return text.replace(new RegExp(`(${q})`, "gi"), `<mark>$1</mark>`);
  }

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

/* GIỎ HÀNG */
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
  panel.innerHTML = `
    <div class="cart-panel__head"><span>Giỏ hàng</span><button id="cart-panel-close">✕</button></div>
    <div class="cart-panel__body" id="cart-body"></div>
    <div class="cart-panel__foot">
      <div class="cart-total" id="cart-total">Tổng: 0đ</div>
      <button class="cart-checkout">Thanh toán</button>
    </div>`;
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

  document.querySelectorAll(".flashsale__product--element").forEach((el, i) => {
    const name =
      el.querySelector(".product__element--name")?.textContent?.trim() ||
      `Sách ${i + 1}`;
    const price =
      el.querySelector(".product__element--price")?.textContent?.trim() || "0đ";
    el.dataset.id = `fs-${i}`;
    el.dataset.name = name;
    el.dataset.price = price;
    el.appendChild(makeAddBtn("Thêm vào giỏ", "full"));
  });

  document
    .querySelectorAll(".seccard__products--card, .goiy__product--card")
    .forEach((el, i) => {
      const name =
        el.querySelector(".grid__info--name")?.textContent?.trim() ||
        `Sản phẩm ${i + 1}`;
      const price =
        el.querySelector(".grid__info--price")?.textContent?.trim() || "0đ";
      el.dataset.id = `p-${i}`;
      el.dataset.name = name;
      el.dataset.price = price;
      el.querySelector(".product__grid--info")?.appendChild(
        makeAddBtn("+ Giỏ hàng", "small"),
      );
    });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-cart]");
    if (!btn) return;
    const card = btn.closest("[data-id]");
    if (!card) return;
    addToCart({
      id: card.dataset.id,
      name: card.dataset.name,
      price: card.dataset.price,
    });
  });

  function makeAddBtn(label, size) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.setAttribute("data-add-cart", "");
    btn.className =
      size === "full" ? "btn-add-cart-full" : "btn-add-cart-small";
    return btn;
  }
  function addToCart(item) {
    const found = cart.find((c) => c.id === item.id);
    if (found) found.qty = (found.qty || 1) + 1;
    else cart.push({ ...item, qty: 1 });
    localStorage.setItem("bg8_cart", JSON.stringify(cart));
    updateBadge();
    renderCartPanel();
    showToast(`Đã thêm "${item.name}" vào giỏ`);
  }
  function removeFromCart(id) {
    cart = cart.filter((c) => c.id !== id);
    localStorage.setItem("bg8_cart", JSON.stringify(cart));
    updateBadge();
    renderCartPanel();
  }
  function updateBadge() {
    const total = cart.reduce((s, c) => s + (c.qty || 1), 0);
    badge.textContent = total > 99 ? "99+" : String(total);
    badge.style.display = total > 0 ? "flex" : "none";
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
        (item) => `
      <div class="cart-item"><div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">${item.price} × ${item.qty || 1}</div>
      </div><button class="cart-item__remove" data-remove="${item.id}">✕</button></div>`,
      )
      .join("");
    body
      .querySelectorAll("[data-remove]")
      .forEach((btn) =>
        btn.addEventListener("click", () => removeFromCart(btn.dataset.remove)),
      );
    const sum = cart.reduce((s, c) => {
      const n =
        parseInt((c.price || "0").replace(/[^0-9]/g, "")) * (c.qty || 1);
      return s + (isNaN(n) ? 0 : n);
    }, 0);
    if (total) total.textContent = `Tổng: ${sum.toLocaleString("vi-VN")}đ`;
  }
  updateBadge();
  window.BG8Cart = { getAll: () => [...cart], add: addToCart };
}

/* 7. THÔNG BÁO */
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
  panel.innerHTML = `
    <div class="dropdown-panel__head">
      <span>Thông báo</span>
      <button class="dp-mark-all">Đánh dấu tất cả đã đọc</button>
    </div>
    <div class="dropdown-panel__body">
      <div class="noti-item unread"><div class="noti-icon"><img src ="asset/icon/Thongbao/Chuong_thong_bao.svg" alt="Thông báo"></div><div class="noti-content"><div class="noti-title">Flash Sale sắp bắt đầu!</div><div class="noti-time">5 phút trước</div></div></div>
      <div class="noti-item unread"><div class="noti-icon"><img src ="asset/icon/Thongbao/Giam_gia.svg" alt="Giảm giá"></div><div class="noti-content"><div class="noti-title">Bạn có phiếu giảm giá mới</div><div class="noti-time">1 giờ trước</div></div></div>
      <div class="noti-item unread"><div class="noti-icon"><img src ="asset/icon/Thongbao/Giao_hang.svg" alt="Giao hang"></div><div class="noti-content"><div class="noti-title">Đơn hàng đang được giao</div><div class="noti-time">2 giờ trước</div></div></div>
      <div class="noti-item"><div class="noti-icon"><img src = "asset/icon/Thongbao/Thanh_cong.svg" alt="Thanh cong"></div><div class="noti-content"><div class="noti-title">Đặt hàng thành công</div><div class="noti-time">Hôm qua</div></div></div>
    </div>
    <div class="dropdown-panel__foot"><a href="#">Xem tất cả thông báo</a></div>`;
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
    showToast("Đã đánh dấu tất cả đã đọc");
  });
  document.addEventListener("click", (e) => {
    if (!notiLi.contains(e.target)) panel.classList.remove("open");
  });
}

/* TÀI KHOẢN */
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

/* NEWSLETTER */
function initNewsletter() {
  const input = document.querySelector(".newsletter-input");
  const btn = document.querySelector(".newsletter-btn");
  if (!input || !btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = input.value.trim();
    document.querySelector(".nl-error")?.remove();
    if (!email) {
      showFieldError(input, "Vui lòng nhập email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError(input, "Email không hợp lệ.");
      return;
    }
    btn.disabled = true;
    btn.textContent = "Đang xử lý...";
    setTimeout(() => {
      input.value = "";
      btn.disabled = false;
      btn.textContent = "ĐĂNG KÝ";
      showToast("Đăng ký thành công!");
    }, 1200);
  });
  input.addEventListener("input", () => {
    document.querySelector(".nl-error")?.remove();
    input.style.outline = "";
  });

  function showFieldError(field, msg) {
    field.style.outline = "2px solid #e53935";
    const err = document.createElement("span");
    err.className = "nl-error";
    err.textContent = msg;
    field.insertAdjacentElement("afterend", err);
  }
}

/* HAMBURGER */
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

/* SCROLL-TO-TOP */
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

/* LAZY LOAD */
function initLazyLoad() {
  const imgs = document.querySelectorAll("img[data-src]");
  if (!imgs.length) return;
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries, ob) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const img = en.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          ob.unobserve(img);
        });
      },
      { rootMargin: "200px" },
    );
    imgs.forEach((img) => obs.observe(img));
  } else {
    imgs.forEach((img) => {
      img.src = img.dataset.src;
    });
  }
}

/* ARROW BUTTONS */
function initArrowButtons() {
  document.querySelectorAll(".dieuhuong__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parent = btn.parentElement;
      const row =
        parent?.querySelector(".main__flashsale--products") ||
        parent?.querySelector(".seccard__product--grid") ||
        parent?.querySelector(".giftcard__content--grid") ||
        parent
          ?.closest(".main__flashsale")
          ?.querySelector(".main__flashsale--products") ||
        parent
          ?.closest(".main__seccard")
          ?.querySelector(".seccard__product--grid");
      if (row) row.scrollBy({ left: 600, behavior: "smooth" });
    });
  });
}

/* RANKING */
function initRanking() {
  const rankSection = document.querySelector(".seccard__ranking");
  if (!rankSection) return;
  const items = rankSection.querySelectorAll(".ranking__list--item");
  const featImg = rankSection.querySelector(".ranking__featured--img img");
  const detailEl = rankSection.querySelector(".ranking__featured--detail");
  items.forEach((item, i) => {
    if (i === 0) item.classList.add("rank-active");
    item.addEventListener("click", () => {
      items.forEach((it) => it.classList.remove("rank-active"));
      item.classList.add("rank-active");
      const thumb = item.querySelector(".list-item--img img");
      if (featImg && thumb) {
        featImg.style.opacity = "0";
        setTimeout(() => {
          featImg.src = thumb.src;
          featImg.style.opacity = "1";
        }, 180);
      }
      if (detailEl) {
        const t = detailEl.querySelector(".ranking__detail--title");
        const a = detailEl.querySelector(".ranking__detail--author");
        if (t)
          t.textContent = item.querySelector(".rank-name")?.textContent || "";
        if (a)
          a.textContent = item.querySelector(".rank-tag")?.textContent || "";
      }
    });
  });
}

/* NAV ACTIVE LINK */
function initNavActiveLink() {
  const links = document.querySelectorAll(".header__nav a");
  if (!links.length) return;
  const page = location.pathname.split("/").pop() || "index.html";
  links.forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === page || (page === "" && href === "index.html"))
      a.classList.add("nav-active");
  });
}

/* THELOAI MARQUEE */
function initTheloaiMarquee() {
  const theloai = document.querySelector(".main__theloai");
  if (!theloai) return;

  /* Case A: HTML đã có --track */
  let track = theloai.querySelector(".main__theloai--track");
  if (track) {
    if (!track.dataset.doubled) {
      const origHTML = track.innerHTML;
      track.innerHTML += origHTML;
      track.dataset.doubled = "1";
      _applyTrackSpeed(
        track,
        track.querySelectorAll(".main__theloai--element").length / 2,
      );
    }
    return;
  }

  /* Case B: Items nằm trực tiếp trong .main__theloai */
  const items = [...theloai.querySelectorAll(".main__theloai--element")];
  if (!items.length) return;

  // Tạo track wrapper
  track = document.createElement("div");
  track.className = "main__theloai--track";

  // Chuyển items gốc vào track
  items.forEach((el) => track.appendChild(el));

  // Nhân đôi (clone) để tạo vòng lặp liền mạch
  items.forEach((el) => {
    const clone = el.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  track.dataset.doubled = "1";
  theloai.appendChild(track);
  _applyTrackSpeed(track, items.length);
}

/* Tính tốc độ animation dựa theo số items */
function _applyTrackSpeed(track, count) {
  const duration = Math.max(18, count * 2.6); // tối thiểu 18s
  track.style.animationDuration = duration + "s";
}

/* HELPER — Toast*/
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

/* INJECT GLOBAL STYLES */
function injectGlobalStyles() {
  const s = document.createElement("style");
  s.textContent = `
    /* Banner hide on scroll */
.banner {
  transition:
    max-height 0.3s ease,
    padding 0.3s ease;
  overflow: hidden;
}
.banner.hidden {
  max-height: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.header.scrolled {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14) !important;
}
.header__nav a.nav-active {
  color: var(--p-600, #d0021b) !important;
  font-weight: 700;
}

/* Hamburger */
.hamburger-btn {
  display: none;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: var(--gray-700, #333);
  padding: 4px 8px;
  line-height: 1;
}
@media (max-width: 768px) {
  .hamburger-btn {
    display: block;
  }
  .header__nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 1000;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
    border-top: 1px solid #f0f0f0;
  }
  .header__nav.nav--open {
    display: block;
  }
  .header__nav ul {
    flex-direction: column !important;
    padding: 8px 0 !important;
    gap: 0 !important;
  }
  .header__nav ul li a {
    display: block !important;
    padding: 12px 20px !important;
    font-size: 14px !important;
    border-bottom: 1px solid #f5f5f5;
  }
}

/* Theloai marquee */
.main__theloai--track {
  display: flex;
  width: max-content;
  animation: theloai-scroll 30s linear infinite;
}
.main__theloai--track:hover {
  animation-play-state: paused;
}
@keyframes theloai-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.flashsale--ended .flashsale__header--timer::after {
  content: " (Đã kết thúc)";
  font-size: 11px;
  color: #888;
  margin-left: 6px;
}
.ranking__list--item.rank-active {
  background: var(--p-20, #fff5f5);
  border-radius: 6px;
}
.ranking__list--item.rank-active .rank-name {
  color: var(--p-600, #d0021b);
  font-weight: 600;
}
.ranking__featured--img img {
  transition: opacity 0.2s ease;
}

/* Add to cart buttons */
.btn-add-cart-full {
  width: 100%;
  padding: 7px 0;
  margin-top: 6px;
  background: var(--p-600, #d0021b);
  color: #fff;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-add-cart-full:hover {
  background: var(--p-800, #7f0000);
}
.btn-add-cart-small {
  width: 100%;
  padding: 6px 0;
  margin-top: 6px;
  background: var(--p-600, #d0021b);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-add-cart-small:hover {
  background: var(--p-800, #7f0000);
}

/* Cart badge */
.cart-badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background: var(--p-500, #e53935);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  z-index: 10;
}

/* Cart panel */
#cart-panel {
  position: fixed;
  top: 0;
  right: -360px;
  width: 340px;
  height: 100vh;
  background: #fff;
  z-index: 9000;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  transition: right 0.3s ease;
}
#cart-panel.open {
  right: 0;
}
.cart-panel__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  font-weight: 700;
}
#cart-panel-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #888;
}
#cart-panel-close:hover {
  color: var(--p-600, #d0021b);
}
.cart-panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
}
.cart-empty {
  text-align: center;
  color: #bbb;
  padding: 40px 0;
  font-size: 14px;
}
.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}
.cart-item:last-child {
  border-bottom: none;
}
.cart-item__info {
  flex: 1;
  min-width: 0;
}
.cart-item__name {
  font-size: 13px;
  color: #444;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cart-item__price {
  font-size: 12px;
  color: var(--p-600, #d0021b);
  font-weight: 700;
  margin-top: 3px;
}
.cart-item__remove {
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
}
.cart-item__remove:hover {
  color: var(--p-600, #d0021b);
}
.cart-panel__foot {
  padding: 14px 20px;
  border-top: 1px solid #f0f0f0;
}
.cart-total {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
}
.cart-checkout {
  width: 100%;
  padding: 11px 0;
  background: var(--p-600, #d0021b);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.cart-checkout:hover {
  background: var(--p-800, #7f0000);
}

/* Dropdown panel */
.dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
  z-index: 8000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition:
    opacity 0.2s,
    transform 0.2s,
    visibility 0.2s;
  overflow: hidden;
}
.dropdown-panel.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.dropdown-panel__head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  font-weight: 700;
}
.dropdown-panel__body {
  max-height: 280px;
  overflow-y: auto;
}
.dropdown-panel__foot {
  padding: 10px 16px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}
.dropdown-panel__foot a {
  font-size: 13px;
  color: var(--p-600, #d0021b);
  text-decoration: none;
}
.dp-mark-all {
  background: none;
  border: none;
  font-size: 11.5px;
  color: var(--p-600, #d0021b);
  cursor: pointer;
  margin-left: auto;
  padding: 0;
  white-space: nowrap;
}

/* Notifications */
.noti-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.15s;
}
.noti-item:last-child {
  border-bottom: none;
}
.noti-item:hover {
  background: #fafafa;
}
.noti-item.unread {
  background: #fff8f8;
}
.noti-item.unread .noti-title {
  font-weight: 600;
}
.noti-icon {
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}
.noti-title {
  font-size: 13px;
  color: #444;
  line-height: 1.4;
}
.noti-time {
  font-size: 11px;
  color: #bbb;
  margin-top: 3px;
}

/* Account */
.acc-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--p-100, #ffe0e0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.acc-name {
  font-size: 14px;
  font-weight: 700;
}
.acc-email {
  font-size: 11.5px;
  color: #bbb;
}
.acc-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  font-size: 13.5px;
  color: #444;
  text-decoration: none;
  transition: background 0.15s;
}
.acc-menu-item:hover {
  background: #fafafa;
  color: var(--p-600, #d0021b);
}
.acc-divider {
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 4px 0;
}
.acc-logout {
  color: var(--p-600, #d0021b) !important;
}

/* Search dropdown */
#search-dropdown {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 0 0 10px 10px;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 2000;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  display: none;
  max-height: 300px;
  overflow-y: auto;
}
#search-dropdown li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  font-size: 13px;
  transition: background 0.15s;
}
#search-dropdown li:last-child {
  border-bottom: none;
}
#search-dropdown li:hover {
  background: #fff5f5;
}
#search-dropdown li small {
  color: #bbb;
  margin-left: 8px;
}
#search-dropdown .dd-price {
  color: var(--p-600, #d0021b);
  font-weight: 700;
  white-space: nowrap;
  margin-left: 12px;
}
#search-dropdown mark {
  background: #fff0a0;
  border-radius: 2px;
  padding: 0 1px;
}

.nl-error {
  color: #fff;
  font-size: 11.5px;
  margin-left: 8px;
  white-space: nowrap;
}


    /* Scroll-to-top */
    #scroll-top {
      position:fixed; 
      bottom:24px; 
      right:20px; 
      z-index:9999; 
      width:44px; 
      height:44px; 
      border-radius:50%; 
      background:var(--p-600,#d0021b); 
      color:#fff; border:none; 
      font-size:24px; 
      cursor:pointer; 
      display:none; 
      align-items:center; 
      justify-content:center; 
      box-shadow:0 3px 12px rgba(0,0,0,.2); 
      line-height:1; 
      transition:transform .2s; 
      outline:none; 
    }
    #scroll-top.visible { 
      display:flex; 
    }
    #scroll-top:hover { 
      transform:scale(1.1); 
    }

    /* Toast */
    #toast-container { 
      position:fixed; 
      bottom:72px; 
      right:20px; 
      z-index:99999; 
      display:flex; 
      flex-direction:column; 
      gap:8px; 
      pointer-events:none; 
    }
    .toast-item { 
      background:#222; 
      color:#fff; padding:11px 18px; 
      border-radius:8px; 
      font-size:13px; 
      max-width:300px; 
      box-shadow:0 4px 14px rgba(0,0,0,.2); 
      line-height:1.5; 
      opacity:0; 
      transform:translateY(10px); 
      transition:opacity .25s, transform .25s; 
      pointer-events:none; 
    }
    .toast-item.toast-show { 
      opacity:1; 
      transform:translateY(0); 
    }`;
  document.head.appendChild(s);
}
