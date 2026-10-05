import { escapeHtml } from "./escape-html";

export function emailPrimaryButton(label: string, href: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:28px auto 8px;">
  <tr>
    <td align="center" bgcolor="#8b3dff" style="border-radius:14px;background-color:#8b3dff;background-image:linear-gradient(135deg,#7137ff 0%,#b43cff 100%);box-shadow:0 10px 30px rgba(139,61,255,0.28);">
      <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:15px 24px;color:#ffffff;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;font-weight:800;line-height:20px;text-decoration:none;letter-spacing:-0.1px;">${escapeHtml(label)}&nbsp;&nbsp;<span aria-hidden="true">&rarr;</span></a>
    </td>
  </tr>
</table>`;
}
