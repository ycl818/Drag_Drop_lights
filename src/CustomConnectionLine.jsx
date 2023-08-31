import React from "react";
import { getStraightPath } from "reactflow";

function CustomConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle }) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path style={connectionLineStyle} fill="none" d={edgePath} />
      <circle
        cx={toX}
        cy={toY}
        fill="black"
        r={1}
        stroke="black"
        strokeWidth={0.5}
      />
    </g>
  );
}

export default CustomConnectionLine;
