import React from "react";

export type Props = {
  value: string;
  checked?: boolean;
  onClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  title?: string;
  children: React.ReactNode;
};

export default function RadioOption(props: Props) {
  return (
    <React.Fragment>
      <input
        id={props.value}
        type="radio"
        value={props.value}
        checked={props.checked}
        onClick={props.onClick}
      />
      <label htmlFor={props.value} title={props.title}>
        {props.children}
      </label>
    </React.Fragment>
  );
}
