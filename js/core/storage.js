/**
 * Vékony localStorage-réteg. Privát módban vagy tiltott tárhelynél nem dob
 * hibát: olvasáskor null-t ad, íráskor csendben kihagyja.
 */

(function (KM) {
  'use strict';

  const PREFIX = 'kismento:';

  /** @param {string} key */
  function load(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * @param {string} key
   * @param {unknown} value
   */
  function save(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // A legjobb eredmény csak kényelmi funkció, nélküle is működik az oldal.
    }
  }

  KM.storage = { load, save };
})((globalThis.KM = globalThis.KM || {}));
