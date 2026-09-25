export const transitions = [
  { from: "q0", input: "issue_book", label: "issue book", to: "q1" },
  { from: "q1", input: "check_member", label: "check member ID", to: "q2" },
  { from: "q2", input: "valid_id", label: "valid ID", to: "q3" },
  { from: "q2", input: "invalid_id", label: "invalid ID", to: "q9" },
  { from: "q3", input: "book_available", label: "book available", to: "q4" },
  { from: "q3", input: "book_unavailable", label: "not available", to: "q5" },
  { from: "q4", input: "confirm", label: "confirm", to: "q6" },
  { from: "q5", input: "exit", label: "exit", to: "q0" },
  { from: "q6", input: "exit", label: "done / exit", to: "q0" },
  { from: "q0", input: "return_book", label: "return book", to: "q7" },
  { from: "q7", input: "no_fine", label: "no fine", to: "q8" },
  { from: "q7", input: "fine_due", label: "fine due", to: "q10" },
  { from: "q10", input: "payment_done", label: "payment done", to: "q8" },
  { from: "q8", input: "exit", label: "exit", to: "q0" },
  { from: "q9", input: "exit", label: "exit", to: "q0" },
  { from: "q0", input: "cancel", label: "wait / cancel", to: "q0" }
];

export function getTransition(from, input) {
  return transitions.find(t => t.from === from && t.input === input) || null;
}

export function getAvailableInputs(state) {
  return transitions.filter(t => t.from === state);
}