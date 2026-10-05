import React from "react";
import { getAvailableInputs } from "../data/transitions";

const optionDetails = {
  issue_book: {
    title: "Check out a book",
    description: "Start  with your library card and book.",
    icon: "↗",
    style: "book"
  },
  check_member: {
    title: "Scan library card",
    description: "Continue by checking the member account.",
    icon: "▤",
    style: "member"
  },
  valid_id: {
    title: "Verify card",
    description: "Confirm the membership card is valid.",
    icon: "✓",
    style: "success"
  },
  invalid_id: {
    title: "Card not recognized",
    description: "Show the access-denied outcome.",
    icon: "!",
    style: "alert"
  },
  book_available: {
    title: "Book is available",
    description: "Continue to checkout confirmation.",
    icon: "✓",
    style: "success"
  },
  book_unavailable: {
    title: "Book is unavailable",
    description: "End this attempt and return to the start.",
    icon: "!",
    style: "alert"
  },
  confirm: {
    title: "Confirm checkout",
    description: "Complete the loan and issue the book.",
    icon: "↗",
    style: "book"
  },
  return_book: {
    title: "Check in a book",
    description: "Start a return and check for outstanding fines.",
    icon: "↩",
    style: "return"
  },
  no_fine: {
    title: "No fine due",
    description: "Complete the return with no payment needed.",
    icon: "✓",
    style: "success"
  },
  fine_due: {
    title: "Review fine",
    description: "Continue to the fine-payment step.",
    icon: "$",
    style: "payment"
  },
  payment_done: {
    title: "Confirm payment",
    description: "Record the fine as paid and finish the return.",
    icon: "$",
    style: "payment"
  },
  exit: {
    title: "Finish and return home",
    description: "Close this service and start a new transaction.",
    icon: "⌂",
    style: "system"
  },
  cancel: {
    title: "Cancel session",
    description: "Stay at the terminal start screen.",
    icon: "×",
    style: "system"
  }
};

export default function ControlPanel({ currentState, onInput, onReset, onRunScenario, running, speed, setSpeed }) {
  const available = getAvailableInputs(currentState);

  return (
    <section className="panel controls-panel">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">NEXT STEP</span>
          <h2>Choose a service action</h2>
        </div>
        <span className="state-pill">{currentState}</span>
      </div>

      <div className="transition-options">
        {available.map(transition => {
          const option = optionDetails[transition.input] || {
            title: transition.input.replaceAll("_", " "),
            description: "Continue to the next step.",
            icon: "→",
            style: "system"
          };

          return (
          <button
            key={transition.input}
            className={`transition-option transition-option-${option.style}`}
            onClick={() => onInput(transition.input)}
            disabled={running}
          >
            <span className="transition-option-icon" aria-hidden="true">{option.icon}</span>
            <span className="transition-option-copy">
              <strong>{option.title}</strong>
              <small>{option.description}</small>
            </span>
            <span className="transition-option-event">{transition.input}</span>
            <span className="transition-option-state" aria-label={`Moves from ${transition.from} to ${transition.to}`}>
              {transition.from} <span aria-hidden="true">→</span> {transition.to}
            </span>
          </button>
          );
        })}
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