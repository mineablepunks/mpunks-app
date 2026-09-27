import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@react95/core";
import { vi } from "vitest";
import App from "./App";

vi.mock("./components/Punk/QueriedPunk", () => ({ RandomPunk: () => null }));
vi.mock("./components/ConnectionController/ConnectionController", () => ({
  ConnectionController: () => null,
}));
vi.mock("./pages/Explore/Explore", () => ({ Explore: () => <p>Explore punks</p> }));

test("opens the FAQ route with the contract link and app navigation", () => {
  render(
    <MemoryRouter initialEntries={["/faq"]}>
      <ThemeProvider><App /></ThemeProvider>
    </MemoryRouter>
  );
  expect(screen.getByText("What is this?")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "contract" })).toHaveAttribute(
    "href", "https://etherscan.io/address/0x595a8974c1473717c4b5d456350cd594d9bda687"
  );
  expect(screen.getByText("explore")).toBeInTheDocument();
  expect(screen.getByText("mine")).toBeInTheDocument();
});
