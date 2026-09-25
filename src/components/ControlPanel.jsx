import React from "react";
import { getAvailableInputs } from "../data/transitions";

const labels = {
  issue_book: "Issue Book",
  check_member: "Check Member",
  valid_id: "Valid ID",
  invalid_id: "Invalid ID",
  book_available: "Book Available",
  book_unavailable: "Book Unavailable",
  confirm: "Confirm Issue",
  return_book: "Return Book",
  no_fine: "No Fine",
  fine_due: "Fine Due",
  payment_done: "Payment Done",
  exit: "Exit",
  cancel: "Cancel"
};

export default function ControlPanel({ currentState, onInput, onReset, onRunScenario, running, speed, setSpeed }) {
  const available = getAvailableInputs(currentState);

  return (
    <section className="panel controls-panel">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">INPUT EVENTS</span>
          <h2>Available transitions</h2>
        </div>
        <span className="state-pill">{currentState}</span>
      </div>

      <div className="button-grid">
        {available.map(t => (
          <button key={t.input} className="input-btn" onClick={() => onInput(t.input)} disabled={running}>
            {labels[t.input] || t.input}
            <small>{t.input}</small>
          </button>
        ))}
      </div>

      {available.length === 0 && (
        <div className="warning">No valid transition is defined from this state.</div>
      )}

      <div className="control-row">
        <button className="primary-btn" onClick={onRunScenario} disabled={running}>
          {running ? "▶ Running..." : "▶ Demo Successful Issue"}
        </button>
        <button className="secondary-btn" onClick={onReset}>↻ Reset</button>
      </div>

      <label className="speed-control">
        <span>Animation speed</span>
        <input
          type="range"
          min="250"
          max="1400"
          step="50"
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
        />
        <span>{speed} ms</span>
      </label>
    </section>
  );
}