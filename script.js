const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

const closeMenu = () => {
  body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open menu");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

nav
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 130);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll(".package-select").forEach((button) => {
  button.addEventListener("click", () => {
    const chosenPackage = button.dataset.package || "Not sure yet";
    const packageInput = document.querySelector("[data-package-input]");
    if (packageInput) packageInput.value = chosenPackage;

    document
      .querySelector("#inquire")
      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    window.setTimeout(
      () => document.querySelector('input[name="name"]')?.focus(),
      reducedMotion ? 0 : 650,
    );
  });
});

const form = document.querySelector("[data-inquiry-form]");
const formNote = document.querySelector("[data-form-note]");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const name = formData.get("name");
  const email = formData.get("email");
  const date = formData.get("date");
  const eventType = formData.get("eventType");
  const venue = formData.get("venue");
  const selectedPackage = formData.get("package");
  const message = formData.get("message") || "No additional details provided.";

  const subject = `Photo booth inquiry — ${eventType} on ${date}`;
  const emailBody = [
    "Hi Ready Set Smile,",
    "",
    `I would like to check availability for my ${eventType}.`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Event date: ${date}`,
    `Venue or city: ${venue}`,
    `Package: ${selectedPackage}`,
    "",
    "Additional details:",
    message,
    "",
    "Thank you!",
  ].join("\n");

  const mailto = `mailto:info@readysetsmilebooth.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
  if (formNote)
    formNote.textContent =
      "Your email draft is ready. Send it to complete your inquiry.";
  window.location.href = mailto;
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
