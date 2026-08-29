import Link from "next/link";
import { BrandMark, Card } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-surface text-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
        <section className="max-w-xl">
          <BrandMark className="mb-10" />
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            La fidélité claire, sans application à installer.
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            Vos clients scannent un QR simple au comptoir, présentent leur carte digitale à chaque visite
            et gagnent automatiquement des points vers leur récompense.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/c/cafe-demo"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-bold tracking-tight text-primary-foreground shadow-sm shadow-primary/20 hover:opacity-90 active:scale-[0.98]"
            >
              Voir l’exemple Café Demo
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-bold tracking-tight text-ink shadow-sm hover:bg-slate-50 active:scale-[0.98]"
            >
              Accéder à mon espace client
            </Link>
          </div>
          <p className="mt-8 text-sm font-medium text-muted">
            Commerçants :{" "}
            <Link href="/app/connexion" className="text-primary underline underline-offset-4">
              app-fidelite.sitereadyshd.fr
            </Link>
            {" · "}
            Super-admin :{" "}
            <Link href="/admin/connexion" className="text-primary underline underline-offset-4">
              admin-fidelite.sitereadyshd.fr
            </Link>
          </p>
        </section>

        <section className="flex-1 max-w-md">
          <Card className="border border-border/60 shadow-premium">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60">
              Exemple temps réel
            </p>
            <h2 className="mt-3 text-xl font-black tracking-tight">Une visite = 1 point</h2>
            <p className="mt-2 text-sm text-muted">
              10 points = une boisson offerte. Aucune carte papier à tamponner, aucune app à installer.
            </p>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  1
                </span>
                <div>
                  <p className="font-semibold">Votre client scanne ou touche le badge au comptoir.</p>
                  <p className="text-muted text-xs mt-0.5">Il crée sa carte en quelques secondes.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  2
                </span>
                <div>
                  <p className="font-semibold">À chaque visite, vous scannez son QR ou sa carte.</p>
                  <p className="text-muted text-xs mt-0.5">Le passage est ajouté instantanément en caisse.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  3
                </span>
                <div>
                  <p className="font-semibold">Dès que la récompense est prête, le client l’utilise.</p>
                  <p className="text-muted text-xs mt-0.5">Tout est tracé dans votre espace commerçant.</p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
