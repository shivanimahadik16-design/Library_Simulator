const millisecondsPerDay = 24 * 60 * 60 * 1000;
const finePerOverdueDayPerBook = 2;
const fineFreeDays = 10;

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const timestamp = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) {
    return null;
  }

  return timestamp;
}

export function calculateLoanFine(issueDate, returnDate, bookCount) {
  const issueTimestamp = parseDate(issueDate);
  const returnTimestamp = parseDate(returnDate);

  if (issueTimestamp === null) {
    return { error: "Enter a valid issue date." };
  }

  if (returnTimestamp === null) {
    return { error: "Enter a valid return date." };
  }

  if (returnTimestamp < issueTimestamp) {
    return { error: "Return date cannot be before the issue date." };
  }

  if (!Number.isInteger(bookCount) || bookCount < 1) {
    return { error: "The number of books must be a positive whole number." };
  }

  const daysBorrowed = (returnTimestamp - issueTimestamp) / millisecondsPerDay;
  const overdueDays = Math.max(0, daysBorrowed - fineFreeDays);

  return {
    daysBorrowed,
    overdueDays,
    fineAmount: overdueDays * finePerOverdueDayPerBook * bookCount
  };
}
