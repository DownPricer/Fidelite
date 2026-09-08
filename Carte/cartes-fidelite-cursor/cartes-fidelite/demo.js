"use strict";
// Paliers EXEMPLES lus sur les visuels. À remplacer par les règles de ton application.
// Le niveau Or reste maximal ici pour reprendre le texte de la carte fournie.
// Si Diamant suit Or dans ton programme, renseigner nextTier et nextThreshold pour Or.
const examples = {
  bronze: { points: 12450, currentThreshold: 0, nextThreshold: 50000, nextTier: "Argent" },
  argent: { points: 72450, currentThreshold: 50000, nextThreshold: 100000, nextTier: "Or" },
  or: { points: 128900, isMaxTier: true },
  diamant: { points: 250000, isMaxTier: true }
};
const cards = Object.fromEntries(Object.entries(examples).map(([tier, values]) => [
  tier,
  LoyaltyCard.mount("#card-" + tier, {
    tier, name: "Marie Terese", ...values,
    qrSrc: "./assets/qr-demo.svg", qrMode: "engraved"
  })
]));

document.querySelector("#client-name").addEventListener("input", event => {
  const name = event.target.value.trim() || "Nom du client";
  Object.values(cards).forEach(card => card.update({ name }));
});
document.querySelector("#qr-mode").addEventListener("change", event => {
  Object.values(cards).forEach(card => card.update({ qrMode: event.target.value }));
});
document.querySelector("#preview-width").addEventListener("change", event => {
  document.querySelector("#cards").dataset.width = event.target.value;
});
Object.keys(cards).forEach(tier => {
  document.querySelector("#points-" + tier).addEventListener("input", event => {
    if (event.target.value !== "" && event.target.validity.valid) cards[tier].update({ points: event.target.valueAsNumber });
  });
});
document.querySelector("#reset-demo").addEventListener("click", () => {
  document.querySelector("#client-name").value = "Marie Terese";
  document.querySelector("#qr-mode").value = "engraved";
  document.querySelector("#preview-width").value = "collection";
  document.querySelector("#cards").dataset.width = "collection";
  Object.entries(cards).forEach(([tier, card]) => {
    document.querySelector("#points-" + tier).value = examples[tier].points;
    card.update({ name: "Marie Terese", ...examples[tier], qrMode: "engraved" });
  });
});
