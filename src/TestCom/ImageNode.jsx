import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import Light from "../Light/Light";

export default memo(({ data, isConnectable }) => {
  const config = {
    red: {
      backgroundColor: "red",
      duration: 4000,
      next: "green",
    },
    yellow: {
      backgroundColor: "yellow",
      duration: 500,
      next: "red",
    },
    green: {
      backgroundColor: "green",
      duration: 3000,
      next: "yellow",
    },
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div className="imageContainer">
        <img src={data.image.url} alt={data.image.alt} />
        <div className="overlayComponent">{data.overlayContent}</div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
    </>
  );
});
