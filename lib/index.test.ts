import {
  Boolean as Bool,
  Number as Numb,
  String as Str,
  Literal,
  Array as Arr,
  Tuple,
  Object as Obj,
  Union,
} from "funtypes";
import { RuntypeBase } from "funtypes/lib/runtype";

const makeRandom = (item: RuntypeBase<any> | Arr<any>) => {
  if (item.tag === "boolean") {
    return [true, false][Math.floor((Math.random() * 1000) % 2)];
  }

  if (item.tag === "number") {
    return Math.floor(Math.random() * 100);
  }

  if (item.tag === "string") {
    return (Math.random() * 100).toString(36).substring(3);
  }

  if (item.tag === "array") {
    return Array.from({ length: Math.floor(Math.random() * 10) || 1 }).map(() =>
      makeRandom(item.element)
    );
  }

  if (item.tag === "tuple") {
    return item.components.map(makeRandom);
  }

  if (item.tag === "literal") {
    return item.value;
  }

  if (item.tag === "object") {
    const out = {};
    Object.keys(item.fields).forEach((fieldName) => {
      out[fieldName] = makeRandom(item.fields[fieldName]);
    });

    return out;
  }

  console.log("item.tag: ", item.tag);
  console.log("item: ", item);

  throw new Error("BROKE");
};

describe("testing", () => {
  describe("Boolean", () => {
    it.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])("handles %i", () => {
      expect(makeRandom(Bool)).toEqual(expect.any(Boolean));
    });
  });

  describe("Number", () => {
    it.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])("handles %i", () => {
      expect(makeRandom(Numb)).toEqual(expect.any(Number));
    });
  });

  describe("String", () => {
    it.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])("handles %i", () => {
      expect(makeRandom(Str)).toEqual(expect.any(String));
    });
  });

  describe("Literal", () => {
    it("handles null", () => {
      expect(makeRandom(Literal(null))).toBe(null);
    });

    it("handles undefined", () => {
      expect(makeRandom(Literal(undefined))).toBe(undefined);
    });

    it("handles string", () => {
      expect(makeRandom(Literal("test-string"))).toBe("test-string");
    });

    it("handles number", () => {
      expect(makeRandom(Literal(12))).toBe(12);
    });

    it("handles true", () => {
      expect(makeRandom(Literal(true))).toBe(true);
    });

    it("handles false", () => {
      expect(makeRandom(Literal(false))).toBe(false);
    });
  });

  describe("Array", () => {
    it.each([
      [Str, String],
      [Numb, Number],
      [Bool, Boolean],
    ])("it handles %s => %p", (a, b) => {
      expect(makeRandom(Arr(a))).toEqual(
        expect.arrayContaining([expect.any(b)])
      );
    });
  });

  describe("Tuple", () => {
    it("handles", () => {
      expect(makeRandom(Tuple(Str, Arr(Numb)))).toStrictEqual([
        expect.any(String),
        expect.arrayContaining([expect.any(Number)]),
      ]);
    });
  });

  describe("Object", () => {
    it("handles", () => {
      const str = makeRandom(Str);
      const f = Obj({
        literalString: Literal(str),
        str: Str,
        numb: Numb,
      });

      expect(makeRandom(f)).toStrictEqual({
        literalString: str,
        str: expect.any(String),
        numb: expect.any(Number),
      });
    });
  });
});
