//
// A local utility providing motivational and spiritual quotes by theme.
// Stores a small but expandable dataset for offline/off-the-grid support.
//

// PUBLIC_INTERFACE
export const quoteThemes = [
  { id: "all", label: "All" },
  { id: "motivation", label: "Motivation" },
  { id: "spiritual", label: "Spiritual" },
  { id: "mindfulness", label: "Mindfulness" },
  { id: "kindness", label: "Kindness" }
];

// PUBLIC_INTERFACE
export const quotesDataset = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    theme: "motivation"
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    theme: "motivation"
  },
  {
    text: "The wound is the place where the Light enters you.",
    author: "Rumi",
    theme: "spiritual"
  },
  {
    text: "Let go of what you cannot change. Focus on what you can.",
    author: "Unknown",
    theme: "mindfulness"
  },
  {
    text: "Kindness is a language which the deaf can hear and the blind can see.",
    author: "Mark Twain",
    theme: "kindness"
  },
  {
    text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.",
    author: "Hermann Hesse",
    theme: "spiritual"
  },
  {
    text: "Act with kindness, but do not expect gratitude.",
    author: "Confucius",
    theme: "kindness"
  },
  {
    text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    author: "Thich Nhat Hanh",
    theme: "mindfulness"
  }
];

// PUBLIC_INTERFACE
/**
 * Retrieve a filtered and shuffled list of quotes for a specific theme.
 * @param {string} themeId - The theme id to filter by ('all' for every quote).
 * @returns {Array} Array of quote objects.
 */
export function getQuotesByTheme(themeId) {
  let filtered = themeId && themeId !== "all"
    ? quotesDataset.filter(q => q.theme === themeId)
    : quotesDataset.slice();
  // Simple shuffle (Fisher-Yates)
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }
  return filtered;
}
