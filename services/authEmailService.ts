import { Resend } from "resend";

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envia email com magic link para autenticação
 */
export async function sendMagicLinkEmail(
  email: string,
  url: string
): Promise<void> {
  const subject = "Acesso ao Dashboard FitScore - LEGAL";

  const html = generateMagicLinkHTML(url);
  const text = generateMagicLinkText(url);

  try {
    await resend.emails.send({
      from: "FitScore <noreply@legal.com>",
      to: email,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Erro ao enviar magic link:", error);
    throw new Error("Falha ao enviar email de autenticação");
  }
}

// Template HTML para magic link
function generateMagicLinkHTML(url: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Acesso ao Dashboard FitScore</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1f2937;">Acesso ao Dashboard FitScore</h1>
        <p style="color: #6b7280;">Sistema de gestão LEGAL</p>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2>Olá!</h2>
        <p>Você solicitou acesso ao dashboard do FitScore. Clique no botão abaixo para fazer login:</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Acessar Dashboard
        </a>
      </div>
      
      <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; color: #92400e;">
          <strong>Importante:</strong> Este link expira em 24 horas e só pode ser usado uma vez.
        </p>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          Se você não solicitou este acesso, pode ignorar este email com segurança.
        </p>
      </div>
    </body>
    </html>
  `;
}

// Template texto para magic link
function generateMagicLinkText(url: string): string {
  return `
Acesso ao Dashboard FitScore - LEGAL

Olá!

Você solicitou acesso ao dashboard do FitScore. 

Clique no link abaixo para fazer login:
${url}

Importante: Este link expira em 24 horas e só pode ser usado uma vez.

Se você não solicitou este acesso, pode ignorar este email com segurança.

Sistema FitScore - LEGAL
  `;
}
