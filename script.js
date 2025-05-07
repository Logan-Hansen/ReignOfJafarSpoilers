const totalCards = 204;
const grid = document.getElementById("cardGrid");
const bonusGrid = document.getElementById("bonusGrid");
const toggleBtn = document.getElementById("toggleRevealed");
const revealCounter = document.getElementById("revealCounter");
const loadingIndicator = document.getElementById("loading");
let showOnlyRevealed = false;
let zoomedClone = null;
let loadedCount = 0;

function updateRevealCount() {
  let revealed = 0;
  for (let i = 1; i <= totalCards; i++) {
    const cardNum = i.toString().padStart(3, '0');
    const card = document.querySelector(`.card[data-card-num="${cardNum}"]`);
    if (card && !card.src.includes("LorcanaCardBack.png")) {
      revealed++;
    }
  }
  const percent = ((revealed / totalCards) * 100).toFixed(1);
  revealCounter.textContent = `Revealed: ${revealed} / ${totalCards} (${percent}%)`;
}

function incrementLoaded() {
  loadedCount++;
  if (loadedCount === totalCards) {
    updateRevealCount();
    loadingIndicator.classList.add("hidden");
  }
}

function closeZoom() {
  if (zoomedClone) {
    zoomedClone.classList.remove("zoomed");
    zoomedClone.remove();
    zoomedClone = null;
  }
  document.body.classList.remove("no-scroll");
  document.getElementById("overlay").style.display = "none";
}

function createCard(cardNum) {
  const img = document.createElement("img");
  img.dataset.cardNum = cardNum;
  img.src = `cards/${cardNum}.png`;
  img.alt = `Card ${cardNum}`;
  img.classList.add("card");

  img.onerror = () => {
    img.src = "LorcanaCardBack.png";
    img.dataset.unrevealed = "true";
    incrementLoaded();
  };

  img.onload = () => {
    incrementLoaded();
  };

  img.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeZoom();

    zoomedClone = img.cloneNode(true);
    zoomedClone.classList.add("zoomed");
    zoomedClone.addEventListener("click", (e) => {
      e.stopPropagation();
      closeZoom();
    });

    document.body.appendChild(zoomedClone);
    document.body.classList.add("no-scroll");
    document.getElementById("overlay").style.display = "block";
  });

  const container = document.createElement("div");
  container.classList.add("card-container");

  const label = document.createElement("div");
  label.classList.add("card-label");
  label.textContent = cardNum;

  container.appendChild(img);
  container.appendChild(label);
  grid.appendChild(container);
}

function createBonusCard(index) {
  const id = index.toString().padStart(2, '0');
  const filename = `bonus_${id}.png`;

  const img = document.createElement("img");
  img.src = `cards/bonus/${filename}`;
  img.alt = "Bonus Card";
  img.classList.add("card");

  img.onload = () => {
    const container = document.createElement("div");
    container.classList.add("card-container");
    container.appendChild(img);
    bonusGrid.appendChild(container);
  };

  img.onerror = () => {
    img.remove();
  };

  img.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeZoom();

    zoomedClone = img.cloneNode(true);
    zoomedClone.classList.add("zoomed");
    zoomedClone.addEventListener("click", (e) => {
      e.stopPropagation();
      closeZoom();
    });

    document.body.appendChild(zoomedClone);
    document.body.classList.add("no-scroll");
    document.getElementById("overlay").style.display = "block";
  });
}

// Load main cards
for (let i = 1; i <= totalCards; i++) {
  const cardNum = i.toString().padStart(3, '0');
  createCard(cardNum);
}

// Load up to 30 bonus cards
for (let i = 1; i <= 30; i++) {
  createBonusCard(i);
}

// Toggle revealed/all
toggleBtn.addEventListener("click", () => {
  showOnlyRevealed = !showOnlyRevealed;
  toggleBtn.textContent = showOnlyRevealed ? "Show All Cards" : "Show Only Revealed Cards";

  document.querySelectorAll(".card-container").forEach(container => {
    const card = container.querySelector(".card");
    const isBack = card.src.includes("LorcanaCardBack.png");
    container.style.display = (showOnlyRevealed && isBack) ? "none" : "flex";
  });

  updateRevealCount();
});

// Global click closes zoom
document.addEventListener("click", () => closeZoom());

// Start in "only revealed" mode
window.addEventListener("load", () => {
  toggleBtn.click();
});
