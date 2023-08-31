import React, { useEffect, useMemo, useState } from "react";
import Circle from "../Circle";

const Light = ({ nodeData }) => {
  let containedDetailNode = nodeData["data"];
  if (!Object.keys(nodeData).includes("data")) {
    containedDetailNode = nodeData;
  }
  let col = `${containedDetailNode.color}`;
  const colors = useMemo(() => {
    return {
      red: {
        backgroundColor: "#cc3232",
      },
      yellow: {
        backgroundColor: "#e7b416",
      },
      green: {
        backgroundColor: "#2dc937",
      },
      grey: {
        backgroundColor: `${containedDetailNode.color}`,
      },
    };
  }, [containedDetailNode]);

  // const [statusColor, setStatusColor] = useState({
  //   next: `${nodeData["data"].color}`,
  //   currentColor: colors.grey,
  // });

  const [statusColor, setStatusColor] = useState({
    currentColor: colors.grey,
  });

  useEffect(() => {
    if (col === "green") {
      setStatusColor({ ...statusColor, currentColor: colors.green });
    } else if (col === "red") {
      setStatusColor({ ...statusColor, currentColor: colors.red });
    } else if (col === "yellow") {
      setStatusColor({ ...statusColor, currentColor: colors.yellow });
    }
  }, [col]);

  const handeLightChange = () => {
    switch (statusColor.next) {
      case "red":
        let rStatus = {
          next: "green",
          currentColor: colors.red,
        };
        setStatusColor(rStatus);
        break;
      case "yellow":
        let yStatus = {
          next: "red",
          currentColor: colors.yellow,
        };
        setStatusColor(yStatus);
        break;
      case "green":
        let gStatus = {
          next: "yellow",
          currentColor: colors.green,
        };
        setStatusColor(gStatus);
        break;
    }
  };

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     handeLightChange();
  //   }, 2000);

  //   return () => clearInterval(timer);
  // }, [statusColor]);

  return (
    <div
      className="light"
      style={{ zIndex: 100, marginLeft: "1rem", marginBottom: "0.5rem" }}
    >
      <Circle color={statusColor.currentColor} />
      {/* <Circle color={this.state.yellow} />
  <Circle color={this.state.green} /> */}
    </div>
  );
};

export default React.memo(Light);
