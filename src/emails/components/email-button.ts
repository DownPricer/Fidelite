import { escapeHtml } from "./escape-html";

export function emailPrimaryButton(label: string, href: string) {
  return `<p style="text-align:center;margin:24px 0;"><a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;text-decoration:none;font-size:15px;">${escapeHtml(label)}</a></p>`;
}
