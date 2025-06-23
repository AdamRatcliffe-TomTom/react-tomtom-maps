/**
 * Tests if a string is valid JSON
 * @param str - The string to test
 * @returns true if the string is valid JSON, false otherwise
 */
export function isJSON(str: string): boolean {
  if (typeof str !== "string") {
    return false;
  }

  const trimmed = str.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return false;
  }

  try {
    JSON.parse(trimmed);
    return true;
  } catch (error) {
    return false;
  }
}
