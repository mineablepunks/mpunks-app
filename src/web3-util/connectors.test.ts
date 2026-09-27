import { afterEach, expect, test, vi } from "vitest";

const { NetworkConnector } = vi.hoisted(() => ({
  NetworkConnector: vi.fn(function (this: object) {}),
}));
vi.mock("@web3-react/network-connector", () => ({ NetworkConnector }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

test.each([undefined, "", "   "])("uses PublicNode when the RPC setting is %s", async (url) => {
  vi.stubEnv("REACT_APP_MAINNET_URL", url);
  await import("./connectors");
  expect(NetworkConnector).toHaveBeenCalledWith({
    urls: { 1: "https://ethereum.publicnode.com" }, defaultChainId: 1,
  });
});

test("preserves an explicitly configured RPC endpoint", async () => {
  vi.stubEnv("REACT_APP_MAINNET_URL", " https://rpc.example.test ");
  await import("./connectors");
  expect(NetworkConnector).toHaveBeenCalledWith({
    urls: { 1: "https://rpc.example.test" }, defaultChainId: 1,
  });
});
