import React from "react";
import { Link } from "react-router-dom";
import "./Table.css";

export type Row<L extends number> = {
  link?: string;
  contents: (JSX.Element | string)[] & { length: L };
};

export type TableProps<L extends number> = {
  headings: string[] & { length: L };
  columns: string;
  rows: Row<L>[];
};

export default function Table<L extends number>(props: TableProps<L>) {
  return (
    <div className="Table" style={{ gridTemplateColumns: props.columns }}>
      <div className="Table-row Table-header">
        {props.headings.map((heading, index) => (
          <div key={index} className="Table-cell">
            {heading}
          </div>
        ))}
      </div>
      {props.rows.map((row, index) => {
        const cells = row.contents.map((cell, index) => (
          <div key={index} className="Table-cell">
            {cell}
          </div>
        ));
        if (row.link) {
          return (
            <Link to={row.link} className="Table-row">
              {cells}
            </Link>
          );
        } else {
          return (
            <div key={index} className="Table-row">
              {cells}
            </div>
          );
        }
      })}
    </div>
  );
}
