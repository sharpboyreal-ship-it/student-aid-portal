```javascript
const form = document.getElementById("fundingApplication");
const steps = [...document.querySelectorAll(".form-step")];

const progressBar = document.getElementById("progressBar");
const stepIndicator = document.getElementById("stepIndicator");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");
const reviewSummary = document.getElementById("reviewSummary");

let currentStep = 0;

function showStep(index) {
  currentStep = index;

  steps.forEach((step, stepIndex) => {
    step.hidden = stepIndex !== index;
  });

  progressBar.style.width =
    `${((index + 1) / steps.length) * 100}%`;

  stepIndicator.textContent =
    `Step ${index + 1} of ${steps.length}`;

  previousButton.hidden = index === 0;
  nextButton.hidden = index === steps.length - 1;
  submitButton.hidden = index !== steps.length - 1;

  formMessage.textContent = "";

  if (index === steps.length - 1) {
    updateReview();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function validateCurrentStep() {
  const visibleStep = steps[currentStep];
  const fields = [...visibleStep.querySelectorAll("input, select, textarea")];

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }

  return true;
}

function updateReview() {
  const fields = [
    ["Full name", "fullName"],
    ["Email", "email"],
    ["Country", "country"],
    ["Education level", "educationLevel"],
    ["Institution", "institution"],
    ["Program", "program"],
    ["Funding type", "fundingType"],
    ["Requested amount (USD)", "requestedAmount"]
  ];

  reviewSummary.replaceChildren();

  const heading = document.createElement("h3");
  heading.textContent = "Application summary";
  reviewSummary.appendChild(heading);

  const list = document.createElement("dl");

  for (const [label, fieldName] of fields) {
    const field = form.elements.namedItem(fieldName);

    const term = document.createElement("dt");
    term.textContent = label;

    const value = document.createElement("dd");
    value.textContent = field.value || "Not provided";

    list.append(term, value);
  }

  reviewSummary.appendChild(list);
}

nextButton.addEventListener("click", () => {
  if (!validateCurrentStep()) return;

  showStep(Math.min(currentStep + 1, steps.length - 1));
});

previousButton.addEventListener("click", () => {
  showStep(Math.max(currentStep - 1, 0));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) return;

  formMessage.textContent =
    "The form is ready, but submissions are not enabled yet. Connect a secure backend before accepting real applications.";

  formMessage.style.color = "#175bd6";
});

showStep(0);
```
