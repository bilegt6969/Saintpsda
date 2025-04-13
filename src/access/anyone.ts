// src/access/anyone.ts
import type { Access } from 'payload'

/**
 * Grants access to anyone, regardless of authentication status.
 * Use carefully, typically for public read or create operations.
 */
export const anyone: Access = () => true