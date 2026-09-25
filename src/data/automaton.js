import { getTransition } from "./transitions";

export function getNextState(currentState, input) {
  const transition = getTransition(currentState, input);
  return transition ? transition.to : null;
}

export function simulateString(inputString, startState = "q0") {
  const tokens = inputString
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  let current = startState;
  const trace = [];
  let error = null;

  for (const input of tokens) {
    const transition = getTransition(current, input);

    if (!transition) {
      error = {
        state: current,
        input,
        message: `No transition exists from ${current} on "${input}".`
      };
      break;
    }

    trace.push({
      from: current,
      input,
      to: transition.to
    });

    current = transition.to;
  }

  return {
    tokens,
    trace,
    finalState: current,
    accepted: !error && ["q6", "q8"].includes(current),
    error
  };
}