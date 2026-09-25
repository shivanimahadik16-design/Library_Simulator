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

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function processInput(input, auto = false) {
    const transition = getTransition(currentState, input);

    if (!transition) {
      setMessage(`Invalid transition: ${currentState} + ${input}`);
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
    return true;
  }

  async function runScenario() {
    if (running) return;
    setRunning(true);
    setCurrentState("q0");
    setSelectedState("q0");
    setHistory([]);
    setLastInput(null);
    setMessage("Running successful issue scenario...");

    for (const input of demo) {
      const ok = await processInput(input, true);
      if (!ok) break;
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
          <span className="eyebrow">FAFL MINI PROJECT • FINITE AUTOMATA</span>
          <h1>📚 Library Self-Issue Machine</h1>
          <p>Interactive DFA/FSM simulator with animated states, transitions and formal-language testing.</p>
        </div>
        <div className="machine-status">
          <span className="status-dot" />
          <div>
            <small>CURRENT STATE</small>
            <strong>{currentState}</strong>
          </div>
        </div>
      </header>

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
    </main>
  );
}