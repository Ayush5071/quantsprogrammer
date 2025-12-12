export function safeParseJSON(text: unknown, label = 'input') {
  if (typeof text !== 'string') throw new Error(`${label} is not a string`);
  const trimmed = text.trim();
  // Try direct parse
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    // Try to extract JSON code block
    const m = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (m && m[1]) {
      try { return JSON.parse(m[1].trim()); } catch (e2) {
        throw new Error(`Failed to parse JSON from ${label} code block: ${String(e2).slice(0,200)}`);
      }
    }
    // As last resort, try to find first { ... } block
    const braceMatch = trimmed.match(/\{[\s\S]*\}/);
    if (braceMatch && braceMatch[0]) {
      try { return JSON.parse(braceMatch[0]); } catch (e3) {
        throw new Error(`Failed to parse JSON from ${label} braces: ${String(e3).slice(0,200)}`);
      }
    }
    throw new Error(`Unable to parse ${label} as JSON`);
  }
}
