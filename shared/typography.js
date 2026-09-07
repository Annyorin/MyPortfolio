/**
 * Russian typography helpers for product copy.
 */

const NBSP = "\u00A0";

/**
 * Short prepositions / conjunctions / particles that must not hang at line end.
 * Bound to the following word with NBSP.
 */
const HANGING_WORD =
  "в|во|на|по|к|ко|о|об|обо|от|из|у|за|с|со|до|без|для|при|про|под|над|перед|через|между|и|а|но|да|же|ли|бы|ни|то|не";

const HANGING_RE = new RegExp(
  `(^|[\\s${NBSP}([{«"„])(${HANGING_WORD})(\\s+)`,
  "gi"
);

/**
 * Replaces regular spaces after hanging words with NBSP.
 * Idempotent when spaces are already NBSP.
 *
 * @param {unknown} text
 * @returns {string}
 */
export function fixHangingPrepositions(text) {
  if (typeof text !== "string" || text.length === 0) {
    return typeof text === "string" ? text : "";
  }
  return text.replace(
    HANGING_RE,
    (_m, before, word, _space) => `${before}${word}${NBSP}`
  );
}
