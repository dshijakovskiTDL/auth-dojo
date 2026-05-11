declare module 'bun' {
  interface Env {
    JWT_SECRET: string;
    API_URL: string;
    FRONTEND_URL: string;
    REDIS_URL: string;
    BUN_DEV: 'development' | 'production';

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;

    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;

    TURSO_DB_URL: string;
    TURSO_DB_TOKEN: string;
  }
}
