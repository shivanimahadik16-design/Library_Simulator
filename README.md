# Library Self-Issue Machine – Finite Automata Simulator

A React + Vite mini project for **Finite Automata and Formal Languages (FAFL)**.

## Features

- 11-state library self-issue/return finite-state machine
- Interactive transition buttons
- Animated SVG state diagram
- Current-state highlighting
- Animated transition edge
- Transition history / execution trace
- Reset and animation speed control
- Predefined successful issue demo
- Formal automaton definition `M = (Q, Σ, δ, q0, F)`
- Input-string tester for accepted/rejected sequences
- Invalid transition detection
- State details and accepting-state information

## Automaton

### States

`Q = {q0,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10}`

### Initial state

`q0`

### Accepting states

`F = {q6,q8}`

### Example transitions

- `q0 --issue_book--> q1`
- `q1 --check_member--> q2`
- `q2 --valid_id--> q3`
- `q2 --invalid_id--> q9`
- `q3 --book_available--> q4`
- `q3 --book_unavailable--> q5`
- `q4 --confirm--> q6`
- `q0 --return_book--> q7`
- `q7 --no_fine--> q8`
- `q7 --fine_due--> q10`
- `q10 --payment_done--> q8`

## Run the project

Install Node.js first, then from this folder:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, normally:

```text
http://localhost:5173
```

## Build for production

```bash
npm run build
```

## Suggested demo

1. Start at q0.
2. Click **Issue Book**.
3. Click **Check Member**.
4. Click **Valid ID**.
5. Click **Book Available**.
6. Click **Confirm Issue**.
7. Observe q6, the accepting state.
8. Click Exit to return to q0.
9. Demonstrate Invalid ID and Book Unavailable branches.
10. Try the Input String Tester with:
   `issue_book,check_member,valid_id,book_available,confirm`

## FAFL concepts demonstrated

- Finite automaton
- Alphabet
- States
- Initial state
- Accepting states
- Transition function
- Strings over an alphabet
- Accepted/rejected strings
- Deterministic transitions
- State-transition visualization
- Execution trace
