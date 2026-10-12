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

export default function ControlPanel({
  currentState,
  onInput,
  onReset,
  onRunScenario,
  running,
  speed,
  setSpeed,
  issueDate,
  setIssueDate,
  returnDate,
  setReturnDate,
  bookCount,
  setBookCount,
  returnCalculation,
  onCalculateReturn,
  loanSummary
}) {
  const available = getAvailableInputs(currentState).filter(
    transition => currentState !== "q7" || !["no_fine", "fine_due"].includes(transition.input)
  );
  const issueDetails = calculateIssueDetails(issueDate, bookCount);

  return (
    <section className="panel controls-panel">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">NEXT STEP</span>
          <h2>Choose a service action</h2>
        </div>
        <span className="state-pill">{currentState}</span>
      </div>

      {["q1", "q2", "q3", "q4"].includes(currentState) && (
        <div className="loan-fields">
          <h3>Borrowing details</h3>
          <p className="loan-calculation">
            Enter how many books you are borrowing. Checkout cannot continue until a quantity is selected.
          </p>
          <label>
            Issue date
            <input
              type="date"
              value={issueDate}
              onChange={event => setIssueDate(event.target.value)}
              required
            />
          </label>
          <label>
            Number of books
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Enter quantity"
              value={bookCount}
              onChange={event => setBookCount(event.target.value)}
              required
            />
          </label>
        </div>
      )}

      {currentState === "q7" && (
        <form
          className="loan-fields"
          onSubmit={event => {
            event.preventDefault();
            onCalculateReturn();
          }}
        >
          <h3>Return details</h3>
          <p className="loan-calculation">
            Enter the original issue date and number of books to calculate the fine.
          </p>
          <label>
            Issue date
            <input
              type="date"
              value={issueDate}
              onChange={event => setIssueDate(event.target.value)}
              required
            />
          </label>
          <label>
            Number of books
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Enter quantity"
              value={bookCount}
              onChange={event => setBookCount(event.target.value)}
              required
            />
          </label>
          <label>
            Return date
            <input
              type="date"
              min={issueDate}
              value={returnDate}
              onChange={event => setReturnDate(event.target.value)}
              required
            />
          </label>
          <p className="loan-calculation">
            The first 10 days are fine-free; after that, each overdue day costs ₹2 per book.
          </p>
          <p className="loan-calculation">
            {"error" in returnCalculation
              ? returnCalculation.error
              : `${returnCalculation.daysBorrowed} days borrowed · ${returnCalculation.overdueDays} overdue · ₹${returnCalculation.fineAmount} fine`}
          </p>
          <button className="primary-btn" type="submit" disabled={running || "error" in returnCalculation}>
            Calculate fine &amp; check in
          </button>
        </form>
      )}

      {currentState === "q10" && loanSummary && (
        <div className="loan-calculation fine-summary">
          Fine due: <strong>₹{loanSummary.fineAmount}</strong> for {loanSummary.bookCount} book(s), {loanSummary.overdueDays} overdue day(s).
        </div>
      )}

      {currentState === "q8" && loanSummary && (
        <div className="loan-calculation">
          Return complete: {loanSummary.daysBorrowed} days borrowed, fine ₹{loanSummary.fineAmount}.
        </div>
      )}

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
            disabled={running || (["q1", "q4"].includes(currentState) && !issueDetails)}
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

      {available.length === 0 && currentState !== "q7" && (
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

function calculateIssueDetails(date, count) {
  return Boolean(date) && Number.isInteger(Number(count)) && Number(count) >= 1;
}