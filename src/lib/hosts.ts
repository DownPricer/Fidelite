import { env } from "./env";

function hostnameOf(hostHeader: string) {
  return hostHeader.split(":")[0]?.toLowerCase() ?? "";
}

export function isLocalHost(host: string) {
  const name = hostnameOf(host);
  return name === "localhost" || name === "127.0.0.1";
}

export function isAdminHost(host: string) {
  return hostnameOf(host) === env.adminHost.toLowerCase();
}

export function isAppHost(host: string) {
  return hostnameOf(host) === env.appHost.toLowerCase();
}

export function isCustomerHost(host: string) {
  return hostnameOf(host) === env.customerHost.toLowerCase();
}

export function publicCustomerUrl(path = "/") {
  if (env.customerOrigin) {
    return `${env.customerOrigin.replace(/\/$/, "")}${path}`;
  }
  return path;
}
