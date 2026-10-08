function hostnameOnly(hostOrHostname: string) {
  return hostOrHostname.split(":")[0]?.toLowerCase() ?? "";
}

/** Enregistre le service worker uniquement sur les hôtes PWA client et commerçant. */
export function shouldRegisterFidetoServiceWorker(hostOrHostname: string): boolean {
  const name = hostnameOnly(hostOrHostname);
  const customerHosts = [
    process.env.NEXT_PUBLIC_CUSTOMER_HOST ?? process.env.CUSTOMER_HOST ?? "fideto.fr",
    "fidelite.sitereadyshd.fr",
    "localhost",
    "127.0.0.1",
  ].map((h) => hostnameOnly(h));
  const appHosts = [
    process.env.NEXT_PUBLIC_APP_HOST ?? process.env.APP_HOST ?? "app.fideto.fr",
    "app-fidelite.sitereadyshd.fr",
  ].map((h) => hostnameOnly(h));
  return customerHosts.includes(name) || appHosts.includes(name);
}
