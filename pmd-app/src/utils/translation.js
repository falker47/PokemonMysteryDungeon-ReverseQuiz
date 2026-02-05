/**
 * Returns the translated text based on the current language.
 * Falls back to the default text field if translation is missing.
 * 
 * @param {Object} item - The object containing text and text_it fields
 * @param {string} lang - The current language code ('en' or 'it')
 * @returns {string} The display text
 */
export function translate(item, lang) {
    if (!item) return '';
    if (lang === 'it' && item.text_it) {
        return item.text_it;
    }
    return item.text;
}
