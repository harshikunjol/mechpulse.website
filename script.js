// ------------------- Flipbook Pages & Controls -------------------
const pages = document.querySelectorAll(".page");
let currentPage = 0;

const pageNumEl = document.getElementById("page-num");
const pageCountEl = document.getElementById("page-count");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const downloadBtn = document.getElementById("download-btn");

// Show a given page index
function showPage(num) {
  if (num < 0) num = 0;
  if (num >= pages.length) num = pages.length - 1;
  currentPage = num;

  pages.forEach((p, i) => p.classList.toggle("active", i === num));
  pageNumEl.textContent = currentPage + 1;
  pageCountEl.textContent = pages.length;

  // disable prev/next if at boundaries
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === pages.length - 1;
}

// Navigation functions
function nextPage() {
  if (currentPage < pages.length - 1) showPage(currentPage + 1);
}
function prevPage() {
  if (currentPage > 0) showPage(currentPage - 1);
}

// Wire buttons
prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextPage();
  if (e.key === "ArrowLeft") prevPage();
});

// Touch swipe support for flipbook pages
let touchStartX = 0;
document.addEventListener("touchstart", (e) => (touchStartX = e.touches[0].clientX));
document.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  if (touchStartX - touchEndX > 50) nextPage(); // swipe left -> next
  if (touchEndX - touchStartX > 50) prevPage(); // swipe right -> prev
});

// ------------------- PDF Download Logic -------------------
downloadBtn.addEventListener("click", () => {
  const clone = document.createElement("div");
  clone.style.width = "800px";
  clone.style.background = "#fff";
  clone.style.padding = "24px";

  pages.forEach((p) => {
    const c = p.cloneNode(true);
    c.style.display = "block";
    c.style.pageBreakAfter = "always";
    c.querySelectorAll(".start-btn").forEach(b => b.remove());
    clone.appendChild(c);
  });

  html2pdf().from(clone).set({
    margin: 0.25,
    filename: "flipbook-styled.pdf",
    image: { type: "jpeg", quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  }).save();
});

// ------------------- Flipbook Initialization -------------------
showPage(0);

$("#flipbook").turn({
    width: 1000,
    height: 700,
    autoCenter: true,
    display: 'double',
    elevation: 50,
    gradients: true,
    acceleration: true
});

document.getElementById("nextBtn").addEventListener("click", () => pageFlip.flipNext());
document.getElementById("prevBtn").addEventListener("click", () => pageFlip.flipPrev());

// ------------------- Full Page PDF -------------------
document.getElementById("download-btn").addEventListener("click", async function() {
  const element = document.getElementById("wrapper");
  html2pdf().set({
    margin: 0.2,
    filename: 'full_website.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).from(element).save();
});

// ------------------- Mobile-Friendly Gallery Swipe -------------------
const galleries = document.querySelectorAll('.product-page2 .gallery');

galleries.forEach((gallery) => {
  let startX = 0;

  gallery.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    e.stopPropagation(); // prevent page swipe
  });

  gallery.addEventListener('touchmove', (e) => {
    const moveX = e.touches[0].clientX;
    const diff = startX - moveX;
    gallery.scrollLeft += diff; // scroll gallery manually
    startX = moveX;
    e.stopPropagation();
  });

  gallery.addEventListener('touchend', (e) => {
    e.stopPropagation();
  });
});
