export const authTypes = ['Token', 'Session', 'OAuth', '2FA'] as const;
export type AuthType = (typeof authTypes)[number];

export type LoginUser = {
  email: string;
  firstName: string;
  lastName: string;
  publicId: string;
  avatarUrl: string | null;
};
