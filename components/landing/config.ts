/* =====================================================================
   CONFIG — the only things you need to fill in
   ===================================================================== */
export const CONFIG = {
  // 1) HeyGen intro video: paste the embed/share URL (leave "" to keep the placeholder)
  videoEmbed: "", // e.g. "https://app.heygen.com/embeds/xxxxxxxx"

  // 2) The PDF template you're giving away (lives in /public)
  pdfUrl: "/Clinic_BMC_Starter_Template_v0.1.pdf",

  // 3) Your WhatsApp community invite link
  whatsappUrl: "https://chat.whatsapp.com/KGUE0j8JlJiIrlnF2tclCb",

  // 4) Where to send the collected leads. Leave "" and it will still work as a
  //    demo (shows success + download). To capture data, paste ONE of:
  //    - a Formspree / Getform endpoint, OR
  //    - your Google Apps Script web-app URL, OR
  //    - your CRM / TeleCRM webhook URL.
  //    Default: our own Prisma/Neon-backed API route that feeds the dashboard.
  submitEndpoint: "/api/leads",
};
