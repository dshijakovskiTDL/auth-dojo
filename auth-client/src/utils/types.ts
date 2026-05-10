export const authTypes = ['Token', 'Session', 'OAuth'] as const;
export type AuthType = (typeof authTypes)[number];

export type LoginUser = {
  email: string;
  firstName: string;
  lastName: string;
  publicId: string;
  avatarUrl: string | null;
};
