import React from "react";

function hexToBytes(hex: string): Array<number> {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

const Punk = ({ punkHex }: { punkHex: string }) => {
  const punkBytes = hexToBytes(punkHex.substring(2, punkHex.length));

  const rects = [];
  for (var i = 0; i < punkBytes.length; i += 4) {
    const a = punkBytes[i];
    const b = punkBytes[i + 1];
    const g = punkBytes[i + 2];
    const r = punkBytes[i + 3];

    const fillStyle = `rgba(${a}, ${b}, ${g}, ${r})`;

    const x = Math.floor((i % (24 * 4)) / 4);
    const y = Math.floor(i / (24 * 4));

    rects.push(
      <rect
        key={`${x}|${y}`}
        x={x}
        y={y}
        width="1"
        height="1"
        shapeRendering="crispEdges"
        fill={fillStyle}
      />
    );
  }

  return <svg viewBox="0 0 24 24">{rects}</svg>;
};

export const PunkSmall = (args: React.ComponentProps<typeof Punk>) => {
  return (
    <span style={{ width: "60px", height: "60px" }}>
      <Punk {...args} />
    </span>
  );
};

export default Punk;
