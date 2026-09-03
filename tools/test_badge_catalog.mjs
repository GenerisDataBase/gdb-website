import assert from "node:assert/strict";
import { allBadges, milestones, series } from "../public/assets/js/qwizzy-badge-catalog.mjs";

assert.equal(series.length, 11, "The catalogue must contain 11 badge categories.");
assert.equal(allBadges.length, 1000, "The catalogue must contain exactly 1,000 badges.");
assert.equal(new Set(allBadges.map((badge) => badge.id)).size, 1000, "Badge IDs must be unique.");
assert.deepEqual(allBadges.map((badge) => badge.catalogNumber), Array.from({ length: 1000 }, (_, index) => index + 1));

for (const definition of series) {
  const values = milestones(definition);
  assert.equal(values.length, definition[2], `${definition[0]} has the wrong number of milestones.`);
  assert.equal(values.at(-1), definition[1], `${definition[0]} must end at its configured maximum.`);
  assert.ok(values.every((value, index) => index === 0 || value > values[index - 1]), `${definition[0]} must be strictly increasing.`);
}

console.log("Badge catalogue verified: 1,000 unique badges across 11 categories.");
