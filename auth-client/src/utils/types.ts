export const authTypes = ['Token', 'Session', 'OAuth'] as const;
export type AuthType = (typeof authTypes)[number];
