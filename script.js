const images = document.querySelectorAll(".gallery .image-card img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".lightbox .close");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const filterButtons = document.querySelectorAll(".filter-buttons button");

let currentIndex = 0;
let imgArray = [];

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = imgArray[currentIndex].src;
  lightbox.style.display = "flex";
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function nextImage() {
  currentIndex = (currentIndex + 1) % imgArray.length;
  lightboxImg.src = imgArray[currentIndex].src;
}

function prevImage() {
  currentIndex = (currentIndex - 1 + imgArray.length) % imgArray.length;
  lightboxImg.src = imgArray[currentIndex].src;
}

images.forEach((img, i) => {
  imgArray.push(img);
  img.addEventListener("click", () => openLightbox(i));
});

closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", prevImage);
window.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "flex") {
    if (e.key === "ArrowRight") nextImage();
    else if (e.key === "ArrowLeft") prevImage();
    else if (e.key === "Escape") closeLightbox();
  }
});

// Filter logic
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");
    document.querySelectorAll(".image-card").forEach((card) => {
      if (filter === "all" || card.classList.contains(filter)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});
