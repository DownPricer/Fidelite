export default function AccountDeletedPage() {
  return (
    <main className="obsidian-scene flex min-h-dvh items-center justify-center px-6 text-center text-[var(--ink-soft)]">
      <div className="glass-panel max-w-sm p-8">
        <h1 className="text-xl font-bold text-[var(--ink)]">Compte supprimé</h1>
        <p className="mt-3 text-sm text-[var(--muted-strong)]">
          Votre compte a été désactivé. Vous disposez de 14 jours pour contacter le support si vous souhaitez
          annuler cette demande.
        </p>
        <a href="/connexion" className="profile-btn-primary mt-6 inline-block px-6 py-3 text-sm font-semibold">
          Retour à la connexion
        </a>
      </div>
    </main>
  );
}
