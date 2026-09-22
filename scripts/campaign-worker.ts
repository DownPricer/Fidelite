/**
 * Worker de campagnes (Partie 15) — traite les campagnes SCHEDULED par lots, en boucle.
 * Lancement : `npm run worker` (voir package.json) ou service Docker dédié `worker`
 * (voir deploy/docker-compose.yml). Ne traite jamais deux fois la même campagne
 * (claimNextScheduledCampaign utilise `FOR UPDATE SKIP LOCKED`) et reprend proprement
 * après un redémarrage (une campagne bloquée en SENDING redevient réclamable après 15 min).
 */
import { env } from "../src/lib/env";
import { runWorkerTick } from "../src/lib/campaign-worker";

let shuttingDown = false;

function log(message: string, extra?: Record<string, unknown>) {
  // Jamais de données personnelles dans les logs (Partie 15) : uniquement ids/compteurs.
  console.log(`[campaign-worker] ${message}`, extra ? JSON.stringify(extra) : "");
}

async function loop() {
  log("démarré", { intervalMs: env.campaignWorkerIntervalMs, batchSize: env.campaignWorkerBatchSize });

  while (!shuttingDown) {
    try {
      const result = await runWorkerTick();
      if (result.claimed) {
        log("campagne traitée", {
          campaignId: result.campaignId,
          processed: result.processed,
          finalStatus: result.finalStatus,
        });
        // Une campagne vient d'être traitée : on enchaîne immédiatement au cas où
        // d'autres campagnes/lots restent en attente, sans attendre l'intervalle.
        continue;
      }
    } catch (error) {
      log("erreur de tick", { error: error instanceof Error ? error.message : String(error) });
    }

    await sleep(env.campaignWorkerIntervalMs);
  }

  log("arrêt propre terminé");
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function requestShutdown(signal: string) {
  log("signal reçu, arrêt après le lot en cours", { signal });
  shuttingDown = true;
}

process.on("SIGTERM", () => requestShutdown("SIGTERM"));
process.on("SIGINT", () => requestShutdown("SIGINT"));

loop().catch((error) => {
  console.error("[campaign-worker] arrêt sur erreur fatale", error);
  process.exit(1);
});
