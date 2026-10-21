import { readFileSync } from 'node:fs';
import vm from 'node:vm';

/**
 * A böngészős scripteket ugyanúgy futtatja, mint a <script> tag: a globalThis.KM
 * névtérbe regisztrálnak. A teszt saját kontextusában fut (nem külön vm
 * kontextusban), így a tömbök prototípusa egyezik a deepStrictEqual-hoz.
 * @param {...string} files  a projekt gyökeréhez képest, pl. 'js/core/quiz.js'
 */
export function loadScripts(...files) {
  for (const file of files) {
    const url = new URL(`../${file}`, import.meta.url);
    vm.runInThisContext(readFileSync(url, 'utf8'), { filename: url.pathname });
  }
  return globalThis.KM;
}
