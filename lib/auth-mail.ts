import nodemailer from "nodemailer";

/**
 * Send the magic-link email.
 * - If EMAIL_SERVER + EMAIL_FROM are set, send via that SMTP transport (Resend).
 * - Otherwise, dev-mode: log to console and return the link in the response.
 *
 * Returns whether the link was actually sent (vs. just logged).
 */
export async function sendMagicLink(opts: {
  to: string;
  url: string;
}): Promise<{ delivered: boolean; provider: string }> {
  const server = process.env.EMAIL_SERVER;
  const from = process.env.EMAIL_FROM;

  if (!server || !from) {
    console.log("[auth][dev-mode] magic link for", opts.to, "→", opts.url);
    return { delivered: false, provider: "dev-log" };
  }

  try {
    const transport = nodemailer.createTransport(server);
    await transport.sendMail({
      from,
      to: opts.to,
      subject: "Logga in på Kataloghub",
      text: `Klicka här för att logga in:\n\n${opts.url}\n\nLänken är giltig i 15 minuter.\n`,
      html: `<p>Klicka här för att logga in på Kataloghub:</p>
        <p><a href="${opts.url}">${opts.url}</a></p>
        <p style="color:#666;font-size:12px">Länken är giltig i 15 minuter.</p>`,
    });
    return { delivered: true, provider: "smtp" };
  } catch (err) {
    console.error("[auth][smtp-fail] falling back to dev-mode log:", err);
    console.log("[auth][dev-mode] magic link for", opts.to, "→", opts.url);
    return { delivered: false, provider: "dev-log-fallback" };
  }
}
