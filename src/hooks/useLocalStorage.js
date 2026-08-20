import { useEffect, useState } from 'react';

function readValue(key, initialValue) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : initialValue;
  } catch {
    return initialValue;
  }
}

/**
 * Generic localStorage-backed state hook.
 * Mirrors the read/write pattern used across the original vanilla-JS
 * prototype (seekvision_user, seekvision_history, seekvision_knowledge_ai_history_mock),
 * but exposed as a normal `useState` pair kept in sync with localStorage.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable (private mode) — fail silently, same as the original prototype.
    }
  }, [key, value]);

  return [value, setValue];
}
