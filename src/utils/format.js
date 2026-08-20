export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncate(str, max = 60) {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

/**
 * Rounds elapsed time since `dateStr` into a friendly "Xh atrás" / "há X dias" label.
 * Uses Math.floor/Math.round — the arredondamento (rounding) requirement for Sprint 3,
 * applied to the existing scan-history feature instead of an unrelated stat.
 */
export function relativeTime(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return 'agora mesmo';
  if (diffMinutes < 60) return `${diffMinutes} min atrás`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h atrás`;

  const diffDays = Math.floor(diffHours / 24);
  return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
}

export function cleanUserText(text) {
  return String(text || '')
    .replace(/\bmock\b/gi, 'simulado')
    .replace(/\bMock\b/g, 'IA');
}
