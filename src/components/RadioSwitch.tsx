import React from "react";
import "./RadioSwitch.css";
import { Props as OptionProps } from "./RadioOption";

type Child = React.ReactElement<OptionProps> | false;

type Props = {
  children: Child[];
  value?: string;
  onSelect: (value: string) => void;
};

export default class RadioSwitch extends React.Component<Props> {
  render() {
    return (
      <div className="RadioSwitch">
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
      </div>
    );
  }

  selectItem(value: string) {
    console.log("selectItem", value);
    this.props.onSelect(value);
  }
}
