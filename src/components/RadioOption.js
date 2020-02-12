import React from "react";

export default function RadioOption(props) {
  return (
    <React.Fragment>
      <input
        id={props.value}
        type="radio"
        value={props.value}
        checked={props.checked}
        onClick={props.onClick}
      />
      <label for={props.value} title={props.title}>
        {props.children}
      </label>
    </React.Fragment>
  );
}
