import React, { useMemo, useState } from "react";
import AutomataDiagram from "./components/AutomataDiagram";
import ControlPanel from "./components/ControlPanel";
import TransitionHistory from "./components/TransitionHistory";
import AutomatonInfo from "./components/AutomatonInfo";
import StringTester from "./components/StringTester";
import { states } from "./data/states";
import { getTransition } from "./data/transitions";

const demo = [
  "issue_book",
  "check_member",
  "valid_id",
  "book_available",
  "confirm",
  "exit"
];

export default function App() {
  const [currentState, setCurrentState] = useState("q0");
  const [selectedState, setSelectedState] = useState("q0");
  const [history, setHistory] = useState([]);
  const [animatingEdge, setAnimatingEdge] = useState(null);
  const [lastInput, setLastInput] = useState(null);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [message, setMessage] = useState("Machine ready. Waiting for input.");

  const stateDetails = useMemo(
    () => states.find(s => s.id === selectedState) || states[0],
    [selectedState]
  );
  const issueFlowActive = ["q1", "q2", "q3", "q4", "q5", "q6", "q9"].includes(currentState);
  const returnFlowActive = ["q7", "q8", "q10"].includes(currentState);

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function processInput(input, fromState = currentState) {
    const transition = getTransition(fromState, input);

    if (!transition) {
      setMessage(`Invalid transition: ${fromState} + ${input}`);
      return false;
    }

    setLastInput(input);
    setAnimatingEdge({ from: transition.from, to: transition.to });
    setSelectedState(transition.from);
    setMessage(`Applying δ(${transition.from}, ${input}) = ${transition.to}`);

    await wait(Math.max(180, speed * 0.55));

    setCurrentState(transition.to);
    setSelectedState(transition.to);
    setHistory(prev => [
      ...prev,
      { from: transition.from, input, to: transition.to }
    ]);

    await wait(Math.max(100, speed * 0.45));
    setAnimatingEdge(null);
    setMessage(`Transition complete. Current state: ${transition.to}`);
    return transition.to;
  }

  async function runScenario() {
    if (running) return;
    setRunning(true);
    setCurrentState("q0");
    setSelectedState("q0");
    setHistory([]);
    setLastInput(null);
    setMessage("Running successful issue scenario...");

    let scenarioState = "q0";
    for (const input of demo) {
      const nextState = await processInput(input, scenarioState);
      if (!nextState) break;
      scenarioState = nextState;
    }

    setRunning(false);
    setMessage("Demo complete.");
  }

  function reset() {
    setRunning(false);
    setCurrentState("q0");
    setSelectedState("q0");
    setHistory([]);
    setAnimatingEdge(null);
    setLastInput(null);
    setMessage("Machine reset. Waiting for input.");
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <span className="eyebrow">LIBRARY SELF-SERVICE • FA SIMULATOR</span>
          <h1>📚 Library Self-Service Terminal</h1>
          <p>Borrow and return books through a guided self-service workflow.</p>
        </div>
        <div className="machine-status">
          <span className="status-dot" />
          <div>
            <small>CURRENT STATE</small>
            <strong>{currentState}</strong>
          </div>
        </div>
      </header>

      <nav className="service-options" aria-label="Library machine services">
        <div className="service-heading">
          <span className="eyebrow">SELF-SERVICE</span>
          <h2>What would you like to do?</h2>
          <p>Choose a service to begin. Follow the on-screen prompts to finish.</p>
        </div>
        <div className="service-actions">
          <button
            className={`service-option ${issueFlowActive ? "service-option-active" : ""}`}
            onClick={() => processInput("issue_book")}
            disabled={running || currentState !== "q0"}
          >
            <span className="service-icon issue-icon" aria-hidden="true">↗</span>
            <span className="service-copy">
              <strong>Borrow a book</strong>
              <small>Scan and issue an available item</small>
              <em>{issueFlowActive ? "In progress" : "Issue service"}</em>
            </span>
            <span className="service-arrow" aria-hidden="true">→</span>
          </button>
          <button
            className={`service-option ${returnFlowActive ? "service-option-active" : ""}`}
            onClick={() => processInput("return_book")}
            disabled={running || currentState !== "q0"}
          >
            <span className="service-icon return-icon" aria-hidden="true">↩</span>
            <span className="service-copy">
              <strong>Return a book</strong>
              <small>Check in an item and review any fine</small>
              <em>{returnFlowActive ? "In progress" : "Return service"}</em>
            </span>
            <span className="service-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </nav>

      <div className="workspace-layout">
        <div className="primary-column">
          <section className="top-grid">
            <ControlPanel
              currentState={currentState}
              onInput={input => processInput(input)}
              onReset={reset}
              onRunScenario={runScenario}
              running={running}
              speed={speed}
              setSpeed={setSpeed}
            />

            <div className="panel current-panel">
              <span className="eyebrow">AUTOMATON STATUS</span>
              <div className="current-state-big">{currentState}</div>
              <h2>{stateDetails.name}</h2>
              <p>{stateDetails.description}</p>
              <div className="last-transition">
                <span>Last input</span>
                <code>{lastInput || "—"}</code>
              </div>
              <div className="live-message">{message}</div>
            </div>
          </section>

          <TransitionHistory history={history} />

          <AutomatonInfo
            selectedState={selectedState}
            stateDetails={stateDetails}
          />

          <StringTester />

          <footer>
            <span>M = (Q, Σ, δ, q₀, F)</span>
            <span>Built as a Finite Automata & Formal Languages mini project</span>
          </footer>
        </div>

        <aside className="diagram-sidebar" aria-label="State diagram">
          <section className="panel diagram-panel">
            <div className="panel-title-row">
              <div>
                <span className="eyebrow">LIVE VISUALIZATION</span>
                <h2>State Diagram</h2>
              </div>
              <div className="legend">
                <span><i className="legend-dot active" /> Current</span>
                <span><i className="legend-dot accepting" /> Accepting</span>
                <span><i className="legend-dot error" /> Error</span>
              </div>
            </div>

            <AutomataDiagram
              currentState={currentState}
              animatingEdge={animatingEdge}
              onSelectState={setSelectedState}
            />
          </section>
        </aside>
      </div>
    </main>
  );
}