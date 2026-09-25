/**
 * The resume button is a primary call to action. Until a real PDF is dropped in,
 * shipping a "resume" that opens a placeholder text file does more harm than no
 * button at all, so callers hide it when the URL is still the placeholder.
 */
export function hasRealResume(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (/placeholder/i.test(trimmed)) return false;
  return true;
}
