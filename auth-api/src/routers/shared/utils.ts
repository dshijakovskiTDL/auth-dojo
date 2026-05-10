const multipliers = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
type DurationUnit = keyof typeof multipliers;

export const durationSeconds = (value: number, unit: DurationUnit) =>
  value * multipliers[unit];

// Used for JWT expiry and refresh token expiration
export const tokenExpiry = (value: number, unit: DurationUnit) => {
  return Math.floor(Date.now() / 1000) + durationSeconds(value, unit);
};

export const hashValue = (value: string) => {
  return Bun.hash(value);
};

export const hashPassword = (password: string) => {
  return Bun.password.hash(password, 'bcrypt');
};

export const verifyPassword = (password: string, hashedPassword: string) => {
  return Bun.password.verify(password, hashedPassword, 'bcrypt');
};
