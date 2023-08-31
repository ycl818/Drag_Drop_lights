import React from "react";
import "./Light.css";
import Circle from "../Circle";

const colors = {
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
    backgroundColor: "grey",
  },
};

class Light extends React.Component {
  state = {
    red: colors.red,
    yellow: colors.grey,
    green: colors.grey,
    next: "yellow",
  };

  handeLightChange = () => {
    switch (this.state.next) {
      case "red":
        this.setState({
          red: colors.grey,
          yellow: colors.grey,
          green: colors.green,
          next: "green",
        });
        break;
      case "yellow":
        this.setState({
          red: colors.grey,
          yellow: colors.yellow,
          green: colors.grey,
          next: "red",
        });
        break;
      case "green":
        this.setState({
          red: colors.red,
          yellow: colors.grey,
          green: colors.grey,
          next: "yellow",
        });
        break;
    }
  };

  componentDidMount() {
    setInterval(() => {
      this.handeLightChange();
    }, 2000);
  }

  render() {
    return (
      <div class="light" style={{ zIndex: 100 }}>
        <Circle color={this.state.red} />
        {/* <Circle color={this.state.yellow} />
        <Circle color={this.state.green} /> */}
      </div>
    );
  }
}

export default React.memo(Light);
