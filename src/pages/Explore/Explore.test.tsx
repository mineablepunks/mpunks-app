import { vi, type Mock } from "vitest";
import React from "react";
import { act, render } from "@testing-library/react";
import { Simulate } from "react-dom/test-utils";
import { useWeb3React } from "@web3-react/core";
import { getPunkIdsByAddress, getRecentlyMinedPunks } from "../../util";
import { Explore } from "./Explore";

vi.mock("@web3-react/core", () => ({ useWeb3React: vi.fn() }));
vi.mock("../../util", () => ({
  getPunkIdsByAddress: vi.fn(),
  getRecentlyMinedPunks: vi.fn(),
}));
vi.mock("../../hooks", () => ({ HackilyRewriteHistory: vi.fn() }));
vi.mock("@react95/core", () => ({
  Input: (props: any) => <input {...props} />,
  Frame: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("../../components/Punk/QueriedPunk", () => ({
  PunkIdRenderer: () => <div>Search by punk ID</div>,
  IdentifiedPunk: ({ punkId }: { punkId: number }) => <div>Punk {punkId}</div>,
}));

const mockWeb3 = useWeb3React as Mock;
const mockWallet = getPunkIdsByAddress as Mock;
const mockRecent = getRecentlyMinedPunks as Mock;

async function renderExplore() {
  let view!: ReturnType<typeof render>;
  await act(async () => {
    view = render(<Explore />);
  });
  return view;
}

async function changeAddress(view: ReturnType<typeof render>, address: string) {
  const input = view.getByPlaceholderText(
    "enter address to see owned punks"
  ) as HTMLInputElement;
  await act(async () => {
    input.value = address;
    Simulate.change(input);
  });
}

beforeEach(() => {
  mockWeb3.mockReturnValue({ library: {}, account: undefined });
  mockWallet.mockResolvedValue([]);
  mockRecent.mockResolvedValue([]);
});

test("waits for a provider before issuing on-chain queries", async () => {
  mockWeb3.mockReturnValue({ library: undefined, account: undefined });
  const view = await renderExplore();
  expect(mockRecent).not.toHaveBeenCalled();
  expect(mockWallet).not.toHaveBeenCalled();

  const library = {};
  mockWeb3.mockReturnValue({ library, account: undefined });
  await act(async () => {
    view.rerender(<Explore />);
  });
  expect(mockWallet).toHaveBeenCalledWith(
    library,
    "0xD0bA4295Acf286a173cbaB2A1312c2B83FCa0723"
  );
  expect(mockRecent).toHaveBeenCalledWith(library);
});

test("distinguishes an unavailable history query from an empty wallet", async () => {
  mockWallet.mockRejectedValue(
    new Error("Archive requests require a personal token")
  );
  const view = await renderExplore();
  expect(view.getByText(/Wallet lookup is unavailable/)).toBeInTheDocument();
  expect(view.queryByText("No owned punks found.")).toBeNull();
  expect(view.getByText("Search by punk ID")).toBeInTheDocument();
});

test("ignores an old wallet response after the address changes", async () => {
  let resolveOld!: (ids: number[]) => void;
  mockWallet.mockReturnValueOnce(
    new Promise<number[]>((resolve) => {
      resolveOld = resolve;
    })
  );
  mockWallet.mockResolvedValueOnce([12345]);
  const view = await renderExplore();
  await changeAddress(view, "0x0000000000000000000000000000000000000001");
  expect(view.getByText("Punk 12345")).toBeInTheDocument();
  await act(async () => {
    resolveOld([10000]);
  });
  expect(view.queryByText("Punk 10000")).toBeNull();
  expect(view.getByText("Punk 12345")).toBeInTheDocument();
});

test("does not query partially typed addresses", async () => {
  const view = await renderExplore();
  expect(view.getByText("No owned punks found.")).toBeInTheDocument();
  mockWallet.mockClear();
  await changeAddress(view, "0x123");
  expect(mockWallet).not.toHaveBeenCalled();
  expect(view.queryByText("No owned punks found.")).toBeNull();
});
