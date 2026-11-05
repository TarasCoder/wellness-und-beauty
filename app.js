const menu = document.querySelector(".menu"),
  mobileNav = document.querySelector("#mobile-nav");
function closeMenu() {
  mobileNav.hidden = true;
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Menü öffnen");
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
const select = document.querySelector("#massage"),
  status = document.querySelector("#booking-status");
function updateBooking() {
  const message =
    "Guten Tag Frau Weckner, ich interessiere mich für: " +
    select.value.replace(/\.$/, "") +
    ". Gerne würde ich einen Termin mit Ihnen vereinbaren.";
  document.querySelector("#booking-button").href = "https://wa.me/491733905024?text=" + encodeURIComponent(message);
  document.querySelector("#email-booking").href =
    "mailto:rui.weckner@gmail.com?subject=" +
    encodeURIComponent("Terminanfrage · Wellness & Beauty") +
    "&body=" +
    encodeURIComponent(message);
  status.textContent = "";
}
select.addEventListener("change", updateBooking);
document.querySelectorAll("[data-service]").forEach((a) =>
  a.addEventListener("click", () => {
    select.value = a.dataset.service;
    updateBooking();
  }),
);
updateBooking();
document.querySelectorAll("[data-open-price]").forEach((a) =>
  a.addEventListener("click", () => {
    const target = document.getElementById(a.dataset.openPrice);
    target.open = true;
  }),
);
const dialog = document.querySelector("#legal-dialog");
const legal = {
  impressum: {
    title: "Impressum",
    html:
      "<p><strong>Angaben zur Anbieterin</strong></p><p>Wellness & Beauty<br>Irina Weckner<br>Lindenweg 11<br>91332 Heiligenstadt, Deutschland</p><p>Telefon: 09198 3429971<br>Mobil: 0173 3905024<br>E-Mail: rui.weckner@gmail.com</p><p><strong>Entwurf – rechtliche Prüfung ausstehend.</strong><br>[Weitere tatsächlich erforderliche Angaben vor dem öffentlichen Einsatz ergänzen. Es wurden keine Register- oder Steuernummern erfunden.]</p>",
  },
  datenschutz: {
    title: "Datenschutzerklärung",
    html:
      "<p><strong>Entwurf – keine vollständige Datenschutzerklärung.</strong></p><p>Ansprechpartnerin: Irina Weckner, Lindenweg 11, 91332 Heiligenstadt. E-Mail: rui.weckner@gmail.com.</p><p>[Die tatsächliche Datenverarbeitung einschließlich Hosting, Zugriffsdaten, Kontaktaufnahme per Telefon, E-Mail und WhatsApp, Rechtsgrundlagen, Empfänger, Speicherdauer und Betroffenenrechte vor dem öffentlichen Einsatz prüfen und ergänzen.]</p><p>Diese Website integriert keine Analysewerkzeuge, externen Schriftarten, eingebetteten Karten oder Buchungsdienste. Die Anwendungsauswahl wird nicht dauerhaft gespeichert. Erst wenn Sie einen Kontaktlink öffnen, wechseln Sie zu WhatsApp, Ihrem E-Mail-Programm oder Ihrer Telefon-App. Nachrichten versenden Sie dort selbst. Google Maps wird nur über einen Link geöffnet.</p>",
  },
};
document.querySelectorAll("[data-legal]").forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const item = legal[a.dataset.legal];
    document.querySelector("#legal-title").textContent = item.title;
    document.querySelector("#legal-content").innerHTML = item.html;
    dialog.showModal();
  }),
);
const imageDialog = document.querySelector("#image-dialog");
document.querySelectorAll("[data-image]").forEach((button) =>
  button.addEventListener("click", () => {
    document.querySelector("#image-title").textContent = button.dataset.title;
    const image = document.querySelector("#large-image");
    image.src = button.dataset.image;
    image.alt = button.querySelector("img").alt;
    imageDialog.showModal();
  }),
);
[dialog, imageDialog].forEach((d) => {
  d.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => d.close()));
  d.addEventListener("click", (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
    }
  });
});

const studioTrack = document.querySelector("#studio-track");
const studioSlides = [...studioTrack.querySelectorAll("figure")],
  studioDots = [...document.querySelectorAll("[data-slide]")];
const studioSelect = document.querySelector("#studio-select");
let studioIndex = 0,
  studioFrame;
function studioState(index) {
  studioIndex = index;
  studioSelect.value = String(index);
  document.querySelector("#studio-count").textContent = `Bild ${index + 1} von ${studioSlides.length}`;
  studioDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
    if (i === index) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
}
function showStudio(index) {
  index = (index + studioSlides.length) % studioSlides.length;
  studioState(index);
  studioTrack.scrollTo({
    left: studioSlides[index].offsetLeft - studioSlides[0].offsetLeft,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
}
document.querySelector("#studio-prev").addEventListener("click", () => showStudio(studioIndex - 1));
document.querySelector("#studio-next").addEventListener("click", () => showStudio(studioIndex + 1));
studioDots.forEach((dot) => dot.addEventListener("click", () => showStudio(Number(dot.dataset.slide))));
studioTrack.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    showStudio(studioIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});
studioTrack.addEventListener(
  "scroll",
  () => {
    cancelAnimationFrame(studioFrame);
    studioFrame = requestAnimationFrame(() => {
      const step = studioSlides[1].offsetLeft - studioSlides[0].offsetLeft;
      studioState(Math.max(0, Math.min(studioSlides.length - 1, Math.round(studioTrack.scrollLeft / step))));
    });
  },
  { passive: true },
);
let studioResize;
window.addEventListener("resize", () => {
  clearTimeout(studioResize);
  studioResize = setTimeout(() => {
    studioTrack.scrollTo({
      left: studioSlides[studioIndex].offsetLeft - studioSlides[0].offsetLeft,
      behavior: "instant",
    });
  }, 100);
});

studioSelect.addEventListener("change", () => showStudio(Number(studioSelect.value)));
const certificateTrack = document.querySelector("#certificate-track");
const certificateSlides = [...certificateTrack.querySelectorAll("figure")];
const certificateSelect = document.querySelector("#certificate-select");
let certificateIndex = 0,
  certificateFrame;
function certificateState(index) {
  certificateIndex = index;
  certificateSelect.value = String(index);
  document.querySelector("#certificate-count").textContent = `Zertifikat ${index + 1} von ${certificateSlides.length}`;
}
function showCertificate(index) {
  index = (index + certificateSlides.length) % certificateSlides.length;
  certificateState(index);
  certificateTrack.scrollTo({
    left: certificateSlides[index].offsetLeft - certificateSlides[0].offsetLeft,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
}
document.querySelector("#certificate-prev").addEventListener("click", () => showCertificate(certificateIndex - 1));
document.querySelector("#certificate-next").addEventListener("click", () => showCertificate(certificateIndex + 1));
certificateSelect.addEventListener("change", () => showCertificate(Number(certificateSelect.value)));
certificateTrack.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    showCertificate(certificateIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});
certificateTrack.addEventListener(
  "scroll",
  () => {
    cancelAnimationFrame(certificateFrame);
    certificateFrame = requestAnimationFrame(() => {
      const step = certificateSlides[1].offsetLeft - certificateSlides[0].offsetLeft;
      certificateState(
        Math.max(0, Math.min(certificateSlides.length - 1, Math.round(certificateTrack.scrollLeft / step))),
      );
    });
  },
  { passive: true },
);
let certificateResize;
window.addEventListener("resize", () => {
  clearTimeout(certificateResize);
  certificateResize = setTimeout(
    () =>
      certificateTrack.scrollTo({
        left: certificateSlides[certificateIndex].offsetLeft - certificateSlides[0].offsetLeft,
        behavior: "instant",
      }),
    100,
  );
});
const reviewTrack = document.querySelector("#review-track"),
  reviewSlides = [...reviewTrack.querySelectorAll("figure")],
  reviewDots = [...document.querySelectorAll("[data-review]")];
let reviewIndex = 0,
  reviewFrame,
  reviewResize;
function reviewState(index) {
  reviewIndex = index;
  document.querySelector("#review-count").textContent = `Bewertung ${index + 1} von ${reviewSlides.length}`;
  reviewDots.forEach((dot, i) => {
    if (i === index) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
}
function showReview(index) {
  index = (index + reviewSlides.length) % reviewSlides.length;
  reviewState(index);
  reviewTrack.scrollTo({
    left: reviewSlides[index].offsetLeft - reviewSlides[0].offsetLeft,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
}
document.querySelector("#review-prev").addEventListener("click", () => showReview(reviewIndex - 1));
document.querySelector("#review-next").addEventListener("click", () => showReview(reviewIndex + 1));
reviewDots.forEach((dot) => dot.addEventListener("click", () => showReview(Number(dot.dataset.review))));
reviewTrack.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    showReview(reviewIndex + (e.key === "ArrowRight" ? 1 : -1));
  }
});
reviewTrack.addEventListener(
  "scroll",
  () => {
    cancelAnimationFrame(reviewFrame);
    reviewFrame = requestAnimationFrame(() => {
      const step = reviewSlides[1].offsetLeft - reviewSlides[0].offsetLeft;
      reviewState(Math.max(0, Math.min(reviewSlides.length - 1, Math.round(reviewTrack.scrollLeft / step))));
    });
  },
  { passive: true },
);
window.addEventListener("resize", () => {
  clearTimeout(reviewResize);
  reviewResize = setTimeout(
    () =>
      reviewTrack.scrollTo({
        left: reviewSlides[reviewIndex].offsetLeft - reviewSlides[0].offsetLeft,
        behavior: "instant",
      }),
    100,
  );
});
