import { escapeHtml } from "./escape-html";

export function violetEmailLayout(title: string, bodyHtml: string) {
  return darkEmailDocument(`<tr>
  <td style="padding:38px 40px 40px;">
    <p style="margin:0 0 12px;color:#b993ff;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:11px;font-weight:800;line-height:16px;letter-spacing:1.5px;text-transform:uppercase;">Votre espace Fideto</p>
    <h1 style="margin:0 0 18px;color:#ffffff;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:30px;font-weight:800;line-height:36px;letter-spacing:-0.8px;">${escapeHtml(title)}</h1>
    <div style="color:#d8d0e3;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:16px;line-height:25px;">${bodyHtml}</div>
  </td>
</tr>`);
}

export function darkEmailDocument(innerTableRows: string) {
  return `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Fideto</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0710;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#0a0710" style="width:100%;background-color:#0a0710;">
    <tr>
      <td align="center" style="padding:34px 16px 40px;background-color:#0a0710;background-image:radial-gradient(circle at 50% 0%,#241035 0%,#0a0710 52%);">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;">
          <tr>
            <td align="left" style="padding:0 4px 22px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="38" height="38" align="center" valign="middle" bgcolor="#7c36ed" style="width:38px;height:38px;border-radius:19px;background-color:#7c36ed;background-image:linear-gradient(135deg,#7137ff,#b43cff);color:#ffffff;font-family:Arial,sans-serif;font-size:23px;font-weight:400;line-height:38px;">&#9675;</td>
                  <td style="padding-left:11px;color:#ffffff;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:20px;font-weight:800;line-height:24px;letter-spacing:-0.4px;">Fideto</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#17111f" style="background-color:#17111f;border:1px solid #342641;border-radius:22px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,0.42);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;">
                ${innerTableRows}
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:22px 18px 0;color:#81758e;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;">
              <strong style="color:#a89caf;font-weight:700;">Une seule carte. Toutes vos fidélités.</strong><br>
              Fideto · La fidélité, enfin simple.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
