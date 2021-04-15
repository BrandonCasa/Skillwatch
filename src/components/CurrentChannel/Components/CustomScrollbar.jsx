import React from "react";
import { Scrollbars } from "react-custom-scrollbars";
class CustomScrollbar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { top: 0 };
    this.handleScrollFrame = this.handleScrollFrame.bind(this);
    this.renderView = this.renderView.bind(this);
  }

  handleScrollFrame(values) {
    const { top } = values;
    this.setState({ top });
  }

  renderView({ style, ...props }) {
    const { top } = this.state;
    return <div {...props} style={{ ...style }} />;
  }

  render() {
    return <Scrollbars renderView={this.renderView} onScrollFrame={this.handleScrollFrame} {...this.props} />;
  }
}

export default CustomScrollbar;
