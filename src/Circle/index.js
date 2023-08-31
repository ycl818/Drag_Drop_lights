import React from "react";
import "./Circle.css";

export default ({ color }) => {
  console.log(color);
  return <div className="circle" style={color}></div>;
};
