(function () {
  "use strict";

  const phone = "254119539151";
  const message = "Hello! I need help with the Student Aid Portal.";
  const chatUrl = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

  if (document.getElementById("sap-whatsapp-widget")) return;

  const wrapper = document.createElement("div");
  wrapper.id = "sap-whatsapp-widget";

  wrapper.innerHTML = `
    <div class="sap-wa-popup" id="sap-wa-popup" hidden>
      <div class="sap-wa-header">
        <div class="sap-wa-avatar">WA</div>
        <div>
          <strong>Student Aid Portal</strong>
          <small>WhatsApp Support</small>
        </div>
        <button class="sap-wa-close" aria-label="Close popup">&times;</button>
      </div>
      <div class="sap-wa-content">
        <p>Hello! 👋 Welcome to Student Aid Portal.</p>
        <p>Need help with student funding or your account?</p>
        <a class="sap-wa-start" href="${chatUrl}" target="_blank"
           rel="noopener noreferrer">Chat with us on WhatsApp</a>
      </div>
    </div>
    <button class="sap-wa-button" type="button" aria-expanded="false"
            aria-controls="sap-wa-popup">
      <span class="sap-wa-icon">☏</span> Chat with us
    </button>
  `;

  document.body.appendChild(wrapper);

  const button = wrapper.querySelector(".sap-wa-button");
  const popup = wrapper.querySelector(".sap-wa-popup");
  const close = wrapper.querySelector(".sap-wa-close");

  button.addEventListener("click", function () {
    popup.hidden = !popup.hidden;
    button.setAttribute("aria-expanded", String(!popup.hidden));
  });

  close.addEventListener("click", function () {
    popup.hidden = true;
    button.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      popup.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }
  });
})();
