declare module 'bun' {
  interface Env {
    JWT_SECRET: string;
    FRONTEND_URL: string;
    REDIS_URL: string;
    BUN_DEV: 'development' | 'production';
  }
}
