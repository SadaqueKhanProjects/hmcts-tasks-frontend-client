// src/main/modules/config.ts

/**
 * Centralised config for environment variables
 */
export const config = {
    backendUrl: process.env.BACKEND_URL ?? 'http://localhost:4000',
};