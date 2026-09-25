/** Extracts the username from a GitHub profile URL, e.g. "https://github.com/foo" -> "foo". */
export function githubUsername(profileUrl: string): string | null {
  const match = profileUrl.match(/github\.com\/([^/?#]+)/i);
  return match ? match[1] : null;
}
