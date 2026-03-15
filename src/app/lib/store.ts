'use client';

import { BookSession } from './types';

// Simple client-side state management using sessionStorage
const STORAGE_KEY = 'littleme_session';

export function getSession(): BookSession | null {
  if (typeof window === 'undefined') return null;
  const data = sessionStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  return JSON.parse(data) as BookSession;
}

export function createSession(): BookSession {
  const session: BookSession = {
    id: crypto.randomUUID(),
    step: 'upload',
    familyMembers: [],
    language: 'en',
    createdAt: new Date(),
  };
  saveSession(session);
  return session;
}

export function saveSession(session: BookSession): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function updateSession(updates: Partial<BookSession>): BookSession {
  const session = getSession();
  if (!session) throw new Error('No active session');
  const updated = { ...session, ...updates };
  saveSession(updated);
  return updated;
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}
