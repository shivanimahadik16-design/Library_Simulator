import React from "react";
import { states, acceptingStates } from "../data/states";
import { transitions } from "../data/transitions";

export default function AutomatonInfo({ selectedState, stateDetails }) {
  return (
    <section className="info-grid">
      <div className="panel formal-panel">
        <span className="eyebrow">FORMAL DEFINITION</span>
        <h2>Finite Automaton</h2>
        <div className="formula">M = (Q, Σ, δ, q₀, F)</div>

        <div className="formal-row">
          <b>Q</b>
          <span>{"{" + states.map(s => s.id).join(", ") + "}"}</span>
        </div>
        <div className="formal-row">
          <b>Σ</b>
          <span>{"{" + [...new Set(transitions.map(t => t.input))].join(", ") + "}"}</span>
        </div>
        <div className="formal-row"><b>q₀</b><span>q0</span></div>
        <div className="formal-row"><b>F</b><span>{"{" + acceptingStates.join(", ") + "}"}</span></div>
      </div>

      <div className="panel details-panel">
        <span className="eyebrow">STATE DETAILS</span>
        <h2>{stateDetails.id} — {stateDetails.name}</h2>
        <p>{stateDetails.description}</p>

        <div className="mini-stat">
          <span>Selected state</span>
          <strong>{selectedState}</strong>
        </div>
        <div className="mini-stat">
          <span>Accepting state</span>
          <strong>{acceptingStates.includes(selectedState) ? "YES ✓" : "NO"}</strong>
        </div>
      </div>
    </section>
  );
}