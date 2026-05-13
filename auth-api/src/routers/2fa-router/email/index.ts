import { resend } from '../../../email';
import { AuthUser } from '../../shared';

import twoFactorCodeTemplate from './2fa-code.html';

const FROM_EMAIL = 'Auth Dojo <auth-dojo@feitcode.dev>';

const populateTemplate = (template: string, replacements: Record<string, string>) => {
  for (const [key, value] of Object.entries(replacements)) {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }

  return template;
};

const sendCodeVerification = async (code: string, user: AuthUser) => {
  const formattedCode = code.replace(/(\d{3})(\d{3})/, '$1 $2'); // 123456 -> 123 456

  // @ts-expect-error - HTMLBundle is not comparable to string
  const html = populateTemplate(twoFactorCodeTemplate as string, {
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
