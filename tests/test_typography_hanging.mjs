import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fixHangingPrepositions } from "../shared/typography.js";

describe("russian hanging prepositions", () => {
  it("glues short prepositions and conjunctions with NBSP", () => {
    const raw =
      "язык с разработкой и стейкхолдерами. задачи и постоянно. активы в реальном";
    const fixed = fixHangingPrepositions(raw);
    assert.equal(
      fixed,
      "язык с\u00A0разработкой и\u00A0стейкхолдерами. задачи и\u00A0постоянно. активы в\u00A0реальном"
    );
    assert.equal(fixHangingPrepositions(fixed), fixed);
  });

  it("fixes sidebar.bio from contentMap", async () => {
    const { contentMap } = await import("../shared/content.js");
    const bio = contentMap["sidebar.bio"];
    assert.match(bio, /с\u00A0разработкой/);
    assert.match(bio, /и\u00A0стейкхолдерами/);
    assert.match(bio, /и\u00A0постоянно/);
    assert.equal(fixHangingPrepositions(bio), bio);
  });
});
