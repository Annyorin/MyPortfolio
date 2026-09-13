/**
 * SegmentsControl bind + sliding thumb (no jsdom — minimal DOM shim).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bindSegmentsControl } from "../ds-showcase/js/segments.js";

/**
 * @param {string} tagName
 * @returns {any}
 */
function createElement(tagName) {
  /** @type {Record<string, string>} */
  const attrs = {};
  /** @type {any[]} */
  const children = [];
  /** @type {Record<string, Set<Function>>} */
  const listeners = {};
  const el = {
    tagName: String(tagName).toUpperCase(),
    className: "",
    classList: {
      /** @type {Set<string>} */
      _set: new Set(),
      add(c) {
        this._set.add(c);
        el.className = [...this._set].join(" ");
      },
      remove(c) {
        this._set.delete(c);
        el.className = [...this._set].join(" ");
      },
      contains(c) {
        return this._set.has(c);
      },
      toggle(c, force) {
        if (force === true) this.add(c);
        else if (force === false) this.remove(c);
        else if (this.contains(c)) this.remove(c);
        else this.add(c);
        return this.contains(c);
      },
    },
    dataset: /** @type {Record<string, string>} */ ({}),
    style: /** @type {Record<string, string>} */ ({}),
    textContent: "",
    tabIndex: 0,
    firstChild: null,
    childNodes: children,
    children,
    setAttribute(k, v) {
      attrs[k] = String(v);
    },
    getAttribute(k) {
      return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null;
    },
    appendChild(child) {
      children.push(child);
      if (children.length === 1) el.firstChild = child;
      return child;
    },
    insertBefore(child, ref) {
      const i = ref ? children.indexOf(ref) : -1;
      if (i >= 0) children.splice(i, 0, child);
      else children.push(child);
      el.firstChild = children[0] || null;
      return child;
    },
    querySelector(sel) {
      if (sel === ".ds-segments__thumb") {
        return children.find((c) => String(c.className).includes("ds-segments__thumb")) || null;
      }
      return null;
    },
    querySelectorAll(sel) {
      if (sel === ".ds-segments__item") {
        return children.filter((c) => String(c.className).includes("ds-segments__item"));
      }
      return [];
    },
    addEventListener(type, fn) {
      if (!listeners[type]) listeners[type] = new Set();
      listeners[type].add(fn);
    },
    removeEventListener(type, fn) {
      listeners[type]?.delete(fn);
    },
    click() {
      for (const fn of listeners.click || []) fn();
    },
  };
  return el;
}

describe("SegmentsControl interaction", () => {
  it("click moves data-active and aria-selected", () => {
    globalThis.requestAnimationFrame = (cb) => {
      cb(0);
      return 0;
    };
    globalThis.HTMLElement = function HTMLElement() {};

    const root = createElement("div");
    root.className = "ds-segments";
    Object.setPrototypeOf(root, globalThis.HTMLElement.prototype);

    const thumb = createElement("span");
    thumb.className = "ds-segments__thumb";
    thumb.classList.add("ds-segments__thumb");

    const a = createElement("button");
    a.className = "ds-segments__item ds-segments__item--active";
    a.classList.add("ds-segments__item");
    a.classList.add("ds-segments__item--active");
    a.textContent = "A";
    a.setAttribute("aria-selected", "true");

    const b = createElement("button");
    b.className = "ds-segments__item";
    b.classList.add("ds-segments__item");
    b.textContent = "B";
    b.setAttribute("aria-selected", "false");

    root.appendChild(thumb);
    root.appendChild(a);
    root.appendChild(b);

    const teardown = bindSegmentsControl(root);
    assert.equal(root.dataset.active, "0");

    b.click();
    assert.equal(root.dataset.active, "1");
    assert.equal(b.getAttribute("aria-selected"), "true");
    assert.equal(a.getAttribute("aria-selected"), "false");
    assert.ok(b.classList.contains("ds-segments__item--active"));
    assert.ok(!a.classList.contains("ds-segments__item--active"));

    a.click();
    assert.equal(root.dataset.active, "0");
    teardown();
  });
});
