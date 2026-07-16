const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));
}

document.querySelectorAll(".faq-list article").forEach((article) => {
  const button = article.querySelector("button");
  button.addEventListener("click", () => {
    const opening = !article.classList.contains("open");
    document.querySelectorAll(".faq-list article").forEach((item) => {
      item.classList.remove("open");
      item.querySelector("button").setAttribute("aria-expanded", "false");
      item.querySelector("i").textContent = "+";
    });
    if (opening) {
      article.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      button.querySelector("i").textContent = "−";
    }
  });
});

const packages = {
  smile: { name: "The Smile", price: 599, hours: "2 hours" },
  signature: { name: "Ready Set Smile", price: 899, hours: "4 hours" }
};

const packageCards = [...document.querySelectorAll(".package-card[data-package]")];
const upgradeInputs = [...document.querySelectorAll(".upgrade-list input")];
let selectedPackage = new URLSearchParams(window.location.search).get("package") === "smile" ? "smile" : "signature";

function updateEstimate() {
  const name = document.querySelector("#quote-package-name");
  const meta = document.querySelector("#quote-package-meta");
  const totalElement = document.querySelector("#estimate-total");
  if (!name || !meta || !totalElement) return;

  const active = packages[selectedPackage];
  const checked = upgradeInputs.filter((input) => input.checked);
  const extras = checked.map((input) => input.dataset.label);
  const total = active.price + checked.reduce((sum, input) => sum + Number(input.dataset.price), 0);

  name.textContent = active.name;
  meta.textContent = `${active.hours} · $${active.price}`;
  totalElement.textContent = `$${total}`;

  const body = `Hi Ready Set Smile!\n\nI’m interested in ${active.name} (${active.hours}).\nUpgrades: ${extras.join(", ") || "None selected"}\nEstimated starting total: $${total}\n\nEvent date:\nVenue:\nEvent type:\n\nThank you!`;
  const href = `mailto:info@readysetsmilebooth.com?subject=${encodeURIComponent(`Photo booth inquiry — ${active.name}`)}&body=${encodeURIComponent(body)}`;
  document.querySelectorAll(".inquiry-link").forEach((link) => { link.href = href; });
}

function selectPackage(packageName, scroll = false) {
  selectedPackage = packageName;
  packageCards.forEach((card) => {
    const selected = card.dataset.package === packageName;
    card.classList.toggle("selected", selected);
    card.setAttribute("aria-pressed", String(selected));
    const label = card.querySelector(".select-label");
    if (label) label.textContent = selected ? "Selected ✓" : "Choose this package →";
  });
  updateEstimate();
  if (scroll) document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth" });
}

packageCards.forEach((card) => card.addEventListener("click", () => selectPackage(card.dataset.package, true)));
upgradeInputs.forEach((input) => input.addEventListener("change", updateEstimate));
if (packageCards.length) selectPackage(selectedPackage);

const lightbox = document.querySelector(".lightbox");
if (lightbox) {
  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector("p");
  document.querySelectorAll(".gallery-open").forEach((button) => {
    button.addEventListener("click", () => {
      const source = button.dataset.lightboxSrc || button.querySelector("img")?.src;
      const description = button.dataset.lightboxCaption || button.querySelector("img")?.alt || "Ready Set Smile event photo";
      image.src = source;
      image.alt = description;
      caption.textContent = description;
      lightbox.showModal();
    });
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}

const inquiryForm = document.querySelector("#inquiry-form");
if (inquiryForm) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(inquiryForm);
    const lines = [
      "Hi Ready Set Smile!",
      "",
      "I’d like to check availability for my event.",
      "",
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "Not provided"}`,
      `Event date: ${data.get("date") || "Not decided"}`,
      `Event type: ${data.get("eventType")}`,
      `Venue or city: ${data.get("venue") || "Not decided"}`,
      `Package: ${data.get("package")}`,
      `Estimated guest count: ${data.get("guests") || "Not sure"}`,
      "",
      "Notes:",
      data.get("message") || "None"
    ];
    const subject = encodeURIComponent(`Photo booth availability — ${data.get("eventType")}`);
    const body = encodeURIComponent(lines.join("\n"));
    document.querySelector("#form-status").textContent = "Your email app is opening with your event details.";
    window.location.href = `mailto:info@readysetsmilebooth.com?subject=${subject}&body=${body}`;
  });
}
