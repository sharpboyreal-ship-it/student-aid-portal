```javascript
// Update the copyright year.
document.getElementById("year").textContent =
  new Date().getFullYear();

// Mobile navigation.
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Search funding categories.
const fundingSearch = document.getElementById("fundingSearch");
const fundingCards = document.querySelectorAll(".funding-card");
const searchMessage = document.getElementById("searchMessage");

function searchFunding() {
  const query = fundingSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  fundingCards.forEach((card) => {
    const searchableText =
      (card.innerText + " " + card.dataset.keywords).toLowerCase();

    const matches = searchableText.includes(query);

    card.hidden = !matches;

    if (matches) {
      visibleCount++;
    }
  });

  if (visibleCount === 0) {
    searchMessage.textContent =
      "No matching categories found. Try scholarships, grants, loans, or international.";
  } else if (query) {
    searchMessage.textContent =
      `Showing ${visibleCount} matching funding categor${visibleCount === 1 ? "y" : "ies"}.`;
  } else {
    searchMessage.textContent = "";
  }
}

document.getElementById("searchButton").addEventListener(
  "click",
  searchFunding
);

fundingSearch.addEventListener("input", searchFunding);

fundingSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchFunding();
  }
});

// Education funding gap calculator.
const educationCost = document.getElementById("educationCost");
const availableFunding = document.getElementById("availableFunding");
const fundingResult = document.getElementById("fundingResult");
const fundingExplanation = document.getElementById("fundingExplanation");

document.getElementById("calculateButton").addEventListener("click", () => {
  const costText = educationCost.value.trim();
  const fundingText = availableFunding.value.trim();

  const cost = Number(costText);
  const funding = Number(fundingText);

  if (
    costText === "" ||
    fundingText === "" ||
    !Number.isFinite(cost) ||
    !Number.isFinite(funding) ||
    cost < 0 ||
    funding < 0
  ) {
    fundingResult.textContent = "Check your entries";
    fundingExplanation.textContent =
      "Enter valid, non-negative amounts in both fields.";
    return;
  }

  const gap = cost - funding;

  fundingResult.textContent = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Math.abs(gap));

  if (gap > 0) {
    fundingExplanation.textContent =
      "This is the estimated amount still needed.";
  } else if (gap < 0) {
    fundingExplanation.textContent =
      "Your listed funding exceeds your estimated costs by this amount.";
  } else {
    fundingExplanation.textContent =
      "Your listed funding matches your estimated costs.";
  }
});
```
