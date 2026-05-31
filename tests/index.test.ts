import { test, expect } from "vite-plus/test";

import { helloWorld } from "../src";

test("helloWorld", () => {
  expect(helloWorld()).toBe("Hello World");
});
