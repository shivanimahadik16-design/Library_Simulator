import React from "react";

export default function TransitionHistory({ history }) {
  return (
    <section className="panel">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">EXECUTION TRACE</span>
          <h2>Transition History</h2>
        </div>
        <span className="count-badge">{history.length}</span>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          Start the automaton to see <strong>δ(q, input) → q′</strong> transitions here.
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, i) => (
            <div className="history-item" key={i}>
              <span className="step">{i + 1}</span>
              <code>{item.from}</code>
              <span>— {item.input} →</span>
              <code className="to-state">{item.to}</code>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}