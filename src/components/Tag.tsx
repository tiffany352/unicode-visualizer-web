import React from "react";
import "./Tag.css";

export function Tag(props: React.PropsWithChildren<{}>) {
  return <div className="Tag">{props.children}</div>;
}

export function TagList(props: React.PropsWithChildren<{}>) {
  return <div className="Tag-list">{props.children}</div>;
}
