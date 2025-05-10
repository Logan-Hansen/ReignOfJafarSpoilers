const totalCards = 204;
const grid = document.getElementById("cardGrid");
const bonusGrid = document.getElementById("bonusGrid");
const toggleBtn = document.getElementById("toggleRevealed");
const loadingIndicator = document.getElementById("loading");
const overlay = document.getElementById("overlay");

let showMissing = false;
let zoomedClone = null;
let cacheBuster = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // daily version

// "Refresh Card Images" button
const refreshBtn = document.createElement("button");
refreshBtn.textContent = "Refresh Card Images";
refreshBtn.id = "refreshImagesBtn";
refreshBtn.title = "Force all card images to reload in case any were updated";
refreshBtn.style.cssText = "background-color:#771517;color:#fff;border:2px solid #d3ba84;padding:0.5rem 1rem;margin:1rem auto;display:block;border-radius:8px;cursor:pointer;";
refreshBtn.addEventListener("click", () => {
  cacheBuster = Date.now(); // force refresh
  reloadCards();
});
document.querySelector("main").insertBefore(refreshBtn, grid);

function closeZoom() {
  if (zoomedClone) {
    zoomedClone.remove();
    zoomedClone = null;
  }
  document.body.classList.remove("no-scroll");
  overlay.style.display = "none";
}

function createCard(cardNum) {
  const img = document.createElement("img");
  img.dataset.cardNum = cardNum;
  img.loading = "lazy";
  img.src = `cards/${cardNum}.png?v=${cacheBuster}`;
  img.alt = `Card ${cardNum}`;
  img.classList.add("card");

  const container = document.createElement("div");
  container.classList.add("card-container");
  container.appendChild(img);

  const label = document.createElement("div");
  label.classList.add("card-label");
  label.textContent = cardNum;
  container.appendChild(label);

  img.onerror = () => {
    img.src = "LorcanaCardBack.png";
    container.dataset.unrevealed = "true";
    if (!showMissing) container.style.display = "none";
  };

  img.onload = () => {
    if (img.src.includes("LorcanaCardBack.png") && !showMissing) {
      container.style.display = "none";
    }
  };

  img.addEventListener("click", e => {
    e.stopPropagation();
    closeZoom();

    zoomedClone = img.cloneNode(true);
    zoomedClone.classList.add("zoomed");
    zoomedClone.addEventListener("click", e => {
      e.stopPropagation();
      closeZoom();
    });

    document.body.appendChild(zoomedClone);
    document.body.classList.add("no-scroll");
    overlay.style.display = "block";
  });

  return container;
}

function createBonusCard(index) {
  const id = index.toString().padStart(2, '0');
  const filename = `bonus_${id}.png`;

  const img = document.createElement("img");
  img.loading = "lazy";
  img.src = `cards/bonus/${filename}?v=${cacheBuster}`;
  img.alt = "Bonus Card";
  img.classList.add("card");

  const container = document.createElement("div");
  container.classList.add("card-container");
  container.appendChild(img);

  bonusGrid.appendChild(container);

  img.onerror = () => {
    container.remove();
  };

  img.addEventListener("click", e => {
    e.stopPropagation();
    closeZoom();

    zoomedClone = img.cloneNode(true);
    zoomedClone.classList.add("zoomed");
    zoomedClone.addEventListener("click", e => {
      e.stopPropagation();
      closeZoom();
    });

    document.body.appendChild(zoomedClone);
    document.body.classList.add("no-scroll");
    overlay.style.display = "block";
  });
}

function reloadCards() {
  grid.innerHTML = "";
  loadingIndicator.classList.remove("hidden");

  const frag = document.createDocumentFragment();
  for (let i = 1; i <= totalCards; i++) {
    const cardNum = i.toString().padStart(3, '0');
    frag.appendChild(createCard(cardNum));
  }

  grid.appendChild(frag);
  loadingIndicator.classList.add("hidden");
}

function toggleMissing() {
  showMissing = !showMissing;
  toggleBtn.textContent = showMissing ? "Hide Missing Card Slots" : "Show Missing Card Slots";

  document.querySelectorAll(".card-container").forEach(container => {
    const card = container.querySelector(".card");
    const isBack = card.src.includes("LorcanaCardBack.png");
    container.style.display = (!showMissing && isBack) ? "none" : "flex";
  });
}

// Initial load
reloadCards();
for (let i = 1; i <= 30; i++) {
  createBonusCard(i);
}

// Toggle button
toggleBtn.textContent = "Show Missing Card Slots";
toggleBtn.addEventListener("click", toggleMissing);

// Global click closes zoom
document.addEventListener("click", closeZoom);

// Start in "only revealed" mode
window.addEventListener("load", () => toggleBtn.click());
