import App from "@/App";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

test("demo", () => {
  expect(true).toBe(true);
});

test("Renders the main page", () => {
  render(<App />);
  expect(true).toBeTruthy();
});
