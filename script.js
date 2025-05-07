const totalCards = 204;
const grid = document.getElementById("cardGrid");
const bonusGrid = document.getElementById("bonusGrid");
const toggleBtn = document.getElementById("toggleRevealed");
const revealCounter = document.getElementById("revealCounter");
let showOnlyRevealed = false;
let zoomedClone = null;

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

function closeZoom() {
  if (zoomedClone) {
    zoomedClone.remove();
    zoomedClone = null;
  }
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
    updateRevealCount();
  };

  img.onload = () => updateRevealCount();

  img.addEventListener("click", (e) => {
    e.stopPropagation();
    closeZoom();

    zoomedClone = img.cloneNode(true);
    zoomedClone.classList.add("zoomed");
    zoomedClone.style.position = "fixed";
    zoomedClone.style.top = "50%";
    zoomedClone.style.left = "50%";
    zoomedClone.style.transform = "translate(-50%, -50%)";
    zoomedClone.style.height = "90vh";
    zoomedClone.style.maxWidth = "90vw";
    zoomedClone.style.zIndex = "1000";
    zoomedClone.style.cursor = "zoom-out";
    zoomedClone.addEventListener("click", (e) => {
      e.stopPropagation();
      closeZoom();
    });

    document.body.appendChild(zoomedClone);
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
    container.appendChild(img); // No label
    bonusGrid.appendChild(container);
  };

  img.onerror = () => {
    img.remove();
  };

  img.addEventListener("click", (e) => {
    e.stopPropagation();
    closeZoom();

    const zoomed = img.cloneNode(true);
    zoomed.classList.add("zoomed");
    zoomed.style.position = "fixed";
    zoomed.style.top = "50%";
    zoomed.style.left = "50%";
    zoomed.style.transform = "translate(-50%, -50%)";
    zoomed.style.height = "90vh";
    zoomed.style.maxWidth = "90vw";
    zoomed.style.zIndex = "1000";
    zoomed.style.cursor = "zoom-out";
    zoomed.addEventListener("click", (e) => {
      e.stopPropagation();
      closeZoom();
    });

    document.body.appendChild(zoomed);
    document.getElementById("overlay").style.display = "block";
  });
}

// Load main set
for (let i = 1; i <= totalCards; i++) {
  const cardNum = i.toString().padStart(3, '0');
  createCard(cardNum);
}

// Load up to 30 bonus cards if they exist
for (let i = 1; i <= 30; i++) {
  createBonusCard(i);
}

// Toggle button logic
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

// Global click to close zoom
document.addEventListener("click", () => closeZoom());

// Default to 'only revealed' mode
window.addEventListener("load", () => {
  toggleBtn.click();
});