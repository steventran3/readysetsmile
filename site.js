const packages = {
  smile: { name: "The Smile", price: 599, hours: "2 hours" },
  signature: { name: "Ready Set Smile", price: 899, hours: "4 hours" }
};

let selectedPackage = "signature";
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

menuButton.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

function updateEstimate() {
  const active = packages[selectedPackage];
  const checked = [...document.querySelectorAll('.upgrade-list input:checked')];
  const extras = checked.map((input) => input.dataset.label);
  const total = active.price + checked.reduce((sum, input) => sum + Number(input.dataset.price), 0);
  document.querySelector("#quote-package-name").textContent = active.name;
  document.querySelector("#quote-package-meta").textContent = `${active.hours} · $${active.price}`;
  document.querySelector("#estimate-total").textContent = `$${total}`;
  const body = `Hi Ready Set Smile!\n\nI’m interested in ${active.name} (${active.hours}).\nUpgrades: ${extras.join(", ") || "None selected"}\nEstimated starting total: $${total}\n\nEvent date:\nVenue:\nEvent type:\n\nThank you!`;
  const href = `mailto:info@readysetsmilebooth.com?subject=${encodeURIComponent(`Photo booth inquiry — ${active.name}`)}&body=${encodeURIComponent(body)}`;
  document.querySelectorAll(".inquiry-link").forEach((link) => link.href = href);
}

document.querySelectorAll(".package-card").forEach((card) => card.addEventListener("click", () => {
  selectedPackage = card.dataset.package;
  document.querySelectorAll(".package-card").forEach((item) => {
    const selected = item === card;
    item.classList.toggle("selected", selected);
    item.setAttribute("aria-pressed", String(selected));
    item.querySelector(".select-label").textContent = selected ? "Selected ✓" : "Choose this package →";
  });
  updateEstimate();
  document.querySelector("#quote").scrollIntoView({ behavior: "smooth" });
}));

document.querySelectorAll(".upgrade-list input").forEach((input) => input.addEventListener("change", updateEstimate));

document.querySelectorAll(".faq-list article").forEach((article) => {
  article.querySelector("button").addEventListener("click", () => {
    const opening = !article.classList.contains("open");
    document.querySelectorAll(".faq-list article").forEach((item) => {
      item.classList.remove("open");
      item.querySelector("button").setAttribute("aria-expanded", "false");
      item.querySelector("i").textContent = "+";
    });
    if (opening) {
      article.classList.add("open");
      article.querySelector("button").setAttribute("aria-expanded", "true");
      article.querySelector("i").textContent = "−";
    }
  });
});

updateEstimate();
