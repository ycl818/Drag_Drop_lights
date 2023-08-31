import { Box, Drawer, Typography } from "@mui/material";
import React, { useMemo } from "react";
import m1 from "../asset/a.png";
import m2 from "../asset/b.png";
import m3 from "../asset/c.png";
import "../Sidebar.css";
import { useStore, useStoreApi } from "reactflow";

const DrawerForPics = ({ openDrawer, setOpenDrawer }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const store = useStoreApi();

  const { nodeInternals } = store.getState();

  const nodesV = useStore((state) => state.getNodes());
  const nodesLength = useMemo(() => {
    return Array.from(nodeInternals.values()).length || 0;
  }, [nodeInternals]);

  return (
    <Drawer
      anchor="right"
      open={openDrawer}
      onClose={() => setOpenDrawer(false)}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "transparent",
        },
      }}
    >
      <aside style={{ width: 300 }}>
        <div className="description">Drag and Drop wanted icon.</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="wrapMachine">
            <div
              className="machine"
              //className="dndnode input"
              onDragStart={(event) => onDragStart(event, "m1")}
              draggable
              style={{
                width: "100px",
                height: "100px",
                background: `url(${m1}) no-repeat center`,
                backgroundSize: "contain",

                padding: "0rem 2rem",
              }}
            ></div>
            <p className="machineParagraph">m1</p>
          </div>

          <div className="wrapMachine">
            <div
              className="machine"
              // className="dndnode"
              onDragStart={(event) => onDragStart(event, "m2")}
              draggable
              style={{
                width: "100px",
                height: "100px",
                background: `url(${m2}) no-repeat center`,
                backgroundSize: "contain",

                padding: "0 2rem",
              }}
            ></div>
            <p className="machineParagraph">m2</p>
          </div>

          <div className="wrapMachine">
            <div
              className="machine"
              //lassName="dndnode output"
              onDragStart={(event) => onDragStart(event, "m3")}
              draggable
              style={{
                width: "100px",
                height: "100px",
                background: `url(${m3}) no-repeat center`,
                backgroundSize: "contain",
                padding: "0 2rem",
              }}
            ></div>
            <p className="machineParagraph">m3</p>
          </div>
        </div>
      </aside>
    </Drawer>
  );
};

export default React.memo(DrawerForPics);
