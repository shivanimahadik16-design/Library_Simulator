import React, { useState } from "react";
import { simulateString } from "../data/automaton";

const examples = {
  success: "issue_book,check_member,valid_id,book_available,confirm",
  denied: "issue_book,check_member,invalid_id",
  unavailable: "issue_book,check_member,valid_id,book_unavailable",
  returnFine: "return_book,fine_due,payment_done"
};

export default function StringTester() {
  const [value, setValue] = useState(examples.success);
  const [result, setResult] = useState(null);

  function test() {
    setResult(simulateString(value));
  }

  return (
    <section className="panel tester">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">FORMAL LANGUAGE</span>
          <h2>Input String Tester</h2>
        </div>
      </div>

      <p className="muted">
        Enter a comma-separated string from the alphabet. The simulator applies δ repeatedly.
      </p>

      <textarea value={value} onChange={e => setValue(e.target.value)} />

      <div className="example-row">
        <button onClick={() => setValue(examples.success)}>Successful issue</button>
        <button onClick={() => setValue(examples.denied)}>Invalid member</button>
        <button onClick={() => setValue(examples.unavailable)}>Unavailable book</button>
        <button onClick={() => setValue(examples.returnFine)}>Return + fine</button>
      </div>

      <button className="primary-btn" onClick={test}>Test String</button>

      {result && (
        <div className={`result-box ${result.error ? "invalid" : result.accepted ? "accepted" : "rejected"}`}>
          <strong>
            {result.error ? "✗ INVALID TRANSITION" : result.accepted ? "✓ ACCEPTED STRING" : "✗ REJECTED STRING"}
          </strong>

          {result.error ? (
            <p>{result.error.message}</p>
          ) : (
            <p>Final state: <code>{result.finalState}</code></p>
          )}

          <div className="trace-line">
            q0 {result.trace.map((t, i) => (
              <React.Fragment key={i}> <span>—{t.input}→</span> {t.to} </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}