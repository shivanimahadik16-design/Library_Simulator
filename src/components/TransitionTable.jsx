import React from "react";
import { transitions } from "../data/transitions";

export default function TransitionTable() {
  return (
    <section className="panel transition-table-panel">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">TRANSITION FUNCTION</span>
          <h2>Transition Table</h2>
        </div>
        <span className="count-badge">{transitions.length} transitions</span>
      </div>

      <div className="transition-table-scroll">
        <table className="transition-table">
          <thead>
            <tr>
              <th scope="col">Current state</th>
              <th scope="col">Input</th>
              <th scope="col">Next state</th>
            </tr>
          </thead>
          <tbody>
            {transitions.map(({ from, input, to }) => (
              <tr key={`${from}-${input}`}>
                <td><code>{from}</code></td>
                <td><code>{input}</code></td>
                <td><code>{to}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}