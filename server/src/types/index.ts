import { SessionData } from 'express-session';

/**
 * This interface allows you to declare additional properties on your
 * session object
 * using [declaration merging]
 * (https://www.typescriptlang.org/docs/handbook/declaration-merging.html).
 *
 * @example
 * declare module 'express-session' {
 *     interface SessionData {
 *         userId: number;
 *     }
 * }
 *
 */

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}
