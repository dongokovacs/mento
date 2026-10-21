(function (KM) {
  'use strict';

  /**
   * Elem létrehozása egy hívással.
   * - attrs: `onClick` stb. → eseménykezelő; null/false értékű attribútum kimarad; true → üres attribútum
   * - children: szöveg, Node vagy ezek (akár egymásba ágyazott) tömbje; null/false kimarad
   *
   * @param {string} tag
   * @param {Record<string, any>} [attrs]
   * @param {any} [children]
   * @returns {HTMLElement}
   */
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) {
      if (value == null || value === false) continue;
      if (name.startsWith('on')) node.addEventListener(name.slice(2).toLowerCase(), value);
      else node.setAttribute(name, value === true ? '' : String(value));
    }
    node.append(...[children].flat(Infinity).filter((child) => child != null && child !== false));
    return node;
  }

  Object.assign(KM, { el });
})((globalThis.KM = globalThis.KM || {}));
