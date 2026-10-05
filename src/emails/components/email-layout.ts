import { escapeHtml } from "./escape-html";

export function violetEmailLayout(title: string, bodyHtml: string) {
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#0b0f19;font-family:Segoe UI,sans-serif;">
<table role="presentation" width="100%" style="background:#0b0f19;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:520px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:32px;">
<tr><td><h1 style="margin:0 0 16px;font-size:22px;color:#f8fafc;">${escapeHtml(title)}</h1>${bodyHtml}</td></tr>
</table></td></tr></table></body></html>`;
}

export function darkEmailDocument(innerTableRows: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:0;background:#0b0f19;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b0f19;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:32px;">
        ${innerTableRows}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
