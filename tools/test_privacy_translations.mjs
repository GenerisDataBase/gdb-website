import assert from "node:assert/strict";
import { privacyTranslations } from "../public/assets/js/privacy-translations.mjs";

assert.deepEqual(Object.keys(privacyTranslations).sort(), ["de", "es", "it"]);
for (const [language, translation] of Object.entries(privacyTranslations)) {
  assert.ok(translation.site.title && translation.site.intro && translation.site.note, `${language}: incomplete website privacy header`);
  assert.equal(translation.site.sections.length, 11, `${language}: incomplete website privacy sections`);
  assert.ok(translation.qwizzy.title && translation.qwizzy.intro && translation.qwizzy.note, `${language}: incomplete Qwizzy privacy header`);
  assert.equal(translation.qwizzy.items.length, 11, `${language}: incomplete Qwizzy privacy sections`);
  assert.ok(translation.qwizzy.updated.includes("2026"), `${language}: missing Qwizzy update date`);
  assert.equal(JSON.stringify(translation).includes("undefined"), false, `${language}: undefined translation value`);
}

console.log("Privacy translations verified: complete German, Spanish and Italian versions.");
