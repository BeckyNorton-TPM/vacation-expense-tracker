const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.errors?.join(", ") || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export function createExpense(expense) {
  return request("/expenses", { method: "POST", body: JSON.stringify(expense) });
}

export function listExpenses() {
  return request("/expenses");
}

export function getTotals() {
  return request("/expenses/totals");
}

export function clearExpenses() {
  return request("/expenses", { method: "DELETE" });
}
