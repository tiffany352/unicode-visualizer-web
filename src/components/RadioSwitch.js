import React from "react";
import "./RadioSwitch.css";

export default class RadioSwitch extends React.Component {
  render() {
    return (
      <radiogroup class="RadioSwitch">
        {this.props.children.map(option => {
          if (React.isValidElement(option)) {
            return React.cloneElement(option, {
              onClick: () => this.selectItem(option.props.value),
              checked:
                option.props.checked || option.props.value === this.props.value
            });
          } else {
            return option;
          }
        })}
      </radiogroup>
    );
  }

  selectItem(value) {
    console.log("selectItem", value);
    this.props.onSelect(value);
  }
}
