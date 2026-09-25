export const states = [
  { id: "q0", name: "Idle", description: "Machine is waiting for input.", type: "normal" },
  { id: "q1", name: "Book Scanned", description: "The book has been scanned.", type: "normal" },
  { id: "q2", name: "Member Verification", description: "The member ID is being verified.", type: "normal" },
  { id: "q3", name: "Check Availability", description: "The machine checks whether the book is available.", type: "normal" },
  { id: "q4", name: "Issue Book", description: "The issue operation is ready for confirmation.", type: "normal" },
  { id: "q5", name: "Book Not Available", description: "The requested book is unavailable.", type: "error" },
  { id: "q6", name: "Book Issued", description: "Book issue completed successfully.", type: "accepting" },
  { id: "q7", name: "Return Processing", description: "The machine is processing a returned book.", type: "normal" },
  { id: "q8", name: "Return Complete", description: "Book return completed successfully.", type: "accepting" },
  { id: "q9", name: "Access Denied", description: "Member verification failed.", type: "error" },
  { id: "q10", name: "Fine Payment", description: "A pending fine must be paid.", type: "normal" }
];

export const initialState = "q0";
export const acceptingStates = ["q6", "q8"];