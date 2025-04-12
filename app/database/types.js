/**
 * @typedef {Object} Shloka
 * @property {string} chapter_id - The chapter identifier
 * @property {number} id - The shloka identifier within the chapter
 * @property {string} [uvaca] - The speaker (optional)
 * @property {string} shloka - The Sanskrit text of the shloka
 * @property {string} [uvaca_meaning] - The translation of the speaker (optional)
 * @property {string} [shloka_meaning] - The translation of the shloka (optional)
 * @property {string} [noti_id] - Notification identifier (optional)
 * @property {boolean} starred - Whether the shloka is starred
 * @property {string} note - User's notes on the shloka
 */

/**
 * @typedef {Object} Chapter
 * @property {string} chapter_id - The chapter identifier
 * @property {string} [chapter_name] - The name of the chapter (optional)
 * @property {number} verse_count - The number of verses in the chapter
 */

export const ShlokaFields = {
  CHAPTER_ID: 'chapter_id',
  ID: 'id',
  UVACA: 'uvaca',
  SHLOKA: 'shloka',
  UVACA_MEANING: 'uvaca_meaning',
  SHLOKA_MEANING: 'shloka_meaning',
  NOTI_ID: 'noti_id',
  STARRED: 'starred',
  NOTE: 'note'
};

export const ChapterFields = {
  CHAPTER_ID: 'chapter_id',
  CHAPTER_NAME: 'chapter_name',
  VERSE_COUNT: 'verse_count'
}; 