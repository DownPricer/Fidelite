/* Sans framework. Le serveur reste la source de vérité pour points et niveau. */
(function (root) {
  "use strict";
  const LABELS = Object.freeze({ bronze: "Bronze", argent: "Argent", or: "Or", diamant: "Diamant" });
  const numberFormat = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
  const formatPoints = value => numberFormat.format(value);

  function nonNegativeNumber(value, key) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      throw new TypeError(key + " doit être un nombre positif ou nul.");
    }
    return value;
  }

  function getViewModel(client) {
    if (!Object.hasOwn(LABELS, client.tier)) throw new TypeError("Niveau inconnu : bronze, argent, or ou diamant attendu.");
    if (typeof client.name !== "string" || !client.name.trim()) throw new TypeError("Le nom du client est requis.");
    const points = Math.round(nonNegativeNumber(client.points, "points"));
    let progress = 0;
    let status = "";
    if (client.nextThreshold != null) {
      const from = nonNegativeNumber(client.currentThreshold ?? 0, "currentThreshold");
      const to = nonNegativeNumber(client.nextThreshold, "nextThreshold");
      if (to <= from) throw new RangeError("nextThreshold doit être supérieur à currentThreshold.");
      if (typeof client.nextTier !== "string" || !client.nextTier.trim()) throw new TypeError("nextTier est requis avec nextThreshold.");
      progress = Math.max(0, Math.min(100, (points - from) / (to - from) * 100));
      status = "Vers " + client.nextTier + " · " + formatPoints(Math.max(0, to - points)) + " pts restants";
    } else if (client.isMaxTier === true) {
      progress = 100;
      status = client.tier === "diamant" ? "Statut ultime atteint" : "Statut maximal atteint";
    }
    // Facultatif : valeurs déjà calculées côté application ou pour reproduire une maquette.
    if (client.progressPercent != null) {
      progress = Math.min(100, nonNegativeNumber(client.progressPercent, "progressPercent"));
    }
    if (client.statusText != null) status = String(client.statusText);
    const qrMode = client.qrMode ?? "engraved";
    if (!["engraved", "standard"].includes(qrMode)) throw new TypeError("qrMode : engraved ou standard attendu.");
    return { ...client, name: client.name.trim(), points, tierLabel: LABELS[client.tier], progress, status, qrMode };
  }

  function safeImageUrl(value) {
    if (!value) return "";
    if (typeof value !== "string") throw new TypeError("qrSrc doit être une URL d'image.");
    const url = new URL(value, document.baseURI);
    const allowed = ["http:", "https:", "blob:", "file:"].includes(url.protocol)
      || /^data:image\/(png|jpeg|webp|gif|svg\+xml)[;,]/i.test(value);
    if (!allowed) throw new TypeError("Format de qrSrc non autorisé.");
    return url.href;
  }

  const TEMPLATE = `
    <header class="loyalty-card__heading">
      <p class="loyalty-card__eyebrow">MEMBRE</p>
      <h2 class="loyalty-card__tier"></h2>
    </header>
    <div class="loyalty-card__qr">
      <img class="loyalty-card__qr-image" alt="" hidden>
      <span class="loyalty-card__qr-placeholder">QR CLIENT</span>
    </div>
    <p class="loyalty-card__name"></p>
    <p class="loyalty-card__points"></p>
    <p class="loyalty-card__status"></p>
    <div class="loyalty-card__progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
      <span class="loyalty-card__progress-fill"></span>
    </div>`;

  function mount(target, initialClient) {
    const host = typeof target === "string" ? document.querySelector(target) : target;
    if (!host || !host.appendChild) throw new TypeError("Conteneur de carte introuvable.");
    let state = {};
    const card = document.createElement("article");
    card.className = "loyalty-card";
    card.innerHTML = TEMPLATE; // Structure fixe : aucune donnée client interpolée ici.
    const el = name => card.querySelector(".loyalty-card__" + name);
    const qr = el("qr-image");
    const placeholder = el("qr-placeholder");
    qr.addEventListener("error", () => {
      qr.hidden = true;
      placeholder.hidden = false;
      placeholder.textContent = "QR INDISPONIBLE";
    });
    qr.addEventListener("load", () => { qr.hidden = false; placeholder.hidden = true; });

    function update(patch) {
      const next = { ...state, ...patch };
      const data = getViewModel(next);
      const qrSrc = safeImageUrl(data.qrSrc);
      state = next;
      card.dataset.tier = data.tier;
      card.dataset.qrMode = data.qrMode;
      card.setAttribute("aria-label", "Carte " + data.tierLabel + " de " + data.name);
      el("tier").textContent = data.tierLabel;
      el("name").textContent = data.name;
      el("name").title = data.name;
      el("name").dataset.length = data.name.length > 42 ? "very-long" : data.name.length > 23 ? "long" : "normal";
      const pointsText = formatPoints(data.points) + " pts";
      el("points").textContent = pointsText;
      el("points").dataset.length = pointsText.length > 20 ? "very-long" : pointsText.length > 14 ? "long" : "normal";
      el("status").textContent = data.status;
      el("status").title = data.status;
      el("status").dataset.length = data.status.length > 53 ? "long" : "normal";
      card.style.setProperty("--progress", data.progress + "%");
      el("progress").setAttribute("aria-valuenow", String(Math.round(data.progress * 10) / 10));
      el("progress").setAttribute("aria-label", data.status || "Progression du membre");
      el("progress").setAttribute("aria-valuetext", data.status || Math.round(data.progress) + " %");
      const hasProgress = data.nextThreshold != null || data.isMaxTier === true || data.progressPercent != null;
      el("progress").hidden = !hasProgress;
      qr.alt = "QR code de " + data.name;
      if (qrSrc) {
        if (qr.getAttribute("src") !== qrSrc) {
          qr.hidden = true;
          placeholder.hidden = false;
          placeholder.textContent = "QR CLIENT";
          qr.src = qrSrc;
        }
      } else {
        qr.removeAttribute("src");
        qr.hidden = true;
        placeholder.hidden = false;
        placeholder.textContent = "QR CLIENT";
      }
      return api;
    }
    const api = { element: card, update, destroy: () => card.remove() };
    update(initialClient);
    host.appendChild(card);
    return api;
  }

  const api = Object.freeze({ mount, getViewModel, formatPoints });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.LoyaltyCard = api;
})(typeof window !== "undefined" ? window : this);
