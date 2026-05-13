import { resend } from '../../../email';
import { AuthUser } from '../../shared';

const templateCache = new Map<string, string>();

const FROM_EMAIL = 'Auth Dojo <auth-dojo@feitcode.dev>';

const loadTemplate = async (name: string, replacements: Record<string, string>) => {
  if (!templateCache.has(name)) {
    templateCache.set(name, await Bun.file(`${import.meta.dir}/${name}.html`).text());
  }

  let html = templateCache.get(name)!;

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }

  return html;
};

const sendCodeVerification = async (code: string, user: AuthUser) => {
  const formattedCode = code.replace(/(\d{3})(\d{3})/, '$1 $2'); // 123456 -> 123 456

  const html = await loadTemplate('2fa-code', {
    name: user.firstName,
    code: formattedCode,
  });

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: user.email,
    subject: `Here's your verification code 🥷`,
    html,
  });

  if (error) {
    throw new Error(`Failed to send 2FA email: ${error.message}`);
  }
};

export const twoFactorEmail = {
  sendCodeVerification,
};
