import { Rhum, expect } from "../../../dev_deps.ts";
import * as types from "./index.ts";

Rhum.testPlan("types.test.ts", () => {
  Rhum.testSuite("string", () => {
    Rhum.testCase("test", () => {
      expect(types.string.test("foo")).toBe("foo");
      expect(types.string.test(" foo")).toBe(" foo");
      expect(types.string.test(" foo ")).toBe(" foo ");
      expect(types.string.test(" ")).toBe(" ");
      expect(types.string.test("")).toBe("");
    });
    Rhum.testCase("throw", () => {
      expect(() => types.string.test(null)).toThrow("Expected to be string");
      expect(() => types.string.test(undefined)).toThrow(
        "Expected to be string",
      );
      expect(() => types.string.test({})).toThrow("Expected to be string");
      expect(() => types.string.test([])).toThrow("Expected to be string");
      expect(() => types.string.test(123)).toThrow("Expected to be string");
      expect(() => types.string.test(false)).toThrow("Expected to be string");
    });
  });

  Rhum.testSuite("number", () => {
    Rhum.testCase("test", () => {
      expect(types.number.test(123)).toBe(123);
      expect(types.number.test(-123)).toBe(-123);
      expect(types.number.test(0)).toBe(0);
    });
    Rhum.testCase("throw", () => {
      expect(() => types.number.test(null)).toThrow("Expected to be number");
      expect(() => types.number.test(undefined)).toThrow(
        "Expected to be number",
      );
      expect(() => types.number.test({})).toThrow("Expected to be number");
      expect(() => types.number.test([])).toThrow("Expected to be number");
      expect(() => types.number.test("foo")).toThrow("Expected to be number");
      expect(() => types.number.test(false)).toThrow("Expected to be number");
    });
  });

  Rhum.testSuite("boolean", () => {
    Rhum.testCase("test", () => {
      expect(types.boolean.test(true)).toBe(true);
      expect(types.boolean.test(false)).toBe(false);
      expect(types.boolean.test("true")).toBe(true);
      expect(types.boolean.test("false")).toBe(false);
    });
    Rhum.testCase("throw", () => {
      expect(() => types.boolean.test("foo")).toThrow(
        "Expected to be boolean",
      );
      expect(() => types.boolean.test(123)).toThrow("Expected to be boolean");
      expect(() => types.boolean.test({})).toThrow("Expected to be boolean");
      expect(() => types.boolean.test([])).toThrow("Expected to be boolean");
      expect(() => types.boolean.test(undefined)).toThrow(
        "Expected to be boolean",
      );
    });
  });

  Rhum.testSuite("date", () => {
    Rhum.testCase("test", () => {
      const date = new Date(), ds = date.toString();
      expect(types.date.test(date).toString()).toBe(ds);
      expect(types.date.test(ds).toString()).toBe(ds);
    });
    Rhum.testCase("throw", () => {
      expect(() => types.date.test("foo")).toThrow("Expected to be Date");
      expect(() => types.date.test({})).toThrow("Expected to be Date");
      expect(() => types.date.test([])).toThrow("Expected to be Date");
      expect(() => types.date.test(undefined)).toThrow("Expected to be Date");
    });
  });

  Rhum.testSuite("object", () => {
    Rhum.testCase("test", () => {
      const schema = types.object({
        foo: types.string,
        bar: types.number,
      });

      const V = { foo: "foo", bar: 123 };
      expect(schema.test(V).foo).toBe(V.foo);
      expect(schema.test(V).bar).toBe(V.bar);
    });
    Rhum.testCase("throw", () => {
      const schema = types.object({
        foo: types.string,
        bar: types.number,
      });

      const V = { foo: 123, bar: 123 };
      expect(() => schema.test(V)).toThrow("Expected to be string");
      expect(() => schema.test(123)).toThrow("Expected to be object");
      expect(() => schema.test("foo")).toThrow("Expected to be object");
    });
    Rhum.testCase("nested", () => {
      const schema = types.object({
        a: types.object({
          b: types.object({
            c: types.object({
              foo: types.string,
            }),
          }),
        }),
      });

      const V1 = { a: { b: { c: { foo: "foo" } } } };
      expect(schema.test(V1).a.b.c.foo).toBe("foo");

      const V2 = { a: { b: { c: { foo: 123 } } } };
      expect(() => schema.test(V2)).toThrow("Expected to be string");
    });
  });

  Rhum.testSuite("array", () => {
    Rhum.testCase("test", () => {
      expect(types.array.test([1, 2, 3])[0]).toBe(1);
      expect(types.array.test(["foo", "bar", "baz"])[2]).toBe("baz");
    });
    Rhum.testCase("throw", () => {
      expect(() => types.array.test({})).toThrow("Expected to be array");
      expect(() => types.array.test(null)).toThrow("Expected to be array");
      expect(() => types.array.test("array")).toThrow("Expected to be array");
      expect(() => types.array.test(123)).toThrow("Expected to be array");
      expect(() => types.array.test(undefined)).toThrow("Expected to be array");
    });
    Rhum.testCase("of", () => {
      const schema = types.array.of(types.string);
      expect(schema.test(["foo", "bar", "baz"])[2]).toBe("baz");
      expect(() => schema.test([1, 2, 3])).toThrow("Expected to be string");
      expect(() => schema.test([false, true])).toThrow("Expected to be string");
    });
    Rhum.testCase("nested", () => {
      const schema = types.array.of(types.array.of(types.number));
      expect(schema.test([[1, 2], [3, 4]])[0][1]).toBe(2);
      expect(() => schema.test([1, 2])).toThrow("Expected to be array");
      expect(() => schema.test([false, true])).toThrow("Expected to be array");
      expect(() => schema.test([[false]])).toThrow("Expected to be number");
      expect(() => schema.test([[1, 2], 3])).toThrow("Expected to be array");
      expect(() => schema.test([[1], ["3"]])).toThrow("Expected to be number");
    });
  });

  Rhum.testSuite("null", () => {
    Rhum.testCase("test", () => {
      expect(types.null.test(123)).toBe(null);
      expect(types.null.test("foo")).toBe(null);
      expect(types.null.test({})).toBe(null);
      expect(types.null.test([])).toBe(null);
    });
  });
});

Rhum.run();
