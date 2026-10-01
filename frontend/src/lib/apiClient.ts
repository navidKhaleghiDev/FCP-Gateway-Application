/**
 * Public client-service boundary for feature API modules.
 * Keep request implementation in services while allowing features to import
 * a stable client path.
 */
export { api, http } from '@/services/api';
