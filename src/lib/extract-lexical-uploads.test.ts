import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractLexicalUploads } from "./extract-lexical-uploads";

describe("extractLexicalUploads", () => {
  it("returns empty array for null/undefined", () => {
    assert.deepEqual(extractLexicalUploads(null), []);
    assert.deepEqual(extractLexicalUploads(undefined), []);
  });

  it("returns empty array for non-object primitives", () => {
    assert.deepEqual(extractLexicalUploads("string"), []);
    assert.deepEqual(extractLexicalUploads(42), []);
    assert.deepEqual(extractLexicalUploads(true), []);
  });

  it("returns empty array for non-upload nodes", () => {
    const node = {
      root: {
        type: "paragraph",
        children: [{ type: "text", text: "hello" }],
      },
    };
    assert.deepEqual(extractLexicalUploads(node), []);
  });

  it("returns empty array for upload node without filename", () => {
    const node = {
      root: {
        type: "root",
        children: [
          {
            type: "upload",
            value: { mimeType: "image/png" },
            fields: {},
          },
        ],
      },
    };
    assert.deepEqual(extractLexicalUploads(node), []);
  });

  it("skips non-image upload nodes", () => {
    const node = {
      root: {
        children: [
          {
            type: "upload",
            value: {
              mimeType: "application/pdf",
              filename: "doc.pdf",
              folder: "docs",
            },
            fields: {},
          },
        ],
      },
    };
    assert.deepEqual(extractLexicalUploads(node), []);
  });

  it("extracts image upload with populated value", () => {
    const node = {
      root: {
        children: [
          {
            type: "upload",
            value: {
              mimeType: "image/png",
              filename: "photo.png",
              folder: "projects",
              alt: "A photo",
            },
            fields: { alt: "Custom alt" },
          },
        ],
      },
    };
    const result = extractLexicalUploads(node);
    assert.equal(result.length, 1);
    assert.equal(result[0].src, "/api/images/projects/photo.png");
    assert.equal(result[0].alt, "Custom alt");
    assert.equal(result[0].caption, null);
  });

  it("falls back to value.alt when fields.alt is absent", () => {
    const node = {
      root: {
        children: [
          {
            type: "upload",
            value: {
              mimeType: "image/jpeg",
              filename: "img.jpg",
              folder: "gallery",
              alt: "Value alt",
            },
            fields: {},
          },
        ],
      },
    };
    const result = extractLexicalUploads(node);
    assert.equal(result.length, 1);
    assert.equal(result[0].alt, "Value alt");
  });

  it("uses filename as fallback alt when no alt fields", () => {
    const node = {
      root: {
        children: [
          {
            type: "upload",
            value: {
              mimeType: "image/webp",
              filename: "shot.webp",
              folder: null,
            },
            fields: {},
          },
        ],
      },
    };
    const result = extractLexicalUploads(node);
    assert.equal(result.length, 1);
    assert.equal(result[0].src, "/api/images/projects/shot.webp");
    assert.equal(result[0].alt, "shot.webp");
  });

  it("extracts multiple uploads from nested children", () => {
    const node = {
      root: {
        children: [
          {
            type: "paragraph",
            children: [
              { type: "text", text: "Before" },
              {
                type: "upload",
                value: {
                  mimeType: "image/png",
                  filename: "a.png",
                  folder: "projects",
                },
                fields: {},
              },
              { type: "text", text: "After" },
              {
                type: "upload",
                value: {
                  mimeType: "image/gif",
                  filename: "b.gif",
                  folder: "projects",
                },
                fields: { alt: "B" },
              },
            ],
          },
        ],
      },
    };
    const result = extractLexicalUploads(node);
    assert.equal(result.length, 2);
    assert.equal(result[0].alt, "a.png");
    assert.equal(result[1].alt, "B");
  });

  it("handles top-level array input", () => {
    const arr = [
      {
        type: "upload",
        value: {
          mimeType: "image/png",
          filename: "x.png",
          folder: "projects",
        },
        fields: {},
      },
    ];
    const result = extractLexicalUploads(arr);
    assert.equal(result.length, 1);
    assert.equal(result[0].src, "/api/images/projects/x.png");
  });

  it("handles upload with non-object value (just an ID, not populated)", () => {
    const node = {
      root: {
        children: [
          {
            type: "upload",
            value: "some-document-id",
            fields: {},
          },
        ],
      },
    };
    const result = extractLexicalUploads(node);
    assert.equal(result.length, 0);
  });
});
